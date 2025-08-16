# Tunnel Fix Summary

## ✅ Issue Resolved: "Blocked request... host not allowed"

### What Changed

**1. vite.config.ts** - Added dev-only host allowlist and HMR configuration:
- `allowedHosts` array for tunnel domains (LocalTunnel + Cloudflare)
- HMR configuration for WebSocket over HTTPS (port 443)
- Environment variable support for `VITE_PUBLIC_HOST`
- Changes only apply in development mode (`command === 'serve'`)

**2. .env.example** - Added tunnel configuration:
- `VITE_PUBLIC_HOST=ai-safety-monitor.loca.lt` for custom hostnames

**3. README.md** - Added "Public Dev Link (Tunnel)" section:
- Step-by-step tunnel setup instructions
- Environment variable configuration
- Usage tips and troubleshooting

### Security Notes
- Host allowlist only active in development (`npm run dev`)
- Production builds (`npm run build`) unaffected
- No secrets or hardcoded credentials added

### Verified Working
✅ **Public URL**: https://ai-safety-monitor.loca.lt
✅ **No "Blocked request" errors**
✅ **SPA routing works**: `/`, `/classrooms`, etc.
✅ **HMR functional** through tunnel
✅ **Production build** still works correctly
✅ **Chinese UI** loads properly
✅ **RBAC** role switching (PINs 0000/0303) functional

### Commands
```bash
# Start dev server + tunnel
npm run dev:share

# Or manually
npm run dev        # Terminal 1
npm run tunnel:named  # Terminal 2
```

### Fallback for Port Changes
If Vite ever uses port 5174:
```bash
npx localtunnel --port 5174 --subdomain ai-safety-monitor
```

The tunnel is now fully functional with the dark Chinese-themed UI and RBAC system!