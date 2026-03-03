// import { TrustIndicators } from "@/components/trust-indicators"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTABanner } from "@/components/cta-banner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RefreshCw, Heart, Stethoscope, Shield, Sparkles, Sprout, Target, Users, Activity, Handshake, Bird } from "lucide-react"
import heroImage from '@/public/service-hero.jpg'

export const metadata = {
	title: "About Us — Livingrite Care",
	description:
		"Livingrite Care brings hospital-quality home healthcare to Nigerian families — discover our mission, values and team.",
}

const team = [
	{
		name: "Aisha Bello",
		title: "Head Nurse",
		image: "/african-woman-professional-headshot.png",
		bio: "Hospital-trained nurse with 12 years experience in post-acute care.",
	},
	{
		name: "Dr. Emeka Okoye",
		title: "Clinical Lead",
		image: "/african-doctor-professional-headshot.jpg",
		bio: "Consultant in internal medicine guiding our care protocols.",
	},
	{
		name: "Ngozi Ade",
		title: "Physiotherapy Lead",
		image: "/african-woman-professional-headshot.png",
		bio: "Specialist in stroke rehab and mobility recovery.",
	},
	{
		name: "Chinedu Ibe",
		title: "Operations Manager",
		image: "/african-man-professional-headshot.png",
		bio: "Ensures smooth scheduling and caregiver matching.",
	},
]

export default function AboutPage() {
	return (
		<main className="bg-gradient-to-b from-slate-50 via-white to-slate-50 text-gray-800">
			 

			{/* Full-width hero with split layout */}
			<section className="pt-32 pb-20 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
				<div className="container mx-auto px-4 relative z-10">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
						<div>
							<p className="inline-flex items-center gap-2 bg-primary/10 to-accent/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-primary/20">About Livingrite Care</p>
							<h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 leading-tight mb-6">Specialized Care for the Healing Journey Back to becoming yourself</h1>
							<p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed font-light">
								 Hospital discharge is just the beginning. We are a team of neuro-specialists and educators dedicated to reimagining out-of-hospital recovery. By combining evidence-led rehabilitation with compassionate caregiver coaching, we can nurture you back to health in the place you feel safest.
							</p>

							<div className="flex flex-wrap gap-4">
								<Link href="/services">
									<Button size="lg" className="cursor-pointer bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/30 transition-all">Explore Services</Button>
								</Link>
								<Link href="/client/booking">
									<Button size="lg" variant="outline" className="cursor-pointer border-2 hover:bg-gray-50 transition-all">Book a Consultation</Button>
								</Link>
							</div>
						</div>

						<div className="relative group">
							<div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
							<div className="aspect-[4/3] rounded-3xl overflow-hidden border-2 border-gray-200 shadow-2xl relative bg-white">
								<img src={heroImage.src} alt="Caregiver with patient" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
							</div>

							<div className="absolute -bottom-8 -right-8 bg-gradient-to-br from-primary to-primary/80 text-white p-8 rounded-3xl shadow-2xl border-2 border-primary/30 backdrop-blur-sm">
								<div className="text-4xl font-black">98%</div>
								<div className="text-sm font-semibold opacity-95 mt-1">Client Satisfaction</div>
							</div>
						</div>
					</div>
				</div>
			</section>

{/* Founder's Story */}
		<section className="py-20 bg-white relative overflow-hidden">
			<div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />
			<div className="max-w-4xl mx-auto px-6 relative z-10">
				<div className="inline-block mb-8">
					<span className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-full text-sm font-semibold">Our Story</span>
				</div>
				<h2 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 mb-3">Founder's Story: Why Livingrite Care</h2>
				<p className="text-lg text-gray-500 mb-10 italic font-light">How a clinical observation sparked a healthcare revolution</p>
				<div className="space-y-6 text-gray-700 leading-relaxed">
					<p className="text-lg">
						Livingrite Care was founded in 2021 by Dr. Chidinma Okongwu after she observed a recurring and deeply concerning pattern in patient care. Many patients showed improvement while receiving intensive hospital treatment, especially in the ICU, only to experience a decline in their health shortly after discharge.
					</p>

					<p className="text-lg">
						This deterioration often had little to do with the original illness and everything to do with what happened next. Once patients left the hospital, they lacked adequate medical supervision, structured recovery plans, and professional support during a critical healing phase. As a result, preventable complications became common, leading to unnecessary suffering and avoidable readmissions.
					</p>

					<p className="text-lg">
						Dr. Okongwu also recognized the financial burden faced by many families in Nigeria. Hospital care is largely funded out of pocket, making prolonged admissions extremely expensive and emotionally exhausting. Despite the high costs, patients often remained uncomfortable, disconnected from family, and vulnerable to hospital-related stress.
					</p>

					<p className="text-lg">
						She saw that recovery could be safer, more comfortable, and more sustainable when care continued at home under proper medical supervision. Livingrite Care was created to bridge this gap by providing expert, doctor-led home care that supports patients through recovery, restores dignity, and improves outcomes in an environment where healing feels natural and humane.
					</p>

					{/* <p className="pt-6">
						<Link href="https://" target="_blank" rel="noopener noreferrer">
							<span className="text-lg font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-2">
								Read Dr. Okongwu's thought leadership article on Nigeria's post-acute care gap
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
								</svg>
							</span>
						</Link>
						</p> */}
					</div>
				</div>
			</section>

			{/* Mission & Vision */}
			<section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
				<div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -ml-48 -mt-48" />
				<div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -mr-48 -mb-48" />
				<div className="max-w-4xl mx-auto px-6 relative z-10">
					<h2 className="text-4xl md:text-5xl font-black mb-16 text-center">Mission and Vision</h2>
					<div className="grid md:grid-cols-2 gap-12">
						<div className="group">
							<div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl blur opacity-0 transition-all" />
							<div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all">
								<h3 className="text-2xl font-bold mb-4 text-primary">Our Vision</h3>
								<p className="text-white/80 leading-relaxed text-lg h-max">To lead the future of out-of-hospital care in Nigeria and across Africa, where every patient is supported to heal fully, live with dignity, and never feel alone after hospital discharge.</p>
							</div>
						</div>

						<div className="group">
							<div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-transparent rounded-2xl blur opacity-0 transition-all" />
							<div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all">
								<h3 className="text-2xl font-bold mb-4 text-primary">Our Mission</h3>
								<p className="text-white/80 leading-relaxed text-lg">Livingrite Care exists to ensure continuity of expert, compassionate healthcare beyond hospital walls. Through doctor-led, holistic home care services, we help patients recover safely, reduce complications, and improve quality of life for families.</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Core Values */}
			<section className="py-20 bg-white relative overflow-hidden">
				<div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -ml-48 -mb-48" />
				<div className="max-w-6xl mx-auto px-6 relative z-10">
					<div className="text-center mb-16">
						<span className="inline-block bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">Our Values</span>
						<h2 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 mb-4">Our Core Values</h2>
						<p className="text-xl text-gray-500 font-light">These values guide every decision, interaction, and care plan at Livingrite Care.</p>
					</div>
					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{[
							{ title: "Continuity Without Compromise", desc: "Care does not end at discharge. We ensure support continues where patients need it most.", icon: RefreshCw },
							{ title: "Empathy in Action", desc: "Compassion is not optional. It is embedded in how we care.", icon: Heart },
							{ title: "Clinical Excellence at Home", desc: "We deliver hospital-level expertise in the comfort of your home.", icon: Stethoscope },
							{ title: "Safety as a Sacred Responsibility", desc: "Patient safety is at the centre of everything we do.", icon: Shield },
							{ title: "Dignity at Every Stage of Life", desc: "Every patient deserves respect, comfort, and humanity at all times.", icon: Sparkles },
							{ title: "Advocacy for Holistic Healing", desc: "We care for the whole person, not just treat their diagnosis.", icon: Sprout },
						].map((value, idx) => {
							const Icon = value.icon
							return (
								<div key={idx} className="group relative">
									<div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
									<div className="relative bg-white border border-gray-200 rounded-2xl p-8 hover:border-primary/30 transition-all h-full">
										<div className="text-primary mb-4 group-hover:scale-110 transition-transform duration-300"><Icon size={40} strokeWidth={1.5} /></div>
										<h4 className="font-bold text-lg text-gray-900 mb-3">{value.title}</h4>
										<p className="text-gray-600 leading-relaxed">{value.desc}</p>
									</div>
								</div>
							)
						})}
					</div>
					<div className="mt-12 group relative">
						<div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
						<div className="relative bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-8 flex items-start gap-4">
							<div className="text-primary flex-shrink-0 mt-1"><Target size={32} strokeWidth={1.5} /></div>
							<div>
								<h4 className="font-bold text-xl text-gray-900 mb-3">Purpose-Driven Care</h4>
								<p className="text-gray-700 leading-relaxed text-lg">Our work is fueled by a genuine commitment to serve.</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Why Choose */}
			<section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
				<div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />
				<div className="max-w-4xl mx-auto px-6 relative z-10">
					<div className="text-center mb-16">
						<span className="inline-block bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">Why Choose Us</span>
						<h2 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 mb-4">Why Choose Livingrite Care</h2>
						<p className="text-xl text-gray-500 font-light">Livingrite Care offers personalized medical care designed for vulnerable recovery periods.</p>
					</div>
					<div className="space-y-6">
						{[
							{
								title: "Doctor-Led Critical Care Oversight",
								desc: "Our care protocols are directed by experienced medical doctors, including neurocritical care specialists alongside our talented and experienced nurses.",
								icon: Stethoscope
							},
							{
								title: "Built for Complex Recovery",
								desc: "We specialize in post-discharge vulnerability, including stroke recovery, post-ICU syndrome, post-surgical complications, and end-of-life transitions.",
								icon: Activity
							},
							{
								title: "Holistic, Human-Centered Care",
								desc: "Our care plans address physical health alongside emotional, nutritional, and psychological well-being.",
								icon: Handshake
							},
							{
								title: "Family-Integrated Support",
								desc: "We actively involve families in the care process, offering guidance and support to reduce caregiver burnout.",
								icon: Users
							},
							{
								title: "Dignified End-of-Life Care",
								desc: "When cure is no longer the goal, we prioritize comfort, pain control, emotional support, and dignity.",
								icon: Bird
							}
						].map((item, idx) => {
							const Icon = item.icon
							return (
								<div key={idx} className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:border-primary/30 transition-all">
									<div className="flex items-start gap-4">
										<div className="text-primary flex-shrink-0 group-hover:scale-110 transition-transform duration-300"><Icon size={40} strokeWidth={1.5} /></div>
										<div>
											<h4 className="font-bold text-xl text-gray-900 mb-2">{item.title}</h4>
											<p className="text-gray-600 leading-relaxed text-lg">{item.desc}</p>
										</div>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</section>

			{/* Team */}
			<section className="py-24 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
				{/* Animated background elements */}
				<div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse" />
				<div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -ml-48 -mb-48 animate-pulse" style={{animationDelay: "1s"}} />
				<div className="absolute top-1/2 left-1/4 w-72 h-72 bg-primary/3 rounded-full blur-3xl opacity-50 animate-pulse" style={{animationDelay: "2s"}} />
				
				<div className="container mx-auto px-4 relative z-10">
					{/* Section Header */}
					<div className="text-center mb-20">
						<div className="inline-block mb-6 animate-bounce" style={{animationDuration: "3s"}}>
							<span className="inline-block bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">Our Team</span>
						</div>
						<h2 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-primary to-gray-700 mb-4 leading-tight">
							Meet the Team
						</h2>
						<p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">Experienced clinicians and caregivers driving better outcomes for every patient.</p>
						<div className="h-1 w-24 bg-gradient-to-r from-primary to-accent mx-auto mt-8 rounded-full" />
					</div>

					{/* Team Grid with Staggered Animation */}
					<div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
						{team.map((m, idx) => (
							<div 
								key={m.name} 
								className="group cursor-pointer"
								style={{
									animation: `fadeInUp 0.6s ease-out ${idx * 0.15}s both`,
								}}
							>
								{/* Animated glow background */}
								<div className="absolute -inset-1 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10" />
								
								{/* Main Card */}
								<div className="relative bg-white border-2 border-gray-100 rounded-3xl p-8 text-center hover:border-primary/40 transition-all duration-500 h-full flex flex-col overflow-hidden group/card">
									{/* Top accent line */}
									<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-500" />
									
									{/* Image Container with Ring Animation */}
									<div className="relative w-40 h-40 mx-auto mb-6">
										{/* Animated rings */}
										<div className="absolute inset-0 rounded-full border-2 border-primary/20 opacity-0 group-hover:opacity-100 animate-ping" style={{animationDuration: "2s"}} />
										<div className="absolute inset-0 rounded-full border border-primary/10 opacity-0 group-hover:opacity-100 animate-pulse" />
										
										{/* Image */}
										<div className="relative w-full h-full rounded-full overflow-hidden border-4 border-gradient-to-br from-primary/30 to-accent/30 shadow-2xl group-hover:shadow-primary/50 transition-all duration-500">
											<img 
												src={m.image} 
												alt={m.name} 
												className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500" 
											/>
										</div>

										{/* Badge */}
										<div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-primary to-accent text-white rounded-full p-3 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
											<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
												<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
											</svg>
										</div>
									</div>

									{/* Content */}
									<div className="flex-grow">
										<div className="font-bold text-2xl text-gray-900 mb-2 group-hover/card:text-primary transition-colors duration-300">{m.name}</div>
										<div className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">{m.title}</div>
										<p className="text-gray-600 leading-relaxed text-sm group-hover/card:text-gray-700 transition-colors duration-300">{m.bio}</p>
									</div>

									{/* Bottom accent line */}
									<div className="mt-6 pt-6 border-t border-gray-100 opacity-0 group-hover/card:opacity-100 transition-all duration-500">
										<div className="flex justify-center gap-3">
											<div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{animationDelay: "0s"}} />
											<div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{animationDelay: "0.2s"}} />
											<div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{animationDelay: "0.4s"}} />
										</div>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* CTA Below Team */}
					<div className="mt-20 text-center">
						<p className="text-lg text-gray-600 mb-6">Ready to experience LivingRite Care?</p>
						<Link href="/client/booking">
							<Button size="lg" className="cursor-pointer bg-gradient-to-r from-primary to-primary/80 hover:shadow-2xl hover:shadow-primary/40 transition-all animate-pulse" style={{animationDuration: "3s"}}>
								Schedule a Consultation with Our Team
							</Button>
						</Link>
					</div>
				</div>

				{/* Floating elements */}
				<style>{`
					@keyframes fadeInUp {
						from {
							opacity: 0;
							transform: translateY(30px);
						}
						to {
							opacity: 1;
							transform: translateY(0);
						}
					}
				`}</style>
			</section>

			{/* Impact Metrics */}
			{/* <TrustIndicators /> */}

			{/* Client Testimonials */}
			<TestimonialsSection />
 
			{/* Call-to-Action Banner */}
			<CTABanner />
		</main>
	)
}
