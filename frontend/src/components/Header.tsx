// src/components/Header.tsx
import React from "react";
import { Bell, ChevronDown, Shield, Wifi } from "lucide-react";
import { EnhancedRoleMenu } from './rbac/EnhancedRoleMenu';

interface HeaderProps {
  version?: string;
}

export default function Header({ version = "v2.1.3" }: HeaderProps) {
  return (
    <header
      className="
        sticky top-0 z-40
        bg-slate-900/70 backdrop-blur border-b border-slate-800
        px-4 py-3 lg:px-6
      "
      aria-label="页面顶栏"
    >
      <div className="flex items-center justify-between">
        {/* Left: Title */}
        <div className="flex items-center">
          <div
            className="
              flex items-center justify-center
              px-6 py-2 rounded-xl
              bg-slate-800/50 border border-slate-700
            "
            role="banner"
          >
            <h1 className="text-sm font-semibold tracking-wide text-slate-100">
              学生安全监控平台
            </h1>
            <span className="ml-3 rounded-md bg-slate-700/50 px-2 py-1 text-xs text-slate-300 border border-slate-600">
              {version}
            </span>
          </div>
        </div>

        {/* Right: Status indicators and actions */}
        <div className="flex items-center gap-4">
          {/* Status indicators */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-300">
              <Wifi className="h-3 w-3 text-emerald-400" />
              <span className="text-xs">在线</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="h-3 w-3 text-sky-400" />
              <span className="text-xs">隐私合规</span>
            </div>
          </div>

          {/* Enhanced Role Menu */}
          <EnhancedRoleMenu />

          {/* Notifications */}
          <button
            className="relative inline-flex items-center justify-center rounded-xl p-2.5 text-slate-300 hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            aria-label="通知"
            title="通知"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-rose-500 border border-slate-900" />
          </button>
        </div>
      </div>
    </header>
  );
}