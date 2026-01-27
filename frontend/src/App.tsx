import { useState } from 'react'
import { Button } from "@/components/ui/button"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <h1 className="text-4xl font-bold mb-8">Vite + React + shadcn/ui</h1>

      <div className="flex flex-col items-center gap-4 p-8 border rounded-lg bg-card shadow-sm">
        <p className="text-muted-foreground">
          Tailwind CSS and shadcn/ui are now configured!
        </p>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setCount((count) => count + 1)}
            variant="default"
          >
            Count is {count}
          </Button>

          <Button
            onClick={() => setCount(0)}
            variant="outline"
          >
            Reset
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-4">
          Edit <code className="bg-muted px-1 rounded">src/App.tsx</code> to test HMR
        </p>
      </div>
    </div>
  )
}

export default App
