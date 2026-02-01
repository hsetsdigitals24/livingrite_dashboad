'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Mail, Lock, User, Eye, EyeOff, Loader2, Shield, CheckCircle2, AlertCircle } from 'lucide-react'

interface AdminSignUpFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  verificationCode?: string
}

export default function AdminSignUp() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors }, watch } = useForm<AdminSignUpFormData>()

  const password = watch('password')

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Redirect based on role
      if (session.user.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
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

  const onSubmit = async (data: AdminSignUpFormData) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          verificationCode: data.verificationCode || '',
          role: 'ADMIN',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Registration failed')
      }

      setSuccessMessage('Admin account created successfully! Redirecting...')
      setTimeout(() => {
        router.push('/auth/signin')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  } 


  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
     
      <div className="w-full max-w-md animate-fade-in relative z-10">
       {/* Main card with enhanced styling */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 border border-white/20 hover:border-white/30 transition duration-500">
          {/* Header */}
          <div className="text-center mb-8 animate-slide-down" style={{ animationDelay: '0.1s' }}>
           
            <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-primary/50 bg-clip-text text-transparent mb-2">
              Admin Portal
            </h1>
            <p className="text-gray-600 text-sm">Create your administrator account</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-400/50 rounded-lg animate-bounce flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-emerald-200 text-sm font-medium">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-lg animate-shake flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Field */}
            <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Full Name
              </label>
              <div className="relative group">
                {/* <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 blur"></div> */}
                <div className="relative flex items-center">
                  <User className="absolute left-3 h-5 w-5 text-purple-400" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 hover:bg-white/10 text-slate-800 placeholder-gray-400"
                  />
                </div>
              </div>
              {errors.name && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-red-400"></span>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Email Address
              </label>
              <div className="relative group">
                {/* <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 blur"></div> */}
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 h-5 w-5 text-purple-400" />
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    {...register('email', { required: 'Email is required' })}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 hover:bg-white/10 text-slate-800 placeholder-gray-400"
                  />
                </div>
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-red-400"></span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Password
              </label>
              <div className="relative group">
                {/* <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 blur"></div> */}
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 h-5 w-5 text-purple-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Password must be at least 8 characters' },
                    })}
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 hover:bg-white/10 text-slate-800 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-purple-400 transition"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-red-400"></span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Confirm Password
              </label>
              <div className="relative group">
                {/* <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 blur"></div> */}
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 h-5 w-5 text-purple-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) =>
                        value === password || 'Passwords do not match',
                    })}
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 hover:bg-white/10 text-slate-800 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-gray-400 hover:text-purple-400 transition"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-red-400"></span>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            {/* Verification Code Field */}
            <div className="animate-scale-in" style={{ animationDelay: '0.6s' }}>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Verification Code
              </label>
              <div className="relative group">
                <div className="relative flex items-center">
                  <Shield className="absolute left-3 h-5 w-5 text-purple-400" />
                  <input
                    type="text"
                    placeholder="Enter your verification code"
                    {...register('verificationCode', { required: 'Verification code is required' })}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 hover:bg-white/10 text-slate-800 placeholder-gray-400"
                  />
                </div>
              </div>
              {errors.verificationCode && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-red-400"></span>
                  {errors.verificationCode.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 py-3 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-lg hover:shadow-2xl hover:shadow-purple-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 animate-scale-in uppercase text-sm tracking-wider"
              style={{ animationDelay: '0.6s' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating Admin Account...
                </>
              ) : (
                <> 
                  Create Admin Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 relative animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-gray-400">or</span>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 space-y-3 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <p className="text-gray-800 text-sm text-center">
              Already have an admin account?{' '}
              <Link
                href="/auth/signin"
                className="font-semibold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text hover:from-purple-300 hover:to-pink-300 transition"
              >
                Sign in
              </Link>
            </p>
            <p className="text-gray-600 text-xs text-center">
              Need help? Contact support at{' '}
              <a href="mailto:admin@livingrite.com" className="text-purple-400 hover:text-purple-300 transition">
                admin@livingrite.com
              </a>
            </p>
          </div>
        </div>

        {/* Security notice */}
        <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <p className="text-xs text-gray-400 text-center">
            <Shield className="inline-block mr-2 h-4 w-4" />
            This admin portal is protected. Ensure your password is strong and unique.
          </p>
        </div>
      </div>

       
    </div>
  )
}
