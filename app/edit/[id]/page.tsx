'use client';
import { getWebsiteById } from '@/lib/actions/getWebsiteById';
import { updateWebsite } from '@/lib/actions/updateWebsite';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft } from 'lucide-react';

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
        <main className="min-h-screen overflow-hidden bg-zinc-950 text-zinc-50">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,37,42,.32)_1px,transparent_1px),linear-gradient(90deg,rgba(34,37,42,.26)_1px,transparent_1px)] bg-[size:64px_64px]" />
            
            {/* Blur Effects */}
            <div className="absolute left-1/2 top-32 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-950/30 blur-3xl" />
            <div className="absolute right-0 bottom-32 h-96 w-96 rounded-full bg-emerald-950/20 blur-3xl" />

            {/* Content */}
            <div className="relative px-6 py-20 sm:px-10 lg:px-16 mt-10">
                <div className="mx-auto max-w-2xl">
                    {/* Header */}
                    <div className="mb-10 flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-zinc-900/50 rounded-lg transition"
                        >
                            <ArrowLeft className="w-5 h-5 text-zinc-400 hover:text-emerald-400 transition" />
                        </button>
                        <div>
                            <h1 className="mb-2 text-4xl font-bold tracking-tight">
                                Edit <span className="text-emerald-400">Site</span>
                            </h1>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 rounded-lg border border-red-800/50 bg-red-950/30 p-4 text-red-200">
                            {error}
                        </div>
                    )}

                    {/* Form Card */}
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 backdrop-blur-xl shadow-2xl shadow-black/40">
                        {/* Website Information Section */}
                        <div className="mb-8">
                            <h2 className="mb-6 text-xl font-semibold text-emerald-400">Website Information</h2>
                            
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
                                    className={`w-full rounded-lg border bg-zinc-900/50 px-4 py-2.5 text-zinc-50 placeholder-zinc-500 transition focus:outline-none focus:ring-2 ${
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
                                    className={`w-full rounded-lg border bg-zinc-900/50 px-4 py-2.5 text-zinc-50 placeholder-zinc-500 transition focus:outline-none focus:ring-2 ${
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
                                    className={`w-full rounded-lg border bg-zinc-900/50 px-4 py-2.5 text-zinc-50 transition focus:outline-none focus:ring-2 ${
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
                        <div className="border-t border-zinc-700 pt-8">
                            <h2 className="mb-6 text-xl font-semibold text-emerald-400">Monitored Routes</h2>
                            <p className="mb-6 text-sm text-zinc-400">
                                Add up to {maxRoutes} routes to monitor. You can add frontend pages and backend health endpoints.
                            </p>

                            {/* Routes List */}
                            <div className="space-y-5 mb-6">
                                {routeData.map((route, index) => (
                                    <div key={index} className="rounded-lg border border-zinc-700 bg-zinc-900/30 p-5">
                                        <div className="mb-4 flex items-center justify-between">
                                            <span className="text-sm font-medium text-emerald-400">Route {index + 1}</span>
                                            {routeData.length > 1 && (
                                                <button
                                                    onClick={() => handleDeleteRoute(index)}
                                                    className="text-sm font-medium text-red-400 transition hover:text-red-300 cursor-pointer"
                                                >
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
                                                    className={`w-full rounded-lg border bg-zinc-900/50 px-4 py-2.5 text-zinc-50 placeholder-zinc-500 transition focus:outline-none focus:ring-2 ${
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
                                                    className={`w-full rounded-lg border bg-zinc-900/50 px-4 py-2.5 text-zinc-50 transition focus:outline-none focus:ring-2 ${
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
                                    className="w-full rounded-lg border border-emerald-400/50 bg-emerald-950/20 px-4 py-2.5 font-medium text-emerald-400 transition cursor-pointer hover:bg-emerald-950/40"
                                >
                                    + Add Route
                                </button>
                            ) : (
                                <p className="rounded-lg border border-zinc-700 bg-zinc-900/30 px-4 py-2.5 text-center text-sm text-zinc-400">
                                    Maximum of {maxRoutes} routes reached
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex gap-3 border-t border-zinc-700 pt-8">
                            <button
                                onClick={handleSubmit}
                                disabled={isSaving}
                                className="flex-1 rounded-lg bg-gradient-to-b from-emerald-500 to-emerald-600 px-6 py-3 font-medium text-zinc-950 transition duration-200 hover:from-emerald-400 hover:to-emerald-500 active:scale-95 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                onClick={() => router.back()}
                                disabled={isSaving}
                                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900/50 px-6 py-3 font-medium text-zinc-300 transition duration-200 hover:border-zinc-600 hover:bg-zinc-900 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
