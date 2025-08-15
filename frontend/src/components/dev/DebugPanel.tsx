// Debug component for troubleshooting
import React from 'react';

export function DebugPanel() {
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed top-4 left-4 bg-slate-800 border border-slate-600 rounded-lg p-4 text-xs z-50 max-w-sm">
      <div className="font-semibold mb-2 text-emerald-400">🔧 Debug Panel</div>
      <div className="space-y-1 text-slate-300">
        <div>React: {React.version}</div>
        <div>Node ENV: {process.env.NODE_ENV}</div>
        <div>URL: {window.location.href}</div>
        <div>DOM Ready: {document.readyState}</div>
        <div className="mt-2 text-emerald-400">
          ✅ App is running successfully!
        </div>
      </div>
    </div>
  );
}