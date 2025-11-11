"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, Download, FileText, AlertCircle } from "lucide-react"

export function BatchOperations() {
  const [importText, setImportText] = useState("")

  const exampleFormat = `app.example.com
re_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz

mail.company.io
re_def456ghi789jkl012mno345pqr678stu901vwx234yza123bc

notify.service.com
re_ghi789jkl012mno345pqr678stu901vwx234yza123bcd456ef`

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground text-balance">批量操作</h1>
        <p className="mt-2 text-sm text-muted-foreground">批量导入、导出和管理 API Keys</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 批量导入 */}
        <Card className="border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-card-foreground">批量导入</h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">按照指定格式导入多个 API Keys</p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="import-text" className="text-foreground">
                导入内容
              </Label>
              <Textarea
                id="import-text"
                placeholder={exampleFormat}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="mt-2 min-h-[300px] font-mono text-sm border-input bg-background text-foreground"
              />
            </div>

            <div className="flex items-start gap-2 rounded-md border border-primary/20 bg-primary/5 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground">格式说明：</p>
                <p className="mt-1">每个 Key 占两行：第一行是域名，第二行是 API Key</p>
                <p>不同的 Key 之间用空行分隔</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                <Upload className="mr-2 h-4 w-4" />
                导入
              </Button>
              <Button
                variant="outline"
                onClick={() => setImportText(exampleFormat)}
                className="border-border text-foreground hover:bg-accent"
              >
                <FileText className="mr-2 h-4 w-4" />
                加载示例
              </Button>
            </div>
          </div>
        </Card>

        {/* 批量导出 */}
        <Card className="border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-card-foreground">批量导出</h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">导出所有或选定的 API Keys</p>

          <div className="space-y-4">
            <div className="rounded-md border border-border bg-secondary/30 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-card-foreground">导出统计</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">总计 Keys</span>
                  <span className="font-mono font-medium text-card-foreground">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">正常</span>
                  <span className="font-mono font-medium text-success">18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">失效</span>
                  <span className="font-mono font-medium text-destructive">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">被吊销</span>
                  <span className="font-mono font-medium text-warning">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">无权限</span>
                  <span className="font-mono font-medium text-warning">1</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">导出格式</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="justify-start border-border text-foreground hover:bg-accent bg-transparent"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  文本格式
                </Button>
                <Button
                  variant="outline"
                  className="justify-start border-border text-foreground hover:bg-accent bg-transparent"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  JSON 格式
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">导出选项</Label>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start border-border text-foreground hover:bg-accent bg-transparent"
                >
                  导出所有 Keys
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-border text-foreground hover:bg-accent bg-transparent"
                >
                  仅导出正常的 Keys
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-border text-foreground hover:bg-accent bg-transparent"
                >
                  仅导出异常的 Keys
                </Button>
              </div>
            </div>

            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Download className="mr-2 h-4 w-4" />
              导出数据
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
