/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
    readonly PUBLIC_API_URL?: string;
    readonly PUBLIC_SITE_ORIGIN?: string;
    readonly PUBLIC_DISCORD_CLIENT_ID?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
