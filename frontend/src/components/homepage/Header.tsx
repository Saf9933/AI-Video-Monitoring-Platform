import React from "react";
import { Menu, Bell, ChevronDown, Shield, Wifi } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
  version?: string;
}

export default function Header({ onMenuClick, version = "v2.1.3" }: HeaderProps) {
  return (
    <header
      className="
        sticky top-0 z-40
        bg-[#14161a]/70 backdrop-blur border-b border-white/5
        px-8 sm:px-12 py-4
      "
      aria-label="页面顶栏"
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        {/* left: mobile menu */}
        <div className="flex items-center">
          {/* mobile menu */}
          <button
            onClick={onMenuClick}
            className="lg:hidden inline-flex items-center justify-center rounded-xl p-2 text-gray-300 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            aria-label="打开侧边栏菜单"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* center: title pill - now aligned left */}
        <div
          className="
            hidden sm:flex items-center
            px-8 py-2.5 rounded-2xl ml-4
            bg-white/5 border border-white/10 shadow-inner
          "
          role="banner"
        >
          <h1 className="text-sm sm:text-base font-semibold tracking-wide text-gray-100">
            学生安全监控平台
          </h1>
          <span className="ml-4 rounded-md bg-white/5 px-2.5 py-1 text-[11px] text-gray-400 border border-white/10">
            {version}
          </span>
        </div>

        {/* right: actions */}
        <div className="flex items-center gap-4">
          {/* websocket / privacy small badges */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2.5 text-gray-300">
              <Wifi className="h-3 w-3 text-emerald-400" />
              <span className="text-xs">在线</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-400">
              <Shield className="h-3 w-3 text-sky-400" />
              <span className="text-xs">隐私合规</span>
            </div>
          </div>

          {/* notifications */}
          <button
            className="relative inline-flex items-center justify-center rounded-xl p-2.5 text-gray-300 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            aria-label="通知"
            title="通知"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-rose-500 border border-[#14161a]" />
          </button>

          {/* user avatar */}
          <button
            className="group inline-flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2 border border-white/10 hover:bg-white/7.5 transition-all duration-200"
            aria-label="账户菜单"
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 grid place-items-center text-white text-sm">
              管
            </div>
            <div className="hidden sm:flex flex-col leading-tight text-left">
              <span className="text-xs text-gray-400">系统管理员</span>
              <span className="text-[11px] text-emerald-400">在线</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-200 transition-colors" />
          </button>
        </div>
      </div>

      {/* small-screen title (since center pill is hidden on xs) */}
      <div className="sm:hidden mt-4">
        <h1 className="text-base font-semibold text-gray-100">学生安全监控平台</h1>
        <p className="text-xs text-gray-400">K-12 Student Safety Platform</p>
      </div>
    </header>
  );
}
