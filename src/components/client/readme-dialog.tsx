'use client'

import { useState } from 'react'

import { FileText } from 'lucide-react'

import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'

type ReadmeDialogProps = {
  repoName: string
}

type ReadmeResponse = {
  content: string
  error?: string
}

export function ReadmeDialog({ repoName }: ReadmeDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReadme = async () => {
    if (content) return // Already loaded

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/git/readme/${repoName}`)
      const data = (await response.json()) as ReadmeResponse

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to fetch README')
      }

      setContent(data.content)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      void fetchReadme()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:cursor-pointer"
          aria-label={`View README for ${repoName}`}
        >
          <FileText className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="font-mono">
            {repoName} / README.md
          </DialogTitle>
          <DialogDescription>
            Repository documentation and information
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto px-1">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading README...</div>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-destructive mb-2">Failed to load README</div>
              <div className="text-muted-foreground text-sm">{error}</div>
            </div>
          )}
          {content && !isLoading && !error && (
            <pre className="bg-muted rounded-md p-4 text-sm text-wrap break-words whitespace-pre-wrap">
              {content}
            </pre>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
