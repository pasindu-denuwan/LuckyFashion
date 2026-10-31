"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileSpreadsheet,
  Shirt,
  FolderTree,
  CheckCircle2,
  Image as ImageIcon,
  FileText,
  Mail,
  Bell,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/lib/auth/require-role";

interface AdminShellProps {
  user: AdminUser;
  children: React.ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    {
      title: "Overview",
      href: "/admin/overview",
      icon: LayoutDashboard,
      roles: ["owner", "content_manager", "quotation_manager"],
    },
    {
      title: "Quotations",
      href: "/admin/quotations",
      icon: FileSpreadsheet,
      roles: ["owner", "quotation_manager"],
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: Shirt,
      roles: ["owner", "content_manager"],
    },
    {
      title: "Categories",
      href: "/admin/categories",
      icon: FolderTree,
      roles: ["owner", "content_manager"],
    },
    {
      title: "Completed Orders",
      href: "/admin/completed-orders",
      icon: CheckCircle2,
      roles: ["owner", "content_manager"],
    },
    {
      title: "Media Library",
      href: "/admin/media",
      icon: ImageIcon,
      roles: ["owner", "content_manager"],
    },
    {
      title: "Website Content",
      href: "/admin/content",
      icon: FileText,
      roles: ["owner", "content_manager"],
    },
    {
      title: "Messages",
      href: "/admin/messages",
      icon: Mail,
      roles: ["owner", "quotation_manager"],
    },
    {
      title: "Notifications",
      href: "/admin/notifications",
      icon: Bell,
      roles: ["owner", "content_manager", "quotation_manager"],
    },
    {
      title: "Business Settings",
      href: "/admin/business",
      icon: Building2,
      roles: ["owner"],
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
      roles: ["owner"],
    },
  ];

  const allowedNavItems = navItems.filter(
    (item) => user.role === "owner" || item.roles.includes(user.role)
  );

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-lucky-offwhite flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-lucky-dark text-white border-b border-purple-950">
        <div className="font-heading font-bold text-lg text-lucky-cream">Lucky Fashion Admin</div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 rounded-md text-lucky-cream hover:bg-lucky-darkCard"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Navigation (Desktop + Mobile Drawer) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-lucky-dark text-slate-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static flex flex-col border-r border-purple-950",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-purple-950 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold font-heading text-lucky-cream tracking-tight">
              Lucky Fashion
            </span>
            <span className="block text-[11px] uppercase tracking-wider text-purple-300 font-semibold mt-0.5">
              Production Admin
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-purple-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {allowedNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-lucky-magenta text-white font-semibold shadow-sm"
                    : "text-purple-200 hover:bg-lucky-darkCard hover:text-lucky-cream"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-purple-950 bg-black/20">
          <div className="flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-xs font-semibold text-lucky-cream truncate">
                {user.fullName || user.email}
              </p>
              <p className="text-[10px] uppercase font-bold text-purple-300">
                {user.role.replace("_", " ")}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-lucky-darkCard transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Topbar */}
        <div className="hidden md:flex items-center justify-between h-16 px-8 bg-white border-b border-lucky-borderLight">
          <div className="flex items-center gap-2 text-xs text-lucky-mutedText">
            <Link href="/admin/overview" className="hover:text-lucky-magenta">
              Admin
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="font-semibold text-lucky-dark capitalize">
              {pathname.split("/")[2] || "Overview"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-lucky-mutedText hover:text-lucky-magenta transition"
            >
              View Public Website ↗
            </Link>

            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 text-xs font-medium text-lucky-dark hover:text-lucky-magenta"
              >
                <div className="w-7 h-7 rounded-full bg-lucky-cream text-lucky-dark flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <span>{user.email}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-lucky-borderLight py-1 z-50">
                  <div className="px-4 py-2 border-b border-lucky-borderLight text-xs">
                    <span className="font-semibold block truncate text-lucky-dark">{user.email}</span>
                    <span className="text-[10px] text-lucky-mutedText uppercase font-bold">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
