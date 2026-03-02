import TeamMemberCard from "@/components/team/TeamMemberCard"
import { CTABanner } from "@/components/cta-banner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Heart, Handshake, Award, Lightbulb, Globe2 } from "lucide-react"

export const metadata = {
	title: "Meet the Team — LivingRite Care",
	description:
		"Meet the dedicated professionals at LivingRite Care. Our team of doctors, nurses, and specialists are committed to delivering exceptional home healthcare in Nigeria.",
}

const teamMembers = [
	{
		name: "Dr. Chidinma Okongwu",
		title: "Founder & Chief Medical Officer",
		image: "/african-doctor-professional-headshot.jpg",
		bio: "Visionary leader with 15+ years in clinical medicine and post-acute care innovation. Dr. Okongwu founded LivingRite Care to bridge Nigeria's critical gap in out-of-hospital recovery.",
		email: "chidinma@livingritecare.com",
		linkedin: "https://linkedin.com/in/chidinma-okongwu",
		specialties: ["Healthcare Leadership", "Post-Acute Care", "Clinical Innovation"]
	},
	{
		name: "Aisha Bello",
		title: "Head Nurse & Care Operations",
		image: "/african-woman-professional-headshot.png",
		bio: "Hospital-trained RN with 12 years of experience in post-acute and critical care. Aisha ensures every patient receives compassionate, evidence-based nursing care at home.",
		email: "aisha@livingritecare.com",
		specialties: ["Clinical Nursing", "Patient Safety", "Team Leadership"]
	},
	{
		name: "Dr. Emeka Okoye",
		title: "Clinical Lead & Internal Medicine Consultant",
		image: "/african-doctor-professional-headshot.jpg",
		bio: "Consultant physician specializing in internal medicine and critical care management. Dr. Okoye guides all clinical protocols and oversees patient care pathways.",
		email: "emeka@livingritecare.com",
		specialties: ["Internal Medicine", "Critical Care", "Geriatric Medicine"]
	},
	{
		name: "Ngozi Ade",
		title: "Lead Physiotherapist",
		image: "/african-woman-professional-headshot.png",
		bio: "Specialist physiotherapist with expertise in stroke rehabilitation and mobility recovery. Ngozi designs personalized rehabilitation programs for each patient's recovery goals.",
		email: "ngozi@livingritecare.com",
		specialties: ["Stroke Rehabilitation", "Mobility Recovery", "Physical Therapy"]
	},
	{
		name: "Chinedu Ibe",
		title: "Operations Manager",
		image: "/african-man-professional-headshot.png",
		bio: "Logistics expert ensuring seamless scheduling, caregiver matching, and operational excellence. Chinedu coordinates care delivery across all our service areas.",
		email: "chinedu@livingritecare.com",
		specialties: ["Operations", "Logistics", "Caregiver Management"]
	},
	{
		name: "Grace Okonkwo",
		title: "Patient Advocacy & Wellness Coordinator",
		image: "/african-woman-professional-headshot.png",
		bio: "Dedicated advocate ensuring patient voices are heard and wellness needs are met. Grace bridges communication between families, caregivers, and clinical teams.",
		email: "grace@livingritecare.com",
		specialties: ["Patient Advocacy", "Family Support", "Care Coordination"]
	},
	{
		name: "Prof. Adeyemi Adeniran",
		title: "Clinical Advisory Board Chair",
		image: "/african-doctor-professional-headshot.jpg",
		bio: "Retired Professor of Neurology with 30+ years of experience. Prof. Adeniran provides strategic guidance on clinical excellence and neurological care protocols.",
		specialties: ["Neurology", "Clinical Strategy", "Medical Education"]
	},
	{
		name: "Musa Hassan",
		title: "Senior Caregiver & Training Lead",
		image: "/african-man-professional-headshot.png",
		bio: "Compassionate caregiver with 8+ years of hands-on experience. Musa trains and mentors our entire caregiver team, ensuring consistent, quality patient care.",
		email: "musa@livingritecare.com",
		specialties: ["Patient Care", "Caregiver Training", "Quality Assurance"]
	}
]

export default function TeamPage() {
	return (
		<main className="bg-gradient-to-b from-slate-50 via-white to-slate-50 text-gray-800">
			{/* Hero Section */}
			<section className="pt-32 pb-20 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

				<div className="container mx-auto px-4 relative z-10">
					<div className="text-center max-w-4xl mx-auto">
						<div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-primary/20 animate-fade-in">
							Meet Our Team
						</div>

						<h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 leading-tight mb-6 animate-fade-in-up">
							Dedicated Professionals Committed to Your Recovery
						</h1>

						<p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed font-light max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "100ms" }}>
							Our multidisciplinary team of doctors, nurses, physiotherapists, and care coordinators work together to deliver exceptional, compassionate home healthcare. Every member shares a common mission: supporting your journey to healing.
						</p>

						<div className="flex flex-wrap gap-4 justify-center mt-8 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
							<Link href="/client/booking">
								<Button size="lg" className="cursor-pointer bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/30 transition-all">
									Start Your Journey
								</Button>
							</Link>
							<Link href="/contact">
								<Button size="lg" variant="outline" className="cursor-pointer border-2 hover:bg-gray-50 transition-all">
									Get in Touch
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Leadership & Vision */}
			<section className="py-20 bg-white relative overflow-hidden">
				<div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />

				<div className="container mx-auto px-4 relative z-10">
					<div className="text-center mb-16">
						<span className="inline-block bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
							Leadership Philosophy
						</span>
						<h2 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 mb-4">
							Why Our Team Matters
						</h2>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{[
							{
								icon: BookOpen,
								title: "Clinically Trained",
								desc: "Every team member brings verified expertise and advanced qualifications in their field."
							},
							{
								icon: Heart,
								title: "Patient-Centered",
								desc: "We put your recovery and wellbeing at the heart of every decision and interaction."
							},
							{
								icon: Handshake,
								title: "Collaborative Care",
								desc: "Our multidisciplinary approach ensures comprehensive support across medical and wellness needs."
							},
							{
								icon: Award,
								title: "Excellence-Driven",
								desc: "We continuously pursue clinical excellence and evidence-based best practices."
							},
							{
								icon: Lightbulb,
								title: "Innovation-Focused",
								desc: "We pioneer new approaches to out-of-hospital care and patient support."
							},
							{
								icon: Globe2,
								title: "Community-Minded",
								desc: "We're committed to improving healthcare access across Nigeria and beyond."
							}
						].map((item, idx) => {
							const Icon = item.icon
							return (
								<div
									key={idx}
									className="group relative p-8 bg-gradient-to-br from-slate-50 to-slate-100 border border-gray-200 rounded-2xl hover:border-primary/30 hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1"
								>
									<div className="text-primary mb-4 group-hover:scale-110 transition-transform duration-300"><Icon size={40} strokeWidth={1.5} /></div>
									<h3 className="font-bold text-lg text-gray-900 mb-3">{item.title}</h3>
									<p className="text-gray-600 leading-relaxed">{item.desc}</p>
									<div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
								</div>
							)
						})}
					</div>
				</div>
			</section>

			{/* Team Members Grid */}
			<section className="py-20 relative overflow-hidden">
				<div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -ml-48 -mb-48" />

				<div className="container mx-auto px-4 relative z-10">
					<div className="text-center mb-16">
						<span className="inline-block bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
							Our Experts
						</span>
						<h2 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 mb-4">
							Meet the People Behind LivingRite
						</h2>
						<p className="text-xl text-gray-500 font-light">
							Handpicked professionals with deep expertise and genuine compassion
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{teamMembers.map((member, idx) => (
							<div
								key={idx}
								className="animate-fade-in-up"
								style={{ animationDelay: `${idx * 50}ms` }}
							>
								<TeamMemberCard member={member} />
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Values Section */}
			<section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
				<div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -ml-48 -mt-48" />
				<div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -mr-48 -mb-48" />

				<div className="container mx-auto px-4 relative z-10">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-black mb-4">What Drives Us</h2>
						<p className="text-xl text-white/80 font-light max-w-2xl mx-auto">
							Our team is united by core values that guide every interaction and decision
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-8">
						{[
							{
								title: "Compassionate Excellence",
								desc: "We believe healthcare is as much about the heart as it is about clinical skill. Every patient interaction reflects our commitment to dignity and kindness."
							},
							{
								title: "Trust & Transparency",
								desc: "We earn trust through honesty, clear communication, and genuine accountability to our patients and their families."
							},
							{
								title: "Continuous Learning",
								desc: "Healthcare evolves. Our team stays current with latest evidence and techniques to deliver cutting-edge, proven care methods."
							},
							{
								title: "Holistic Wellness",
								desc: "We care for the whole person—body, mind, and spirit. Recovery is about more than physical healing; it's about restoring hope and independence."
							}
						].map((value, idx) => (
							<div key={idx} className="group">
								<div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-0 transition-all duration-300" />
								<div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all h-full">
									<h3 className="text-2xl font-bold mb-4 text-primary">
										{value.title}
									</h3>
									<p className="text-white/80 leading-relaxed text-lg">{value.desc}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Join Our Mission Section */}
			<section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
				<div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />

				<div className="container mx-auto px-4 relative z-10">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div>
							<h2 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 mb-6 leading-tight">
								Interested in Joining Our Team?
							</h2>
							<p className="text-lg text-gray-600 mb-8 leading-relaxed">
								If you're a healthcare professional passionate about transforming out-of-hospital care in Nigeria, we'd love to hear from you. Join us in our mission to provide excellence in home healthcare.
							</p>
							<div className="space-y-4">
								{[
									"Competitive compensation & benefits",
									"Continuous professional development",
									"Supportive, collaborative team culture",
									"Opportunity to shape the future of healthcare in Nigeria"
								].map((item, idx) => (
									<div key={idx} className="flex items-center gap-3">
										<div className="w-2 h-2 bg-primary rounded-full" />
										<span className="text-gray-700">{item}</span>
									</div>
								))}
							</div>
							<div className="mt-8">
								<Link href="/contact">
									<Button size="lg" className="cursor-pointer bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/30 transition-all">
										View Career Opportunities
									</Button>
								</Link>
							</div>
						</div>

						<div className="relative group">
							<div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
							<div className="aspect-[4/3] rounded-3xl overflow-hidden border-2 border-gray-200 shadow-2xl relative bg-white">
								<img
									src="/team-collaboration.jpg"
									alt="Team collaboration at LivingRite Care"
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									 
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<CTABanner />
		</main>
	)
}
