# Spec — Traefik BasicAuth with split routes for design.jeffli.dev

## Goal

Protect the OD web interface (HTML pages) with BasicAuth while allowing
browser JavaScript fetch() calls to API routes without BasicAuth credentials.

## Problem

A single Traefik router with BasicAuth middleware blocks ALL requests
without BasicAuth credentials — including the browser's JS fetch() calls
to `/api/*` and `<script src>` tags loading `/_next/static/*`. Browsers
can't pass BasicAuth credentials for fetch() calls or script tags, so
every API call returns 401, breaking the entire web app.

## Architecture

```
Browser
  │
  │  HTML page request → sends BasicAuth credentials (browser prompt)
  │  JS fetch() call    → NO BasicAuth credentials (browser can't send them)
  │  <script src> tag   → NO BasicAuth credentials
  │  <img src> tag      → NO BasicAuth credentials
  │
  ▼
Traefik (design.jeffli.dev)
  │
  ├── /api/*              → open-design-headers only (Bearer injection)
  ├── /_next/*            → open-design-headers only (no auth needed)
  ├── /plugin-previews/*  → open-design-headers only (poster/video assets)
  ├── /api/asset-cache*   → open-design-headers only (proxied media)
  ├── /artifacts/*        → open-design-headers only (project artifacts)
  ├── /frames/*           → open-design-headers only (live artifact frames)
  ├── /codex-pets/*       → open-design-headers only (pet spritesheets)
  └── everything else     → open-design-auth (BasicAuth) + open-design-headers
```

## Route table

| Path prefix | Auth | Reason |
|---|---|---|
| `/api/` | Bearer only | Browser JS fetch() calls can't send BasicAuth |
| `/_next/` | Bearer only | `<script src>` and `<link href>` tags can't send BasicAuth |
| `/plugin-previews/` | Bearer only | Poster/video thumbnails loaded by `<img>`/`<video>` |
| `/api/asset-cache` | Bearer only | Proxied media for plugin previews (same as /api/) |
| `/artifacts/` | Bearer only | Project artifact files loaded in iframes |
| `/frames/` | Bearer only | Live artifact frame resources |
| `/codex-pets/` | Bearer only | Pet spritesheets loaded by `<img>` |
| everything else | BasicAuth + Bearer | HTML pages, the web app shell |

## Middleware

### open-design-headers (always applied)

Injects the OD_API_TOKEN as `Authorization: Bearer <token>` so the
daemon's Bearer check passes. Also sets `X-Forwarded-Proto: https`
and `X-Frame-Options: SAMEORIGIN`.

### open-design-auth (HTML routes only)

BasicAuth with a single `admin:<apr1-hash>` user. Protects the
human-facing web app from unauthorized access.

## Security model

- **API routes**: protected by the daemon's Bearer token check.
  The token is injected by Traefik and never exposed to the browser.
  Direct access to port 7456 from non-loopback requires the token.
- **HTML routes**: protected by Traefik BasicAuth.
  The browser prompts for credentials on the first page load.
  Subsequent navigations send credentials automatically.
- **Static assets** (`/_next/`, `/plugin-previews/`, etc.): no auth.
  These are framework/asset files with no sensitive data. The Bearer
  injection ensures the daemon serves them, but no human auth is needed.

## Traefik config

```yaml
http:
  routers:
    open-design-api:
      rule: "Host(`design.jeffli.dev`) && PathPrefix(`/api/`)"
      entrypoints: websecure
      tls:
        certresolver: mytlschallenge
      service: open-design
      middlewares:
        - open-design-headers@file

    open-design-next:
      rule: "Host(`design.jeffli.dev`) && PathPrefix(`/_next/`)"
      entrypoints: websecure
      tls:
        certresolver: mytlschallenge
      service: open-design
      middlewares:
        - open-design-headers@file

    open-design-previews:
      rule: "Host(`design.jeffli.dev`) && PathPrefix(`/plugin-previews/`)"
      entrypoints: websecure
      tls:
        certresolver: mytlschallenge
      service: open-design
      middlewares:
        - open-design-headers@file

    open-design-artifacts:
      rule: "Host(`design.jeffli.dev`) && PathPrefix(`/artifacts/`)"
      entrypoints: websecure
      tls:
        certresolver: mytlschallenge
      service: open-design
      middlewares:
        - open-design-headers@file

    open-design-frames:
      rule: "Host(`design.jeffli.dev`) && PathPrefix(`/frames/`)"
      entrypoints: websecure
      tls:
        certresolver: mytlschallenge
      service: open-design
      middlewares:
        - open-design-headers@file

    open-design-pets:
      rule: "Host(`design.jeffli.dev`) && PathPrefix(`/codex-pets/`)"
      entrypoints: websecure
      tls:
        certresolver: mytlschallenge
      service: open-design
      middlewares:
        - open-design-headers@file

    open-design:
      rule: "Host(`design.jeffli.dev`)"
      entrypoints: websecure
      tls:
        certresolver: mytlschallenge
      service: open-design
      middlewares:
        - open-design-auth@file
        - open-design-headers@file

  middlewares:
    open-design-auth:
      basicAuth:
        users:
          - "admin:<apr1-hash>"

    open-design-headers:
      headers:
        customRequestHeaders:
          X-Forwarded-Proto: "https"
          Authorization: "Bearer <OD_API_TOKEN>"
        customResponseHeaders:
          X-Frame-Options: "SAMEORIGIN"

  services:
    open-design:
      loadBalancer:
        servers:
          - url: "http://host.docker.internal:7456"
        passHostHeader: true
```

## Maintenance

### Changing the BasicAuth password

```bash
printf 'newpassword' | openssl passwd -apr1 -stdin
# Paste the hash into open-design-auth.users
```

### Rotating the OD_API_TOKEN

1. Generate: `openssl rand -hex 32`
2. Update `~/open-design/.env` (OD_API_TOKEN)
3. Update `~/.config/systemd/user/open-design-daemon.service` (Environment=OD_API_TOKEN)
4. Update `~/my-openwebui/traefik/dynamic/open-design.yml` (Authorization: Bearer)
5. `systemctl --user daemon-reload && systemctl --user restart open-design-daemon`
6. Traefik auto-reloads the YAML file

## Pitfalls

- **Missing route prefix**: If the browser loads a path not in the route
  table, it falls through to the BasicAuth router. If that path is loaded
  by JS (fetch/script/img), it will 401. Add new public path prefixes as
  they are discovered.
- **Order matters**: Traefik matches the most specific rule first. The
  catch-all `open-design` router must be last so the prefix-specific
  routers match first.
- **SSE/WebSocket**: The `/api/memory/events` SSE endpoint is under
  `/api/` so it gets Bearer-only auth. The browser's EventSource can't
  send BasicAuth, so this works correctly.