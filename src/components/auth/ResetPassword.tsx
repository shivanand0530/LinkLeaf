import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { resetUserPassword, clearError } from '../../store/slices/authSlice'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription } from '../ui/alert'

export const ResetPassword = () => {
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(clearError())
    setSuccess(false)

    try {
      const result = await dispatch(resetUserPassword(email))
      if (resetUserPassword.fulfilled.match(result)) {
        setSuccess(true)
      }
    } catch (error) {
      // Error is handled by Redux
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Enter your email to reset your password</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertDescription>
                If an account exists with this email, you will receive password reset instructions.
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending reset link...' : 'Reset Password'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}