import { Sidebar } from "@/components/sidebar"
import { BatchOperations } from "@/components/batch-operations"

export default function BatchPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <BatchOperations />
      </main>
    </div>
  )
}
