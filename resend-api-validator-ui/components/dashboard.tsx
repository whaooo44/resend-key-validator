"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertCircle, Ban, Play, Plus, Download, Upload } from "lucide-react"

// 模拟数据
const stats = [
  {
    label: "总计 Keys",
    value: "24",
    icon: CheckCircle2,
    color: "text-foreground",
  },
  {
    label: "正常",
    value: "18",
    icon: CheckCircle2,
    color: "text-success",
  },
  {
    label: "失效",
    value: "3",
    icon: XCircle,
    color: "text-destructive",
  },
  {
    label: "被吊销",
    value: "2",
    icon: Ban,
    color: "text-warning",
  },
  {
    label: "无权限",
    value: "1",
    icon: AlertCircle,
    color: "text-warning",
  },
]

const recentKeys = [
  {
    domain: "app.example.com",
    key: "re_abc123...xyz789",
    status: "active",
    lastChecked: "2 分钟前",
  },
  {
    domain: "mail.company.io",
    key: "re_def456...uvw012",
    status: "invalid",
    lastChecked: "5 分钟前",
  },
  {
    domain: "notify.service.com",
    key: "re_ghi789...rst345",
    status: "suspended",
    lastChecked: "10 分钟前",
  },
  {
    domain: "alerts.platform.net",
    key: "re_jkl012...opq678",
    status: "restricted",
    lastChecked: "15 分钟前",
  },
  {
    domain: "email.startup.co",
    key: "re_mno345...lmn901",
    status: "active",
    lastChecked: "20 分钟前",
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

export function Dashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground text-balance">仪表板</h1>
        <p className="mt-2 text-sm text-muted-foreground">监控和管理你的 Resend API Keys</p>
      </div>

      {/* 统计卡片 */}
      <div className="mb-8 grid gap-4 md:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border bg-card p-6 transition-colors hover:bg-accent/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-card-foreground">{stat.value}</p>
              </div>
              <stat.icon className={cn("h-8 w-8", stat.color)} />
            </div>
          </Card>
        ))}
      </div>

      {/* 操作按钮 */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Play className="mr-2 h-4 w-4" />
          批量检查
        </Button>
        <Button variant="outline" className="border-border text-foreground hover:bg-accent bg-transparent">
          <Plus className="mr-2 h-4 w-4" />
          添加 Key
        </Button>
        <Button variant="outline" className="border-border text-foreground hover:bg-accent bg-transparent">
          <Upload className="mr-2 h-4 w-4" />
          批量导入
        </Button>
        <Button variant="outline" className="border-border text-foreground hover:bg-accent bg-transparent">
          <Download className="mr-2 h-4 w-4" />
          导出数据
        </Button>
      </div>

      {/* 最近检查的 Keys */}
      <Card className="border-border bg-card">
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-semibold text-card-foreground">最近检查的 API Keys</h2>
          <p className="mt-1 text-sm text-muted-foreground">最近验证的 API Key 状态</p>
        </div>
        <div className="divide-y divide-border">
          {recentKeys.map((item, index) => {
            const config = statusConfig[item.status as keyof typeof statusConfig]
            const StatusIcon = config.icon

            return (
              <div key={index} className="flex items-center justify-between p-6 transition-colors hover:bg-accent/30">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                    <StatusIcon className={cn("h-5 w-5", config.color.split(" ")[1])} />
                  </div>
                  <div>
                    <p className="font-mono text-sm font-medium text-card-foreground">{item.domain}</p>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{item.key}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className={cn("border font-medium", config.color)}>
                    {config.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{item.lastChecked}</span>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
