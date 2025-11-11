"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Bell, Clock, Database } from "lucide-react"

export function SettingsPanel() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground text-balance">设置</h1>
        <p className="mt-2 text-sm text-muted-foreground">配置应用程序的行为和偏好</p>
      </div>

      <div className="space-y-6">
        {/* 通用设置 */}
        <Card className="border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-card-foreground">通用设置</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">自动检查</Label>
                <p className="text-sm text-muted-foreground">定期自动检查所有 API Keys 的状态</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">失败通知</Label>
                <p className="text-sm text-muted-foreground">当 API Key 失效时发送通知</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* 检查间隔 */}
        <Card className="border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-card-foreground">检查间隔</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="check-interval" className="text-foreground">
                自动检查间隔（分钟）
              </Label>
              <Input
                id="check-interval"
                type="number"
                defaultValue="30"
                className="mt-2 border-input bg-background text-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">设置自动检查的时间间隔，最小值为 5 分钟</p>
            </div>
          </div>
        </Card>

        {/* 通知设置 */}
        <Card className="border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-card-foreground">通知设置</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="webhook-url" className="text-foreground">
                Webhook URL
              </Label>
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://your-webhook-url.com"
                className="mt-2 border-input bg-background text-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                当检测到 API Key 状态变化时，将发送 POST 请求到此 URL
              </p>
            </div>
          </div>
        </Card>

        {/* 数据管理 */}
        <Card className="border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-card-foreground">数据管理</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-md border border-border bg-secondary/30 p-4">
              <div>
                <p className="text-sm font-medium text-card-foreground">清除历史记录</p>
                <p className="text-xs text-muted-foreground">删除所有检查历史记录</p>
              </div>
              <Button variant="outline" className="border-border text-foreground hover:bg-accent bg-transparent">
                清除
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-md border border-destructive/20 bg-destructive/5 p-4">
              <div>
                <p className="text-sm font-medium text-card-foreground">删除所有数据</p>
                <p className="text-xs text-muted-foreground">永久删除所有 API Keys 和相关数据</p>
              </div>
              <Button variant="destructive">删除</Button>
            </div>
          </div>
        </Card>

        {/* 保存按钮 */}
        <div className="flex justify-end">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">保存设置</Button>
        </div>
      </div>
    </div>
  )
}
