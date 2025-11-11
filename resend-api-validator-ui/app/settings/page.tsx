import { Sidebar } from "@/components/sidebar"
import { SettingsPanel } from "@/components/settings-panel"

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <SettingsPanel />
      </main>
    </div>
  )
}
