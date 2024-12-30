import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

export function ToolsDirectory() {
  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="relative w-full max-w-2xl">
          <Input
            type="search"
            placeholder="Search AI tools..."
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-md transition-shadow hover:shadow-lg">
            <h3 className="mb-2 text-lg font-semibold">AI Tool {item}</h3>
            <p className="text-sm text-muted-foreground">A brief description of AI Tool {item} and its capabilities.</p>
            <Button className="mt-4" variant="outline">Learn More</Button>
          </div>
        ))}
      </div>
    </div>
  )
}

