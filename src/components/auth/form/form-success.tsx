import { CheckCircledIcon } from '@radix-ui/react-icons'

interface FormSuccessProps {
  message?: string
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  return (
    message && (
      <div className="bg-emerald-500/15 py-4 px-3 rounded-md flex items-center gap-x-3 text-sm text-emerald-500">
        <CheckCircledIcon className="h-4 w-4" />
        <p>{message}</p>
      </div>
    )
  )
}
