"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Share2, Copy, Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createShareableLink } from "@/services/database"
import { isSupabaseConfigured } from "@/lib/supabase"

export function ShareButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const isDevelopmentMode = !isSupabaseConfigured()

  const handleCreateShareLink = async () => {
    setLoading(true)
    try {
      if (isDevelopmentMode) {
        // In development mode, just use the current URL
        setShareUrl(window.location.href)
      } else {
        const shareId = await createShareableLink()
        const url = `${window.location.origin}/access/${shareId}`
        setShareUrl(url)
      }
    } catch (error) {
      console.error("Error creating share link:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Share2 className="h-4 w-4 mr-2" />
        Share Access Link
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Access Link</DialogTitle>
            <DialogDescription>
              {isDevelopmentMode
                ? "Share this link to give others access to the financial management system."
                : "Create a secure access link that allows others to view and manage the financial data. The link will be valid for 30 days."}
            </DialogDescription>
          </DialogHeader>

          {isDevelopmentMode && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This is a demo version. In production with Supabase, this would create secure, time-limited access
                links.
              </AlertDescription>
            </Alert>
          )}

          {!shareUrl ? (
            <div className="flex justify-center py-4">
              <Button onClick={handleCreateShareLink} disabled={loading}>
                {loading ? "Creating link..." : "Create Access Link"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 mt-4">
              <div className="grid flex-1 gap-2">
                <Input value={shareUrl} readOnly className="w-full" />
                <p className="text-xs text-gray-500">
                  {isDevelopmentMode
                    ? "Share this link to give others access to the application."
                    : "This link will expire in 30 days and can be accessed by anyone with the link."}
                </p>
              </div>
              <Button size="icon" onClick={handleCopyLink}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          )}

          <DialogFooter className="sm:justify-start">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
