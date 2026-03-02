'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ContactFormData {
	name: string
	email: string
	phone: string
	subject: string
	message: string
}

export function ContactForm() {
	const [formData, setFormData] = useState<ContactFormData>({
		name: '',
		email: '',
		phone: '',
		subject: '',
		message: '',
	})
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState('')

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError('')
		setSuccess(false)

		try {
			const response = await fetch('/api/inquiries', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					inquirySource: 'contact_form',
					userId: null,
				}),
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Failed to submit form')
			}

			setSuccess(true)
			setFormData({
				name: '',
				email: '',
				phone: '',
				subject: '',
				message: '',
			})

			// Reset success message after 5 seconds
			setTimeout(() => setSuccess(false), 5000)
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : 'An error occurred'
			setError(errorMsg)
			console.error('Form submission error:', err)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="w-full">
			{/* Success Message */}
			{success && (
				<div className="mb-6 flex gap-3 rounded-lg border border-green-200 bg-green-50 p-4 animate-fade-in">
					<CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
					<div>
						<p className="font-semibold text-green-900">Message sent successfully!</p>
						<p className="text-sm text-green-800">
							We'll review your inquiry and get back to you shortly.
						</p>
					</div>
				</div>
			)}

			{/* Error Message */}
			{error && (
				<div className="mb-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 animate-fade-in">
					<AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
					<div>
						<p className="font-semibold text-red-900">Error</p>
						<p className="text-sm text-red-800">{error}</p>
					</div>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Name */}
				<div className="group animate-fade-in-up">
					<label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
						Full Name *
					</label>
					<input
						type="text"
						id="name"
						name="name"
						value={formData.name}
						onChange={handleChange}
						required
						placeholder="Your full name"
						className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
					/>
				</div>

				{/* Email & Phone */}
				<div className="grid md:grid-cols-2 gap-6">
					<div className="group animate-fade-in-up" style={{ animationDelay: '50ms' }}>
						<label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
							Email Address *
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
							placeholder="your@email.com"
							className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
						/>
					</div>

					<div className="group animate-fade-in-up" style={{ animationDelay: '100ms' }}>
						<label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
							Phone Number
						</label>
						<input
							type="tel"
							id="phone"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							placeholder="+234 (0) 123 456 7890"
							className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
						/>
					</div>
				</div>

				{/* Subject */}
				<div className="group animate-fade-in-up" style={{ animationDelay: '150ms' }}>
					<label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
						Subject *
					</label>
					<input
						type="text"
						id="subject"
						name="subject"
						value={formData.subject}
						onChange={handleChange}
						required
						placeholder="What is this about?"
						className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
					/>
				</div>

				{/* Message */}
				<div className="group animate-fade-in-up" style={{ animationDelay: '200ms' }}>
					<label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
						Message *
					</label>
					<textarea
						id="message"
						name="message"
						value={formData.message}
						onChange={handleChange}
						required
						rows={5}
						placeholder="Tell us more about your inquiry..."
						className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
					/>
				</div>

				{/* Submit Button */}
				<div className="animate-fade-in-up" style={{ animationDelay: '250ms' }}>
					<Button
						type="submit"
						disabled={loading}
						size="lg"
						className="w-full cursor-pointer bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{loading ? (
							<>
								<Loader size={20} className="animate-spin" />
								Sending...
							</>
						) : (
							<>
								<Send size={20} />
								Send Message
							</>
						)}
					</Button>
				</div>

				<p className="text-center text-xs text-gray-500">
					We typically respond within 24 hours during business hours.
				</p>
			</form>
		</div>
	)
}
