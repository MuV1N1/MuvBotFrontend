/** Backend API origin (no trailing slash). Override with PUBLIC_API_URL in `..env`. */
export const apiBase =
    import.meta.env.PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:8080';

/** This app’s public origin (for Discord OAuth redirect_uri). Override with PUBLIC_SITE_ORIGIN. */
export const siteOrigin =
    import.meta.env.PUBLIC_SITE_ORIGIN?.replace(/\/$/, '') ?? 'http://localhost:4321';

/** Discord application client id (public). Override with PUBLIC_DISCORD_CLIENT_ID. */
export const discordClientId = import.meta.env.PUBLIC_DISCORD_CLIENT_ID ?? '';
