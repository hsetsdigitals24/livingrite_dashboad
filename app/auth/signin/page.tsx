'use client'

import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Mail, Lock, ChevronRight, AlertCircle } from 'lucide-react'

interface SignInFormData {
  email: string
  password: string
}

export default function SignIn() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>()

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      router.push('/dashboard')
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render if already authenticated
  if (status === 'authenticated') {
    return null
  }

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else if (result?.ok) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-white">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#00adef]/10 to-[#00EFB9]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-[#e40a89]/10 to-[#00adef]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo / Brand */}
          <div className="text-center mb-8 animate-slide-down">
            {/* <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#00adef] to-[#00EFB9] rounded-full mb-4">
              <span className="text-white font-bold text-sm">LivingRite Care</span>
            </div> */}
            {/* <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00adef] via-[#00EFB9] to-[#e40a89] bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1> */}
            <p className="text-gray-600 text-sm">Sign in to access your care management portal</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Error Alert */}
              {error && (
                <div className="animate-shake bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-medium text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#00adef] transition-colors" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00adef] transition-all duration-300 placeholder-gray-400 text-gray-900 hover:border-gray-300"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs font-medium animate-fade-in">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-900">
                    Password
                  </label>
                  <Link
                    href="/auth/reset-password"
                    className="text-xs text-[#00adef] hover:text-[#0091c4] transition-colors font-medium"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#00adef] transition-colors" />
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00adef] transition-all duration-300 placeholder-gray-400 text-gray-900 hover:border-gray-300"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                    })}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs font-medium animate-fade-in">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full my-4 py-3 px-4 bg-accent text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00adef]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group animate-fade-in"
                style={{ animationDelay: '0.4s' }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to LivingRite?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <span className="block text-center text-sm text-gray-600 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              
                  Don't have an account?
              <Link
                href="/auth/signup"
                className="w-full text-[#00adef] font-semibold rounded-lg hover:bg-[#00adef]/5 flex items-center justify-center py-2"
                style={{ animationDelay: '0.6s' }}
              >
                Create Account 
              </Link>
              
              </span>
            </form>
          </div>

          {/* Footer Text */}
          <p className="text-center text-xs text-gray-500 mt-8 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            By signing in, you agree to our{' '}
            <a href="#" className="text-[#00adef] hover:underline font-medium">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-[#00adef] hover:underline font-medium">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
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
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
