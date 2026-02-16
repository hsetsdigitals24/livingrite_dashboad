import { TrustIndicators } from "@/components/trust-indicators"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTABanner } from "@/components/cta-banner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import heroImage from '@/public/service-hero.jpg'

export const metadata = {
	title: "About Us — LivingRite Care",
	description:
		"LivingRite Care brings hospital-quality home healthcare to Nigerian families — discover our mission, values and team.",
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
		<main className="bg-white text-gray-800">
			 

			{/* Full-width hero with split layout */}
			<section className="pt-24 pb-12 bg-gradient-to-b from-white to-gray-50">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
						<div>
							<p className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">About LivingRite Care</p>
							<h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">Hospital-quality care, delivered at home</h1>
							<p className="text-gray-600 mb-6 max-w-xl">
								We combine clinical excellence with compassionate support — helping patients recover safely at home while
								giving families the clarity and confidence they need.
							</p>

							<div className="flex flex-wrap gap-3">
								<Link href="/services">
									<Button size="lg" className="cursor-pointer">Explore Services</Button>
								</Link>
								<Link href={process.env.CALENDLY_URLINK || "https://calendly.com/livingrite-care/consultation" } target="_blank" rel="noopener noreferrer">
									<Button size="lg" variant="outline" className="cursor-pointer">Book a Consultation</Button>
								</Link>
							</div>
						</div>

						<div className="relative">
							<div className="aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
								<img src={heroImage.src} alt="Caregiver with patient" className="w-full h-full object-cover" />
							</div>

							<div className="absolute -bottom-6 -right-6 bg-primary text-white p-5 rounded-2xl shadow-xl border border-primary/20">
								<div className="text-2xl font-bold">98%</div>
								<div className="text-xs opacity-90">Client Satisfaction</div>
							</div>
						</div>
					</div>
				</div>
			</section>

{/* Founder's Story */}
		<section className="py-12 bg-white">
			<div className="max-w-4xl mx-auto px-6">
				<h2 className="text-3xl font-semibold text-primary mb-2">Founder's Story: Why Livingrite Care</h2>
				<p className="text-gray-600 mb-6 italic">How a clinical observation sparked a healthcare revolution</p>
				<div className="space-y-4 text-gray-700">
					<p>
						Livingrite Care was founded in 2021 by Dr. Chidinma Okongwu after she observed a recurring and deeply concerning pattern in patient care. Many patients showed improvement while receiving intensive hospital treatment, especially in the ICU, only to experience a decline in their health shortly after discharge.
					</p>

					<p>
						This deterioration often had little to do with the original illness and everything to do with what happened next. Once patients left the hospital, they lacked adequate medical supervision, structured recovery plans, and professional support during a critical healing phase. As a result, preventable complications became common, leading to unnecessary suffering and avoidable readmissions.
					</p>

					<p>
						Dr. Okongwu also recognized the financial burden faced by many families in Nigeria. Hospital care is largely funded out of pocket, making prolonged admissions extremely expensive and emotionally exhausting. Despite the high costs, patients often remained uncomfortable, disconnected from family, and vulnerable to hospital-related stress.
					</p>

					<p>
						She saw that recovery could be safer, more comfortable, and more sustainable when care continued at home under proper medical supervision. Livingrite Care was created to bridge this gap by providing expert, doctor-led home care that supports patients through recovery, restores dignity, and improves outcomes in an environment where healing feels natural and humane.
					</p>

					<p className="pt-4">
						<Link href="https://medium.com/@livingritecare/nigerias-post-acute-care-gap" target="_blank" rel="noopener noreferrer">
							<span className="text-primary font-semibold hover:underline">Read Dr. Okongwu's thought leadership article on Nigeria's post-acute care gap →</span>
						</Link>
						</p>
					</div>
				</div>
			</section>

			{/* Mission & Vision */}
			<section className="py-12 bg-gray-50">
				<div className="max-w-4xl mx-auto px-6">
					<h2 className="text-2xl font-semibold mb-4 text-primary">Mission and Vision</h2>
					<h3 className="text-lg font-medium text-accent">Our Vision</h3>
					<p className="text-gray-700 mb-4">To lead the future of out-of-hospital care in Nigeria and across Africa, where every patient is supported to heal fully, live with dignity, and never feel alone after hospital discharge.</p>

					<h3 className="text-lg font-medium mt-4 text-accent">Our Mission</h3>
					<p className="text-gray-700">Livingrite Care exists to ensure continuity of expert, compassionate healthcare beyond hospital walls. Through doctor-led, holistic home care services including neurorehabilitation, post-ICU recovery, post-surgical support, and dignified palliative care, we help patients recover safely, reduce avoidable complications, and improve quality of life for both patients and their families.</p>
				</div>
			</section>

			{/* Core Values */}
			<section className="py-12">
				<div className="max-w-4xl mx-auto px-6">
					<h2 className="text-2xl font-semibold mb-4 text-primary">Our Core Values</h2>
					<p className="text-gray-500 mb-4">These values guide every decision, interaction, and care plan at Livingrite Care.</p>
					<div className="grid gap-6 sm:grid-cols-2">
						<div>
							<h4 className="font-semibold">Continuity Without Compromise</h4>
							<p className="text-gray-700">Care does not end at discharge. We ensure support continues where patients need it most.</p>
						</div>
						<div>
							<h4 className="font-semibold">Empathy in Action</h4>
							<p className="text-gray-700">Compassion is not optional. It is embedded in how we care.</p>
						</div>
						<div>
							<h4 className="font-semibold">Clinical Excellence at Home</h4>
							<p className="text-gray-700">We deliver hospital-level expertise in the comfort of your home.</p>
						</div>
						<div>
							<h4 className="font-semibold">Safety as a Sacred Responsibility</h4>
							<p className="text-gray-700">Patient safety is at the centre of everything we do.</p>
						</div>
						<div>
							<h4 className="font-semibold">Dignity at Every Stage of Life</h4>
							<p className="text-gray-700">Every patient deserves respect, comfort, and humanity at all times.</p>
						</div>
						<div>
							<h4 className="font-semibold">Advocacy for Holistic Healing</h4>
							<p className="text-gray-700">We care for the whole person, not just treat their diagnosis.</p>
						</div>
						<div className="sm:col-span-2">
							<h4 className="font-semibold">Purpose-Driven Care</h4>
							<p className="text-gray-700">Our work is fueled by a genuine commitment to serve.</p>
						</div>
					</div>
				</div>
			</section>

			{/* Why Choose */}
			<section className="py-12 bg-gray-50">
				<div className="max-w-4xl mx-auto px-6">
					<h2 className="text-2xl font-semibold mb-4 text-primary">Why Choose Livingrite Care</h2>
					<p className="text-gray-500 mb-4">Livingrite Care offers personalized medical care designed for vulnerable recovery periods.</p>
					<div className="space-y-6 text-gray-700">
						<div>
							<h4 className="font-semibold">Doctor-Led Critical Care Oversight</h4>
							<p>Our care protocols are directed by experienced medical doctors, including neurocritical care specialists alongside our talented and experienced nurses.</p>
						</div>

						<div>
							<h4 className="font-semibold">Built for Complex Recovery</h4>
							<p>We specialize in post-discharge vulnerability, including stroke recovery, post-ICU syndrome, post-surgical complications, and end-of-life transitions.</p>
						</div>

						<div>
							<h4 className="font-semibold">Holistic, Human-Centered Care</h4>
							<p>Our care plans address physical health alongside emotional, nutritional, and psychological well-being.</p>
						</div>

						<div>
							<h4 className="font-semibold">Family-Integrated Support</h4>
							<p>We actively involve families in the care process, offering guidance and support to reduce caregiver burnout.</p>
						</div>

						<div>
							<h4 className="font-semibold">Dignified End-of-Life Care</h4>
							<p>When cure is no longer the goal, we prioritize comfort, pain control, emotional support, and dignity.</p>
						</div>
					</div>
				</div>
			</section>

			{/* Team */}
			<section className="py-12 bg-gray-50">
				<div className="container mx-auto px-4">
					<div className="text-center mb-8">
						<h2 className="text-2xl font-semibold text-accent">Meet the Team</h2>
						<p className="text-gray-600 mt-2">Experienced clinicians and caregivers driving better outcomes.</p>
					</div>

					<div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
						{team.map((m) => (
							<div key={m.name} className="bg-white border rounded-lg p-4 text-center shadow-sm">
								<div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-3 border border-gray-200">
									<img src={m.image} alt={m.name} className="w-full h-full object-cover" />
								</div>
								<div className="font-semibold">{m.name}</div>
								<div className="text-sm text-gray-500 mb-2">{m.title}</div>
								<div className="text-xs text-gray-600">{m.bio}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Impact Metrics */}
			<TrustIndicators />

			{/* Client Testimonials */}
			<TestimonialsSection />

			{/* Resources Hub */}
			<section className="py-16 bg-white">
				<div className="max-w-4xl mx-auto px-6">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-semibold text-primary mb-3">Resources & Support</h2>
						<p className="text-gray-600 max-w-2xl mx-auto">Access our collection of free guides, articles, and tools to help you understand home healthcare and make informed decisions about your family's care.</p>
					</div>

					<div className="grid md:grid-cols-3 gap-6">
						{/* Care Guides & Checklists */}
						<div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
							<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
								<svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">Care Guides & Checklists</h3>
							<p className="text-gray-600 mb-4 text-sm">Download free resources including post-stroke recovery guides, family caregiver handbooks, and care preparation checklists.</p>
							<Link href="/resources">
								<Button variant="outline" className="w-full cursor-pointer">Download Now</Button>
							</Link>
						</div>

						{/* Blog & Articles */}
						<div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
							<div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
								<svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747 0-6.002-4.5-10.747-10-10.747z" />
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">Blog & Articles</h3>
							<p className="text-gray-600 mb-4 text-sm">Read expert-written articles about home healthcare, recovery tips, wellness advice, and industry insights from our clinical team.</p>
							<Link href="/blogs">
								<Button variant="outline" className="w-full cursor-pointer">Read Articles</Button>
							</Link>
						</div>

						{/* Book Consultation */}
						<div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
							<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
								<svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">Book a Consultation</h3>
							<p className="text-gray-600 mb-4 text-sm">Ready to discuss your care needs? Schedule a free 15-minute consultation with one of our clinical specialists today.</p>
							<Link href={process.env.CALENDLY_URLINK || "https://calendly.com/livingrite-care/consultation"} target="_blank" rel="noopener noreferrer">
								<Button className="w-full cursor-pointer">Schedule Now</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Call-to-Action Banner */}
			<CTABanner />
		</main>
	)
}
