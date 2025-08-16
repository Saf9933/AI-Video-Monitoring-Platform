# System Settings

The System Settings module provides a comprehensive global configuration interface for the AI Video Monitoring Platform. It includes 8 main configuration areas with role-based access control and real-time data management.

## Overview

The System Settings module is located at `/settings` and provides a tabbed interface for managing platform-wide configuration. It supports both mock and live data modes, with optimistic updates and automatic rollback on errors.

## Architecture

### Data Layer

The data layer follows a clean architecture pattern with three main components:

1. **Types** (`src/data/system/settings.types.ts`)
   - Complete TypeScript definitions for all settings
   - Interface definitions for the client API
   - Type safety across the entire module

2. **Mock Provider** (`src/data/system/settings.mock.ts`)
   - In-memory mock implementation with realistic delays
   - Generates masked login codes
   - Maintains audit log with automatic entries
   - Simulates network operations and failures

3. **Live Provider** (`src/data/system/settings.live.ts`)
   - REST API client for production backend
   - Uses standard HTTP methods (GET, POST, PATCH, DELETE)
   - Configurable through environment variables

4. **Client Factory** (`src/data/system/settings.client.ts`)
   - Runtime switching between mock and live providers
   - Controlled by `VITE_DATA_MODE` environment variable
   - Exports unified interface for all consumers

### React Hooks

The module provides React Query-based hooks for data management:

- `useSystemSettings()` - Fetch and cache settings
- `useUpdateSystemSettings()` - Optimistic updates with rollback
- `useGenerateOneTimeCode()` - Generate role-based login codes
- `useRevokeOneTimeCode()` - Revoke login codes
- `useTestNotification()` - Test notification channels
- `useTestIntegration()` - Test external integrations
- `useSystemCheck()` - Run system diagnostics
- `useReloadConfig()` - Reload configuration
- `useClearCache()` - Clear system cache
- `useExportConfig()` - Download configuration as JSON
- `useUnsavedChanges()` - Track dirty state

## Configuration Tabs

### 1. Platform Overview (平台概览)
**Read-only system status and quick actions**

- System information (version, uptime, WebSocket status)
- Queue lag monitoring
- Data mode indicator (mock/live)
- Quick actions for directors:
  - Reload configuration
  - Clear cache

### 2. Organization & Branding (组织与品牌)
**Institution branding and appearance**

- Organization name
- Logo upload (mock implementation)
- Primary theme color with live preview
- Favicon upload (mock implementation)
- Theme color token preview

### 3. Auth & Access (身份与访问)
**Authentication and role management**

- One-time login code generation/revocation
- Role-based code management (Professor: 0000, Director: 0303)
- Session length configuration
- Idle timeout settings
- Active codes table with copy/revoke actions

### 4. Alerts & Severity (告警与级别)
**Global alert thresholds and presets**

- Alert level boundaries (OK, L1, L2, L3)
- Minimum confidence thresholds
- Debounce interval configuration
- Default filter presets for new dashboards

### 5. Notifications & Channels (通知与渠道)
**Notification routing and delivery**

- Global recipient/group management
- Channel toggles (SMS, Email, WeChat Work)
- Test notification functionality
- Retry policies (none/simple/exponential)
- Rate limiting configuration

### 6. Realtime & Performance (实时与性能)
**WebSocket and performance optimization**

- WebSocket reconnection strategies
- Polling interval configuration
- P95 response time targets
- Directory virtualization toggle (1k+ items)

### 7. Integrations (集成)
**External system connections**

- API base URL configuration
- WebSocket URL settings
- LMS endpoint configuration
- Kafka broker settings
- Connection testing for all endpoints

### 8. Feature Flags (特性开关)
**Module and feature toggles**

- Core modules (Classrooms, Alerts, Analytics, Monitor Wall)
- Feature toggles (SHAP explanations, keyboard shortcuts)
- No privacy-related flags (per requirements)

### 9. Audit & Maintenance (审计与维护)
**System audit and maintenance tools**

- Recent settings changes audit log
- Configuration export (JSON download)
- System health diagnostics
- Maintenance tool access

## RBAC Integration

The module integrates with the existing RBAC system:

### Professor Role
- **Read-only access** to all settings
- Can view current configuration
- Cannot modify any settings
- Cannot generate/revoke login codes
- Cannot run maintenance operations
- UI shows disabled inputs with tooltips

### Director Role
- **Full access** to all settings
- Can modify all configuration areas
- Can generate/revoke login codes
- Can run system maintenance operations
- Can save global presets and changes
- UI shows active controls

### Role-Based UI Elements
- Save button disabled for professors with tooltip
- Generate/revoke buttons hidden for professors
- Maintenance tools restricted to directors
- Visual indicators for restricted access

## Data Management

### Mock Mode (`VITE_DATA_MODE=mock`)
- In-memory data store with persistence during session
- Realistic network delays (200-400ms)
- Automatic audit log generation
- Mock external service responses
- No actual external dependencies

### Live Mode (`VITE_DATA_MODE=live`)
- REST API integration with configurable endpoints
- Real external service testing
- Actual configuration persistence
- Production audit logging
- Environment-based configuration

### Optimistic Updates
- Changes applied immediately to UI
- Automatic rollback on API errors
- Dirty state tracking with unsaved changes banner
- Batch operations support

## Environment Configuration

```bash
# Data source mode
VITE_DATA_MODE=mock|live

# Live mode endpoints (when VITE_DATA_MODE=live)
VITE_API_BASE=http://localhost:8000/api/v1
VITE_WS_BASE=ws://localhost:8000/ws
```

## API Endpoints (Live Mode)

```
GET    /system/settings          # Get current settings
PATCH  /system/settings          # Update settings
GET    /system/info              # Get system information
GET    /system/audit             # Get audit log
POST   /system/auth/codes        # Generate login code
DELETE /system/auth/codes/:id    # Revoke login code
POST   /system/notifications/test # Test notification
POST   /system/integrations/test  # Test integration
GET    /system/check             # Run system check
POST   /system/config/reload     # Reload configuration
POST   /system/cache/clear       # Clear cache
```

## Internationalization

Full zh-CN/en support with:
- Chinese-first UI (zh-CN default)
- Complete English translations
- Proper RTL support preparation
- Context-aware translations

## Testing

### Unit Tests
- Mock provider functionality
- Settings data transformations
- RBAC permission checking
- Hook behavior validation

### Integration Tests
- Component rendering with different roles
- Tab navigation and content switching
- Form validation and submission
- Error handling and recovery

### E2E Testing Preparation
- Mock mode allows testing without backend
- Predictable data for automation
- Role switching scenarios
- Configuration persistence validation

## Security Considerations

### Access Control
- Role-based UI restrictions
- Server-side permission validation (live mode)
- One-time code security with masking
- Audit trail for all changes

### Data Protection
- No sensitive data in mock mode
- Masked login codes in UI
- Secure transmission in live mode
- Audit log integrity

## Performance Optimizations

### React Query Integration
- Automatic caching with 5-minute stale time
- Background refetching
- Optimistic updates
- Error boundary handling

### Virtualization Support
- Directory virtualization toggle
- Large dataset handling preparation
- Lazy loading support

### Network Efficiency
- Partial updates (PATCH requests)
- Debounced form submissions
- Connection pooling ready

## Future Enhancements

### Live Mode Backend
- Complete REST API implementation
- WebSocket real-time updates
- Database persistence layer
- Advanced audit logging

### Advanced Features
- Configuration versioning
- Change approval workflows
- Multi-tenant support
- Advanced permission granularity

### Integration Improvements
- SSO integration
- External service monitoring
- Advanced diagnostic tools
- Performance metrics dashboard

## Troubleshooting

### Common Issues

**Settings not saving**
- Check RBAC role (must be Director)
- Verify network connectivity in live mode
- Check browser console for errors

**Mock data not persisting**
- Mock data is session-only
- Refresh resets to defaults
- Use live mode for persistence

**Permission errors**
- Verify current role in RBAC provider
- Check role switching PIN codes
- Confirm route access permissions

**Integration tests failing**
- Verify mock service responses
- Check endpoint configuration
- Validate test network connectivity