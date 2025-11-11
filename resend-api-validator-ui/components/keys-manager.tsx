"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Ban,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Copy,
  RefreshCw,
} from "lucide-react"

// 模拟数据
const apiKeys = [
  {
    id: "1",
    domain: "app.example.com",
    key: "re_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
    status: "active",
    lastChecked: "2025-01-10 14:30:00",
    createdAt: "2024-12-01",
  },
  {
    id: "2",
    domain: "mail.company.io",
    key: "re_def456ghi789jkl012mno345pqr678stu901vwx234yza123bc",
    status: "invalid",
    lastChecked: "2025-01-10 14:25:00",
    createdAt: "2024-11-15",
  },
  {
    id: "3",
    domain: "notify.service.com",
    key: "re_ghi789jkl012mno345pqr678stu901vwx234yza123bcd456ef",
    status: "suspended",
    lastChecked: "2025-01-10 14:20:00",
    createdAt: "2024-10-20",
  },
  {
    id: "4",
    domain: "alerts.platform.net",
    key: "re_jkl012mno345pqr678stu901vwx234yza123bcd456efg789hi",
    status: "restricted",
    lastChecked: "2025-01-10 14:15:00",
    createdAt: "2024-09-05",
  },
]

const statusConfig = {
  active: {
    label: "正常",
    color: "bg-success/10 text-success border-success/20",
    icon: CheckCircle2,
  },
  invalid: {
    label: "失效",
    color: "bg-destructive/10 text-destructive border-destructive/20",
    icon: XCircle,
  },
  suspended: {
    label: "被吊销",
    color: "bg-warning/10 text-warning border-warning/20",
    icon: Ban,
  },
  restricted: {
    label: "无权限",
    color: "bg-warning/10 text-warning border-warning/20",
    icon: AlertCircle,
  },
}

export function KeysManager() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground text-balance">API Keys 管理</h1>
        <p className="mt-2 text-sm text-muted-foreground">查看和管理所有的 Resend API Keys</p>
      </div>

      {/* 搜索和筛选 */}
      <Card className="mb-6 border-border bg-card p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索域名或 API Key..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-input bg-background text-foreground"
            />
          </div>
          <Button variant="outline" className="border-border text-foreground hover:bg-accent bg-transparent">
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新状态
          </Button>
        </div>
      </Card>

      {/* Keys 列表 */}
      <Card className="border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  域名
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  API Key
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  状态
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  最后检查
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  创建时间
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {apiKeys.map((item) => {
                const config = statusConfig[item.status as keyof typeof statusConfig]
                const StatusIcon = config.icon

                return (
                  <tr key={item.id} className="transition-colors hover:bg-accent/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary">
                          <StatusIcon className={cn("h-4 w-4", config.color.split(" ")[1])} />
                        </div>
                        <span className="font-mono text-sm font-medium text-card-foreground">{item.domain}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-secondary px-2 py-1 font-mono text-xs text-card-foreground">
                          {item.key.substring(0, 20)}...
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={cn("border font-medium", config.color)}>
                        {config.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{item.lastChecked}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{item.createdAt}</td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-border bg-popover">
                          <DropdownMenuItem className="text-popover-foreground hover:bg-accent">
                            <Pencil className="mr-2 h-4 w-4" />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-popover-foreground hover:bg-accent">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            重新检查
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive hover:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
