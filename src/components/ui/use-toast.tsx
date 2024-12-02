// src/components/ui/use-toast.ts
import * as React from "react"
import { toast } from "sonner"

export const useToast = () => {
  const success = React.useCallback((message: string) => {
    toast.success(message)
  }, [])

  const error = React.useCallback((message: string) => {
    toast.error(message)
  }, [])

  const info = React.useCallback((message: string) => {
    toast(message)
  }, [])

  return { 
    toast: info, 
    success, 
    error 
  }
}