import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

interface FormErrorProps {
  message?: string
}

export const FormError = ({ message }: FormErrorProps) => {
  return (
    message && (
      <div className="bg-destructive/15 py-3 px-3 rounded-md flex items-center gap-x-3 text-sm text-destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <p>{message}</p>
      </div>
    )
  )
}
