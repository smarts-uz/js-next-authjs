import { toast } from 'sonner'

export const handleClickToCopy = (data: string) => {
  if (navigator.userAgent.toLowerCase().includes('mobile')) return

  const type = 'text/plain'
  const blob = new Blob([data], { type })
  const textToCopy = [new ClipboardItem({ [type]: blob })]

  data &&
    navigator.clipboard
      .write(textToCopy)
      .then(() => toast.success('Copied to clipboard!'))
      .catch(() => toast.error('Something went wrong!'))
}
