// 'use client'

import { getWebsites } from "@/lib/actions/getWebsites"

export default async function Sites () {
    const data = await getWebsites();
    const websites = data.data;
    console.log("Websites after call on page: ", websites);

    return (
        <div>
            <h1>Working!</h1>
            {
                websites.map((website) => {
                    <div>
                        <p>{website.id}</p>
                        <p>{website.userId}</p>
                        <h1>{website.name}</h1>
                        <h1>{website.baseUrl}</h1>
                    </div>
                })
            }
        </div>
    )
} 