'use client';
import { getWebsiteById } from '@/lib/actions/getWebsiteById';
import { updateWebsite } from '@/lib/actions/updateWebsite';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft, Globe2, Plus, Radar, Save, Server, Trash2 } from 'lucide-react';

interface MonitoredRouteInput {
    routePath: string;
    routeType: 'FRONTEND_PAGE' | 'BACKEND_HEALTH';
}

interface Website {
    id: string;
    name: string;
    baseUrl: string;
    hostingProvider: string;
    monitoredRoutes: MonitoredRouteInput[];
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditWebsitePage({ params }: PageProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [websiteId, setWebsiteId] = useState<string>('');

    const [formData, setFormData] = useState({
        name: '',
        baseUrl: '',
        hostingProvider: '',
    });

    const [routeCount, setRouteCount] = useState(1);
    const maxRoutes = 3;

    const [routeData, setRouteData] = useState<MonitoredRouteInput[]>([
        {
            routePath: '',
            routeType: 'FRONTEND_PAGE',
        }
    ]);

    const hostingProviders = ['VERCEL', 'RENDER', 'RAILWAY', 'NETLIFY', 'GITHUB_PAGES', 'SUPABASE', 'OTHER'];

    // Load website data
    useEffect(() => {
        const loadWebsiteData = async () => {
            try {
                const { id } = await params;
                setWebsiteId(id);

                const response = await getWebsiteById(id);
                if (response.data) {
                    const website = response.data;
                    setFormData({
                        name: website.name,
                        baseUrl: website.baseUrl,
                        hostingProvider: website.hostingProvider,
                    });
                    setRouteData(website.monitoredRoutes || []);
                    setRouteCount(website.monitoredRoutes?.length || 1);
                } else {
                    setError('Failed to load website data');
                }
            } catch (err) {
                console.error('Error loading website:', err);
                setError('Failed to load website');
            } finally {
                setIsLoading(false);
            }
        };

        loadWebsiteData();
    }, [params]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: '' }));
        }
        setError('');
    }

    const validateRequiredField = (fieldName: string, value: string, fieldLabel: string): string => {
        if (!value || value.trim() === '') {
            return `${fieldLabel} is required`;
        }
        return '';
    }

    const validateUrl = (url: string): string => {
        try {
            new URL(url);
            return '';
        } catch {
            return 'Please enter a valid URL (e.g., https://example.com)';
        }
    }

    const validateFields = (): boolean => {
        const errors: Record<string, string> = {};

        const nameError = validateRequiredField('name', formData.name, 'Website name');
        if (nameError) errors['name'] = nameError;

        const urlError = validateRequiredField('baseUrl', formData.baseUrl, 'Base URL');
        if (urlError) {
            errors['baseUrl'] = urlError;
        } else {
            const validationError = validateUrl(formData.baseUrl);
            if (validationError) errors['baseUrl'] = validationError;
        }

        const providerError = validateRequiredField('hostingProvider', formData.hostingProvider, 'Hosting provider');
        if (providerError) errors['hostingProvider'] = providerError;

        const routeErrors: Record<string, string> = {};
        routeData.forEach((route, index) => {
            if (!route.routePath || route.routePath.trim() === '') {
                routeErrors[`route-${index}`] = 'Route path is required';
            }
            if (!route.routeType) {
                routeErrors[`routeType-${index}`] = 'Route type is required';
            }
            if ((route.routeType != 'FRONTEND_PAGE') && (route.routeType != 'BACKEND_HEALTH')) {
                routeErrors[`routeType-${index}`] = 'Route type can only be FRONTEND_PAGE or BACKEND_HEALTH';
            }
        });

        if (Object.keys(routeErrors).length > 0) {
            setFieldErrors(routeErrors);
            setError('Please fill in all route fields');
            return false;
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return false;
        }

        return true;
    }

    const handleAddRoute = () => {
        if (routeCount < maxRoutes) {
            setRouteCount((prev) => prev + 1);
            setRouteData((prev) => [
                ...prev,
                {
                    routePath: '',
                    routeType: 'FRONTEND_PAGE',
                }
            ]);
        }
    }

    const handleDeleteRoute = (index: number) => {
        setRouteData((prev) => prev.filter((_, i) => i !== index));
        setRouteCount((prev) => prev - 1);
    }

    const handleRouteChange = (index: number, field: 'routePath' | 'routeType', value: string) => {
        const newRouteData = [...routeData];
        newRouteData[index] = { ...newRouteData[index], [field]: value };
        setRouteData(newRouteData);
        const errorKey = field === 'routePath' ? `route-${index}` : `routeType-${index}`;
        if (fieldErrors[errorKey]) {
            setFieldErrors((prev) => ({ ...prev, [errorKey]: '' }));
        }
    }

    const handleSubmit = async () => {
        if (!validateFields()) {
            return;
        }

        setIsSaving(true);
        try {
            const data = { ...formData, monitoredRoutes: routeData };
            const result = await updateWebsite(websiteId, data);

            if (result.error) {
                setError(result.error.message);
            } else {
                router.push(`/sites/${result.data.monitoredRoutes[0].id}`);
            }
        } catch (err) {
            setError('Failed to update website');
            console.error('Error:', err);
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return (
            <main className="min-h-screen overflow-hidden bg-zinc-950 text-zinc-50 flex items-center justify-center">
                <Spinner className="size-8" />
            </main>
        );
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-50">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,37,42,.32)_1px,transparent_1px),linear-gradient(90deg,rgba(34,37,42,.26)_1px,transparent_1px)] bg-[size:64px_64px]" />
            <div className="absolute left-1/2 top-24 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-950/30 blur-3xl" />
            <div className="absolute bottom-24 right-0 h-96 w-96 rounded-full bg-emerald-950/20 blur-3xl" />

            <div className="relative px-6 pb-20 pt-36 sm:px-10 lg:px-16">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <button
                                onClick={() => router.back()}
                                className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-emerald-400/30 hover:text-emerald-300"
                            >
                                <ArrowLeft className="size-4" />
                                Back
                            </button>
                            <p className="font-[family-name:var(--font-architects-daughter)] text-2xl text-emerald-400">Tune signal</p>
                            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
                                Edit this Scout site.
                            </h1>
                            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
                                Update the origin and probe routes Scout uses to verify this project.
                            </p>
                        </div>
                        <div className="hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-zinc-400 backdrop-blur md:block">
                            <div className="flex items-center gap-3 text-zinc-200">
                                <Radar className="size-5 text-emerald-400" />
                                {routeData.length}/{maxRoutes} probes active
                            </div>
                            <p className="mt-2 max-w-52">Changes replace the current route set on save.</p>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 rounded-lg border border-red-800/50 bg-red-950/30 p-4 text-red-200">
                            {error}
                        </div>
                    )}

                    {/* Form Card */}
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7 lg:p-8">
                        {/* Website Information Section */}
                        <div className="mb-8">
                            <div className="mb-6 flex items-center gap-3">
                                <span className="grid size-10 place-items-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                                    <Globe2 className="size-5" />
                                </span>
                                <div>
                                    <h2 className="text-xl font-semibold text-zinc-50">Website Information</h2>
                                    <p className="text-sm text-zinc-500">Name, origin, and hosting context.</p>
                                </div>
                            </div>
                            
                            {/* Website Name */}
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Website Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="e.g., My Portfolio"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    className={`h-12 w-full rounded-xl border bg-zinc-950/60 px-4 text-zinc-50 placeholder-zinc-500 transition focus:outline-none focus:ring-2 ${
                                        fieldErrors['name']
                                            ? 'border-red-800 focus:ring-red-500/50'
                                            : 'border-zinc-700 focus:border-emerald-400/50 focus:ring-emerald-500/20'
                                    }`}
                                />
                                {fieldErrors['name'] && (
                                    <p className="mt-1 text-sm text-red-400">{fieldErrors['name']}</p>
                                )}
                            </div>

                            {/* Base URL */}
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Base URL <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="baseUrl"
                                    placeholder="e.g., https://example.com"
                                    value={formData.baseUrl}
                                    onChange={handleFormChange}
                                    className={`h-12 w-full rounded-xl border bg-zinc-950/60 px-4 text-zinc-50 placeholder-zinc-500 transition focus:outline-none focus:ring-2 ${
                                        fieldErrors['baseUrl']
                                            ? 'border-red-800 focus:ring-red-500/50'
                                            : 'border-zinc-700 focus:border-emerald-400/50 focus:ring-emerald-500/20'
                                    }`}
                                />
                                {fieldErrors['baseUrl'] && (
                                    <p className="mt-1 text-sm text-red-400">{fieldErrors['baseUrl']}</p>
                                )}
                            </div>

                            {/* Hosting Provider */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Hosting Provider <span className="text-red-400">*</span>
                                </label>
                                <select
                                    name="hostingProvider"
                                    value={formData.hostingProvider}
                                    onChange={handleFormChange}
                                    className={`h-12 w-full rounded-xl border bg-zinc-950/60 px-4 text-zinc-50 transition focus:outline-none focus:ring-2 ${
                                        fieldErrors['hostingProvider']
                                            ? 'border-red-800 focus:ring-red-500/50'
                                            : 'border-zinc-700 focus:border-emerald-400/50 focus:ring-emerald-500/20'
                                    }`}
                                >
                                    <option value="">Select a hosting provider</option>
                                    {hostingProviders.map((provider) => (
                                        <option key={provider} value={provider}>
                                            {provider.replace(/_/g, ' ')}
                                        </option>
                                    ))}
                                </select>
                                {fieldErrors['hostingProvider'] && (
                                    <p className="mt-1 text-sm text-red-400">{fieldErrors['hostingProvider']}</p>
                                )}
                            </div>
                        </div>

                        {/* Monitored Routes Section */}
                        <div className="border-t border-zinc-800 pt-8">
                            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                                <div className="flex items-center gap-3">
                                    <span className="grid size-10 place-items-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                                        <Server className="size-5" />
                                    </span>
                                    <div>
                                        <h2 className="text-xl font-semibold text-zinc-50">Monitored Routes</h2>
                                        <p className="text-sm text-zinc-500">Add frontend pages and backend health endpoints.</p>
                                    </div>
                                </div>
                                <span className="rounded-full border border-zinc-800 bg-zinc-950/60 px-3 py-1 text-xs font-medium text-zinc-400">
                                    {routeData.length}/{maxRoutes} probes
                                </span>
                            </div>

                            {/* Routes List */}
                            <div className="space-y-5 mb-6">
                                {routeData.map((route, index) => (
                                    <div key={index} className="rounded-2xl border border-zinc-800 bg-zinc-950/45 p-5 transition hover:border-emerald-400/25">
                                        <div className="mb-4 flex items-center justify-between">
                                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-300">
                                                <Radar className="size-3.5" />
                                                Route {index + 1}
                                            </span>
                                            {routeData.length > 1 && (
                                                <button
                                                    onClick={() => handleDeleteRoute(index)}
                                                    className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-red-300 transition hover:bg-red-950/30 hover:text-red-200 cursor-pointer"
                                                >
                                                    <Trash2 className="size-4" />
                                                    Delete
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {/* Route Path */}
                                            <div className="sm:col-span-2">
                                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                                    Route Path <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., / or /api/health"
                                                    value={route.routePath}
                                                    onChange={(e) =>
                                                        handleRouteChange(index, 'routePath', e.target.value)
                                                    }
                                                    className={`h-12 w-full rounded-xl border bg-zinc-950/60 px-4 text-zinc-50 placeholder-zinc-500 transition focus:outline-none focus:ring-2 ${
                                                        fieldErrors[`route-${index}`]
                                                            ? 'border-red-800 focus:ring-red-500/50'
                                                            : 'border-zinc-700 focus:border-emerald-400/50 focus:ring-emerald-500/20'
                                                    }`}
                                                />
                                                {fieldErrors[`route-${index}`] && (
                                                    <p className="mt-1 text-sm text-red-400">
                                                        {fieldErrors[`route-${index}`]}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Route Type */}
                                            <div>
                                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                                    Route Type <span className="text-red-400">*</span>
                                                </label>
                                                <select
                                                    value={route.routeType}
                                                    onChange={(e) =>
                                                        handleRouteChange(index, 'routeType', e.target.value)
                                                    }
                                                    className={`h-12 w-full rounded-xl border bg-zinc-950/60 px-4 text-zinc-50 transition focus:outline-none focus:ring-2 ${
                                                        fieldErrors[`routeType-${index}`]
                                                            ? 'border-red-800 focus:ring-red-500/50'
                                                            : 'border-zinc-700 focus:border-emerald-400/50 focus:ring-emerald-500/20'
                                                    }`}
                                                >
                                                    <option value="FRONTEND_PAGE">Frontend Page</option>
                                                    <option value="BACKEND_HEALTH">Backend Health</option>
                                                </select>
                                                {fieldErrors[`routeType-${index}`] && (
                                                    <p className="mt-1 text-sm text-red-400">
                                                        {fieldErrors[`routeType-${index}`]}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Route Button */}
                            {routeCount < maxRoutes ? (
                                <button
                                    onClick={handleAddRoute}
                                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-400/10 px-4 font-semibold text-emerald-300 transition hover:bg-emerald-400/15 cursor-pointer"
                                >
                                    <Plus className="size-4" />
                                    Add Route
                                </button>
                            ) : (
                                <p className="rounded-full border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-center text-sm text-zinc-400">
                                    Maximum of {maxRoutes} routes reached
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-zinc-800 pt-8 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                disabled={isSaving}
                                className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950/60 px-6 font-semibold text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSaving}
                                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 font-semibold text-zinc-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-500 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                            >
                                {isSaving ? (
                                    'Saving...'
                                ) : (
                                    <>
                                        <Save className="size-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
