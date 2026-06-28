# MuvBot Frontend - AI Agent Guide

## Project Overview
**MuvBot Frontend** is an Astro-based dashboard application for managing Discord bot configurations. It provides a web UI for server admins to configure bot features (moderation, welcome messages, whitelist, etc.) across their Discord guilds.

- **Framework**: Astro 7+ (SSR via Node.js adapter in standalone mode)
- **Styling**: Tailwind CSS 3+
- **Testing**: Playwright (chromium only)
- **Linting**: ESLint + Stylelint
- **Language**: TypeScript

## Core Architecture

### Authentication Flow
1. **Login**: Redirects to Discord OAuth (`/auth/callback?code=...`)
2. **Token Exchange**: Callback page exchanges code for JWT token via `POST /api/auth/login`
3. **Storage**: Token stored as `access_token` cookie (configurable expiration via "stay logged in" checkbox)
4. **Requests**: All API calls include `Authorization: Bearer {token}` header

See: `src/utils/auth.ts` (cookie management), `src/pages/index.astro` (login UI), `src/pages/auth/callback.astro` (token exchange)

### Configuration Management
**Module Pattern**: Bot features organized as reusable `.astro` components:
- `src/components/modules/GeneralModule.astro` - Prefix settings
- `src/components/modules/ModerationModule.astro` - Moderation rules
- `src/components/modules/WelcomeModule.astro` - Welcome messages
- `src/components/modules/QuitModule.astro` - Quit messages
- `src/components/modules/extensions/mc/WhitelistModule.astro` - Minecraft whitelist

New modules should follow the pattern: dark theme (`bg-gray-800`), Tailwind styling, form inputs with consistent styling.

### Routing & Pages
- `/` - Login page (redirects to dashboard if already authenticated)
- `/dashboard` - Guild list with drag-drop reordering and hide/show functionality
- `/dashboard/guilds/[guildId]/` - Guild-specific config pages:
  - `index.astro` - Overview
  - `general.astro` - General settings
  - `welcome.astro` - Welcome module
  - `quit.astro` - Quit module
  - `ticketSystem.astro` - Ticket system config
  - `extensions/mc/whitelist.astro` - MC whitelist extension

Dynamic routes use Astro's `[guildId]` naming convention.

### Client-Side State
- **Guild Order**: Stored in `localStorage.guild_order` (JSON array of guild IDs)
- **User Info**: Stored in `localStorage.user` (JSON object)
- **Remember Me**: Toggle stored in `localStorage.remember_me`

## Critical Developer Workflows

### Local Development
```bash
npm install
npm run dev          # Starts on http://localhost:4321
npm run build        # Production build
npm run preview      # Preview built output
```

### Configuration
Create `.env` file with:
```
PUBLIC_API_URL=http://localhost:8080        # Backend API (no trailing slash)
PUBLIC_SITE_ORIGIN=http://localhost:4321    # Frontend origin for OAuth redirect_uri
PUBLIC_DISCORD_CLIENT_ID=your_client_id     # Discord OAuth app client ID
```

### Testing
```bash
npm test             # Run all tests headlessly
npm run test:ui      # Run with UI debugger
npm run test:headed  # Run with visible browser
```
Tests run against `http://127.0.0.1:4321` and auto-start dev server. See `playwright.config.ts`.

### Code Quality
```bash
npm run lint         # Check JS + CSS
npm run lint:js      # ESLint only
npm run lint:css     # Stylelint only
npm run lint:fix     # Auto-fix issues
```

## Key Patterns & Conventions

### Path Aliases
TypeScript paths configured in `tsconfig.json`:
```ts
import { apiFetch } from '@utils/api';      // src/utils/api.ts
import { Layout } from '@layouts/Layout';   // src/layouts/Layout.astro
import { Button } from '@components/...';   // src/components/...
```

### API Client
**Central utility**: `src/utils/api.ts` handles all backend communication:
```ts
const data = await apiFetch('/api/guilds');  // GET with auto-injected auth header
await apiFetch('/api/users/hide/{guildId}', { method: 'DELETE' });
```
- Automatically injects `Authorization: Bearer {token}` header
- Throws on non-2xx responses
- Parses JSON (returns `undefined` for empty responses)

### Performance Monitoring
Layout wraps all fetch calls in performance tracker (`src/layouts/Layout.astro`):
- Monkey-patches `window.fetch` to log `[url, ms, status]` to `window.__perfCalls`
- Displays in `<PerfPanel>` component (bottom-right in dev)
- Useful for identifying slow API calls without dev tools

### Dark Theme
All UI uses dark color scheme:
- Backgrounds: `bg-gray-900` (body), `bg-gray-800` (cards)
- Borders: `border-gray-700`
- Accents: Purple (`text-purple-400`, `bg-indigo-600`)
- Hover states use opacity/color transitions
- Tailwind configured with standard TailwindCSS theme

### Guild Management UX
Dashboard (`src/pages/dashboard.astro`) implements:
1. **Drag-to-Reorder**: Visible guilds draggable to reorder (persisted in localStorage)
2. **Hide/Show Toggle**: Eye icon hides guilds (POST/DELETE `/api/users/hide/{guildId}`)
3. **Bot Status**: Green "Manage" button if bot installed, blue "Invite Bot" link otherwise
4. **Icon Fallback**: Uses Discord guild icon or placeholder if missing

## Integration Points

### Backend Communication
- **Base URL**: From `PUBLIC_API_URL` config (e.g., `http://localhost:8080`)
- **Endpoints** (examples from code):
  - `POST /api/auth/login` - Exchange OAuth code for JWT token
  - `GET /api/guilds` - List user's guilds
  - `POST/DELETE /api/users/hide/{guildId}` - Toggle guild visibility
- **Headers**: All requests include `Authorization: Bearer {token}` automatically

### Discord OAuth
- **Redirect URI**: `{PUBLIC_SITE_ORIGIN}/auth/callback`
- **Scopes**: `identify guilds` (read user info and guild list)
- **Client ID**: From `PUBLIC_DISCORD_CLIENT_ID` config
- Construct auth URL at `src/pages/index.astro` (see line 4)

### Docker Deployment
- Build args: `PUBLIC_API_URL`, `PUBLIC_SITE_ORIGIN`, `PUBLIC_DISCORD_CLIENT_ID`
- Entry: `node ./dist/server/entry.mjs` (Astro's server entrypoint)
- Port: 4321 (configurable via `PORT` env var)
- See `Dockerfile` for multi-stage build pattern

## Common Tasks

**Adding a new configuration module:**
1. Create `.astro` file in `src/components/modules/` (or subdirectory for extensions)
2. Match styling: dark theme with `bg-gray-800 p-6 rounded-xl border border-gray-700`
3. Use `@components`, `@utils` path aliases
4. Import in target page (e.g., `src/pages/dashboard/guilds/[guildId]/your-feature.astro`)

**Adding a new page:**
1. Create `.astro` file in `src/pages/` (respecting folder structure for routing)
2. Import `Layout` from `@layouts/Layout` and wrap content
3. Use `Navbar` component for consistency (if needed)
4. Client scripts via `<script>` tags automatically hydrate in Astro

**Connecting to new API endpoint:**
1. Use `apiFetch('/api/endpoint')` from `@utils/api`
2. Auth header auto-injected; catch errors for 4xx/5xx
3. Test in Playwright; performance logged to `window.__perfCalls`

## Troubleshooting

- **"❌ NOT SET"** shown on home page → Missing env vars in `.env` or build process
- **401 errors after login** → Token expired or invalid; catch in `apiFetch` and redirect to login
- **Guilds not loading** → Check `PUBLIC_API_URL` matches backend; verify token included in request
- **Tests timeout** → Dev server on `http://127.0.0.1:4321` must be reachable; check `playwright.config.ts`

