"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Key, Settings, FileText, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "仪表板", href: "/", icon: LayoutDashboard },
  { name: "API Keys", href: "/keys", icon: Key },
  { name: "批量操作", href: "/batch", icon: FileText },
  { name: "设置", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Key className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-mono text-sm font-semibold text-sidebar-foreground">Resend Validator</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              item.href === "/" && "bg-sidebar-accent text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        {!collapsed && (
          <div className="text-xs text-muted-foreground">
            <p className="font-mono">v1.0.0</p>
            <p className="mt-1">© 2025 Resend Validator</p>
          </div>
        )}
      </div>
    </aside>
  )
}
