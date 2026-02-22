"use client"

export function TransitionCare() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 text-center animate-slide-up">
            ICU to Home Transition Support
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Initial Assessment",
                description: "Thorough evaluation of patient's medical status and care needs to establish baseline.",
              },
              {
                title: "Care Plan Development",
                description: "Customized care plan coordinated with hospital and patient's medical team.",
              },
              {
                title: "Equipment & Supplies",
                description: "Provision of necessary medical equipment and supplies for home-based care.",
              },
              {
                title: "Continuous Monitoring",
                description: "Real-time vital sign tracking and health status assessment throughout recovery.",
              },
              {
                title: "Medication Management",
                description: "Expert administration and tracking of medications with adherence monitoring.",
              },
              {
                title: "Progress Tracking",
                description: "Regular reassessment and documentation of recovery milestones and improvements.",
              },
            ].map((aspect, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6 hover:border-blue-500/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <h3 className="text-lg font-semibold text-primary mb-3">{aspect.title}</h3>
                <p className="text-gray-300 leading-relaxed">{aspect.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
