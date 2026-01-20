# Configuring Auth Forms with Server Actions and React Hooks

Instead of submitting a form with the on submit handler and making a request to an api, we will use the `useActionState` hook from react an add a form action to a form that uses our server functions we just made

/(auth)/signup/page.tsx

```tsx
'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/app/components/ui/Button'
import {
  Form,
  FormGroup,
  FormLabel,
  FormInput,
  FormError,
} from '@/app/components/ui/Form'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { signUp, ActionResponse } from '@/app/actions/auth'

const initialState: ActionResponse = {
  success: false,
  message: '',
  errors: undefined,
}

export default function SignUpPage() {
  const router = useRouter()

  // Use useActionState hook for the form submission action
  const [state, formAction, isPending] = useActionState<
    ActionResponse,
    FormData
  >(async (prevState: ActionResponse, formData: FormData) => {
    try {
      const result = await signUp(formData)

      // Handle successful submission
      if (result.success) {
        toast.success('Account created successfully')
        router.push('/dashboard')
      }

      return result
    } catch (err) {
      return {
        success: false,
        message: (err as Error).message || 'An error occurred',
        errors: undefined,
      }
    }
  }, initialState)

  return (
    //... rest of the component
    <Form action={formAction} className="space-y-6">
      {state?.message && !state.success && (
        <FormError>{state.message}</FormError>
      )}

      <FormGroup>
        <FormLabel htmlFor="email">Email</FormLabel>
        <FormInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isPending}
          aria-describedby="email-error"
          className={state?.errors?.email ? 'border-red-500' : ''}
        />
        {state?.errors?.email && (
          <p id="email-error" className="text-sm text-red-500">
            {state.errors.email[0]}
          </p>
        )}
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="password">Password</FormLabel>
        <FormInput
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          disabled={isPending}
          aria-describedby="password-error"
          className={state?.errors?.password ? 'border-red-500' : ''}
        />
        {state?.errors?.password && (
          <p id="password-error" className="text-sm text-red-500">
            {state.errors.password[0]}
          </p>
        )}
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
        <FormInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          disabled={isPending}
          aria-describedby="confirmPassword-error"
          className={state?.errors?.confirmPassword ? 'border-red-500' : ''}
        />
        {state?.errors?.confirmPassword && (
          <p id="confirmPassword-error" className="text-sm text-red-500">
            {state.errors.confirmPassword[0]}
          </p>
        )}
      </FormGroup>

      <div>
        <Button type="submit" className="w-full" isLoading={isPending}>
          Sign up
        </Button>
      </div>
    </Form>
    //...rest of the component
  )
}
```

/(auth)/signin/page.tsx

```tsx
'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/app/components/ui/Button'
import {
  Form,
  FormGroup,
  FormLabel,
  FormInput,
  FormError,
} from '@/app/components/ui/Form'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { signIn, ActionResponse } from '@/app/actions/auth'

const initialState: ActionResponse = {
  success: false,
  message: '',
  errors: undefined,
}

export default function SignInPage() {
  const router = useRouter()

  // Use useActionState hook for the form submission action
  const [state, formAction, isPending] = useActionState<
    ActionResponse,
    FormData
  >(async (prevState: ActionResponse, formData: FormData) => {
    try {
      const result = await signIn(formData)

      // Handle successful submission
      if (result.success) {
        toast.success('Signed in successfully')
        router.push('/dashboard')
        router.refresh()
      }

      return result
    } catch (err) {
      return {
        success: false,
        message: (err as Error).message || 'An error occurred',
        errors: undefined,
      }
    }
  }, initialState)

  return (
    //... rest of the component
    <Form action={formAction} className="space-y-6">
      {state?.message && !state.success && (
        <FormError>{state.message}</FormError>
      )}

      <FormGroup>
        <FormLabel htmlFor="email">Email</FormLabel>
        <FormInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isPending}
          aria-describedby="email-error"
          className={state?.errors?.email ? 'border-red-500' : ''}
        />
        {state?.errors?.email && (
          <p id="email-error" className="text-sm text-red-500">
            {state.errors.email[0]}
          </p>
        )}
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="password">Password</FormLabel>
        <FormInput
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isPending}
          aria-describedby="password-error"
          className={state?.errors?.password ? 'border-red-500' : ''}
        />
        {state?.errors?.password && (
          <p id="password-error" className="text-sm text-red-500">
            {state.errors.password[0]}
          </p>
        )}
      </FormGroup>

      <div>
        <Button type="submit" className="w-full" isLoading={isPending}>
          Sign in
        </Button>
      </div>
    </Form>
    //... rest of the component
  )
}
```
