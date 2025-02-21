import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function InDevelopmentHint() {
  return (
    <Alert variant="warning" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>In Development</AlertTitle>
      <AlertDescription>
        This feature is currently under development and may not be fully functional.
      </AlertDescription>
    </Alert>
  )
} 