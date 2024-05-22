'use client'

import { useCallback, useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { useSearchParams } from 'next/navigation'

import { verification } from '@/actions/verification'
import { CardWrapper } from '@/components/auth/card/card-wrapper'
import { FormError } from '@/components/auth/form/form-error'
import { FormSuccess } from '@/components/auth/form/form-success'

export const VerificationForm = () => {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const getVerificationToken = useCallback(() => {
    verification(token)
      .then(data => {
        setSuccess(data.success)
        setError(data.error)
      })
      .catch(() => {
        setError('Something went wrong! Try again')
      })
  }, [token])

  useEffect(() => {
    getVerificationToken()
  }, [getVerificationToken])

  return (
    <CardWrapper backButtonLabel="Back to login" backButtonHref="/auth/login">
      <div className="flex w-full items-center justify-center">
        {!success && !error && <BeatLoader />}

        <FormSuccess message={success}></FormSuccess>
        <FormError message={error}></FormError>
      </div>
    </CardWrapper>
  )
}
