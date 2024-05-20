import Image from 'next/image'

interface CardHeaderProps {
  title?: string
}

export const Header = ({ title }: CardHeaderProps) => {
  return (
    <div className="f-wull flex flex-col gap-y-4 items-center">
      <div className="flex gap-x-3">
        <h1 className="text-3xl font-semibold">Auth</h1>
        <Image src="/icons/lock.svg" alt="lock" width={30} height={30} />
      </div>
      <p className="text-muted-foreground text-sm">{title}</p>
    </div>
  )
}
