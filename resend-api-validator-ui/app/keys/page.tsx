import { Sidebar } from "@/components/sidebar"
import { KeysManager } from "@/components/keys-manager"

export default function KeysPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <KeysManager />
      </main>
    </div>
  )
}
