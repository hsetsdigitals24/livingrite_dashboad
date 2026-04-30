import { ContactForm } from '@/components/forms/ContactForm'
import { CTABanner } from '@/components/cta-banner'
import { Mail, Phone, MapPin, Clock, MessageCircle, Zap, Users, Heart, DollarSign, Handshake, Globe } from 'lucide-react'

export const metadata = {
	title: 'Contact Us — LivingRite Care',
	description:
		'Get in touch with LivingRite Care. Reach out to our team with inquiries, bookings, or any questions about our home healthcare services in Nigeria.',
}

export default function ContactPage() {
	return (
		<main className="bg-gradient-to-b from-slate-50 via-white to-slate-50 text-gray-800">
			{/* Hero Section */}
			<section className="pt-32 pb-20 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

				<div className="container mx-auto px-4 relative z-10">
					<div className="text-center max-w-4xl mx-auto">
						<div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-primary/20 animate-fade-in">
							Get In Touch
						</div>

						<h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 leading-tight mb-6 animate-fade-in-up">
							We're Here to Help
						</h1>

						<p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed font-light max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
							Have questions about our services, need to book an appointment, or want to discuss your care needs? Our dedicated team is ready to support you. Reach out anytime.
						</p>
					</div>
				</div>
			</section>

			{/* Contact Methods - Quick Info */}
			<section className="py-16 relative overflow-hidden">
				<div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />

				<div className="container mx-auto px-4 relative z-10">
					<div className="grid md:grid-cols-4 gap-6">
						{[
							{
								icon: Phone,
								title: 'Call Us',
								details: '+234 (0) 800 123 4567',
								subtext: 'Available 24/7 for emergencies',
								color: 'from-blue-500 to-blue-600',
							},
							{
								icon: Mail,
								title: 'Email',
								details: 'hello@livingritecare.com',
								subtext: 'Response within 24 hours',
								color: 'from-primary to-primary/80',
							},
							{
								icon: MapPin,
								title: 'Visit Us',
								details: 'Lagos, Nigeria',
								subtext: 'Multiple locations available',
								color: 'from-red-500 to-red-600',
							},
							{
								icon: Clock,
								title: 'Hours',
								details: '24/7 Service Available',
								subtext: 'Holidays included',
								color: 'from-green-500 to-green-600',
							},
						].map((method, idx) => {
							const Icon = method.icon
							return (
								<div
									key={idx}
									className="group relative animate-fade-in-up"
									style={{ animationDelay: `${idx * 75}ms` }}
								>
									<div className="absolute -inset-1 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
									<div className="relative bg-white border border-gray-100 rounded-2xl p-6 hover:border-primary/30 transition-all h-full">
										<div className={`w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
											<Icon size={24} />
										</div>
										<h3 className="font-bold text-lg text-gray-900 mb-1">{method.title}</h3>
										<p className="text-primary font-semibold mb-1">{method.details}</p>
										<p className="text-sm text-gray-500">{method.subtext}</p>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</section>

			{/* Main Contact Section - Form + Info */}
			<section className="py-20 relative overflow-hidden">
				<div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -ml-48 -mb-48" />

				<div className="container mx-auto px-4 relative z-10">
					<div className="grid lg:grid-cols-3 gap-12 items-start">
						{/* Form */}
						<div className="lg:col-span-2">
							<div className="mb-8">
								<h2 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 mb-4">
									Send us a Message
								</h2>
								<p className="text-lg text-gray-600">
									Tell us about your needs and we'll get back to you as soon as possible.
								</p>
							</div>

							<div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-lg">
								<ContactForm />
							</div>
						</div>

						{/* Info Sidebar */}
						<div className="space-y-6">
							{/* Response Time Card */}
							<div className="group relative animate-fade-in-up" style={{ animationDelay: '100ms' }}>
								<div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
								<div className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 border border-slate-700">
									<div className="flex items-start gap-4">
										<div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
											<Zap size={24} className="text-primary" />
										</div>
										<div>
											<h3 className="font-bold text-lg mb-2">Quick Response</h3>
											<p className="text-white/80 text-sm leading-relaxed">
												Our team typically responds to inquiries within 24 hours during business days.
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* FAQ Quick Links */}
							<div className="group relative animate-fade-in-up" style={{ animationDelay: '150ms' }}>
								<div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
								<div className="relative bg-white border border-gray-200 rounded-2xl p-8">
									<h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
										<MessageCircle size={20} className="text-primary" />
										Common Questions
									</h3>
									<ul className="space-y-3">
										{[
											'How do I book a service?',
											'What payment methods do you accept?',
											'What is your cancellation policy?',
											'Do you offer emergency services?',
										].map((q, idx) => (
											<li key={idx}>
												<a
													href="/faqs"
													className="text-sm text-gray-600 hover:text-primary transition-colors flex items-start gap-2"
												>
													<span className="text-primary font-bold mt-0.5">•</span>
													{q}
												</a>
											</li>
										))}
									</ul>
								</div>
							</div>

							{/* Service Areas */}
							<div className="group relative animate-fade-in-up" style={{ animationDelay: '200ms' }}>
								<div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
								<div className="relative bg-white border border-gray-200 rounded-2xl p-8">
									<h3 className="font-bold text-lg text-gray-900 mb-4">Service Areas</h3>
									<div className="space-y-2">
										<p className="text-sm text-gray-700">
											<span className="font-semibold text-primary">Primary:</span> Lagos, Abuja
										</p>
										<p className="text-sm text-gray-700">
											<span className="font-semibold text-primary">Expanding to:</span> Port Harcourt, Ibadan
										</p>
										<p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
											Don't see your area? Contact us to discuss options.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Why Contact Us Section */}
			<section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
				<div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -ml-48 -mt-48" />
				<div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -mr-48 -mb-48" />

				<div className="container mx-auto px-4 relative z-10">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-black mb-4">Why Choose LivingRite Care?</h2>
						<p className="text-xl text-white/80 font-light max-w-2xl mx-auto">
							Direct your questions to healthcare professionals who genuinely care
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{[
							{
								title: 'Expert Team',
								desc: 'Speak with experienced nurses, doctors, and care coordinators who understand your needs.',
								icon: Users,
							},
							{
								title: 'Personalized Care',
								desc: 'Every inquiry is treated as unique. We listen and tailor solutions to your situation.',
								icon: Heart,
							},
							{
								title: 'Quick Turnaround',
								desc: 'Fast response times mean you get the information and support you need when you need it.',
								icon: Zap,
							},
							{
								title: 'Transparent Pricing',
								desc: 'No hidden fees. We clearly explain costs and answer all financial questions upfront.',
								icon: DollarSign,
							},
							{
								title: 'Trusted Partner',
								desc: 'Join hundreds of families already receiving excellent care from LivingRite.',
								icon: Handshake,
							},
							{
								title: 'Community Focus',
								desc: 'We\'re not just a service—we\'re part of the Lagos healthcare community.',
								icon: Globe,
							},
						].map((item, idx) => {
							const Icon = item.icon
							return (
								<div key={idx} className="group">
									<div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-0 transition-all duration-300" />
									<div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all h-full">
										<div className="text-5xl mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
											<Icon size={40} strokeWidth={1.5} />
										</div>
										<h3 className="text-xl font-bold mb-3">{item.title}</h3>
										<p className="text-white/80 leading-relaxed">{item.desc}</p>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<CTABanner />
		</main>
	)
}
