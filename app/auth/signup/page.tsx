'use client'

import { useState } from 'react'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react'

interface SignUpFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  invitationCode?: string
  role: 'CLIENT' | 'CAREGIVER'
  title?: 'RN' | 'DR' // Title for caregivers
}

export default function SignUp() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [requiresInvitation, setRequiresInvitation] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<SignUpFormData>()

  const password = watch('password')
  const selectedRole = watch('role')

  // Extract invitation code from URL params on mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) {
      setValue('invitationCode', code)
      setRequiresInvitation(true)
    }
  }, [setValue])

  const onSubmit = async (data: SignUpFormData) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate title is provided for caregivers
    if (data.role === 'CAREGIVER' && !data.title) {
      setError('Please select a title (RN or DR) for caregiver registration')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          invitationCode: data.invitationCode,
          role: data.role,
          ...(data.role === 'CAREGIVER' && { title: data.title }),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Registration failed')
      }

      router.push('/auth/signin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md animate-fade-in">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8 animate-slide-down">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">Join LivingRite Care today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Invitation Code Field - if required */}
            {requiresInvitation && (
              <div className="animate-scale-in" style={{ animationDelay: '0.05s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invitation Code
                </label>
                <input
                  type="text"
                  readOnly
                  {...register('invitationCode')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Your invitation code has been pre-filled</p>
              </div>
            )}

            {/* Name Field */}
            <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300 bg-gray-50 hover:bg-white"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300 bg-gray-50 hover:bg-white"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300 bg-gray-50 hover:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300 bg-gray-50 hover:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className='flex '>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am a:
                </label>
                <input type='radio' defaultChecked value='CLIENT' {...register('role', { required: 'Role is required' })} /> Client
                <input type='radio' value='CAREGIVER' {...register('role', { required: 'Role is required' })} className='ml-4' /> Caregiver
                 
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                )}
              </div>
            </div>

            {/* Title Field - Only for Caregivers */}
            {selectedRole === 'CAREGIVER' && (
              <div className="animate-scale-in">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Title *
                </label>
                <select
                  {...register('title', {
                    validate: (value) => {
                      if (selectedRole === 'CAREGIVER' && !value) {
                        return 'Title is required for caregivers'
                      }
                      return true
                    },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300 bg-gray-50 hover:bg-white"
                >
                  <option value="">-- Select a title --</option>
                  <option value="RN">Registered Nurse (RN)</option>
                  <option value="DR">Doctor (DR)</option>
                </select>
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 py-3 bg-accent text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 animate-scale-in"
              style={{ animationDelay: '0.5s' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6 animate-scale-in" style={{ animationDelay: '0.55s' }}>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            {/* Google Sign Up Button */}
            <button
              type="button"
              onClick={() => {
                setIsGoogleLoading(true)
                signIn('google', { callbackUrl: '/dashboard' })
              }}
              disabled={isGoogleLoading}
              className="w-full py-3 bg-white border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 flex items-center justify-center gap-2 animate-scale-in"
              style={{ animationDelay: '0.6s' }}
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 256 262"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="#4285F4"
                        d="M255.68 133.5c0-10.74-.96-21.06-2.74-30.98H130.5v58.66h70.24c-3.02 16.24-12.2 29.98-25.98 39.18v32.5h41.98c24.58-22.64 38.94-56 38.94-99.36z"
                      />
                      <path
                        fill="#34A853"
                        d="M130.5 261.1c35.1 0 64.56-11.62 86.08-31.5l-41.98-32.5c-11.66 7.82-26.6 12.42-44.1 12.42-33.92 0-62.68-22.9-72.98-53.72H14.82v33.76C36.24 231.96 80.14 261.1 130.5 261.1z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M57.52 155.8c-2.62-7.82-4.12-16.16-4.12-24.8s1.5-16.98 4.12-24.8V72.44H14.82C5.32 91.28 0 112.3 0 131s5.32 39.72 14.82 58.56l42.7-33.76z"
                      />
                      <path
                        fill="#EA4335"
                        d="M130.5 51.48c19.1 0 36.24 6.58 49.74 19.52l37.3-37.3C195.02 12.06 165.56 0 130.5 0 80.14 0 36.24 29.14 14.82 72.44l42.7 33.76c10.3-30.82 39.06-53.72 72.98-53.72z"
                      />
                    </svg>
                  Continue with Google
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link
                href="/auth/signin"
                className="font-semibold text-primary hover:text-blue-700 transition hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <p className="mt-4 text-center text-gray-500 text-xs animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <Link
                href="/auth/admin"
                className="font-semibold text-gray-600 hover:text-blue-700 transition hover:underline"
              >
                Admin Signup
              </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scale-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}