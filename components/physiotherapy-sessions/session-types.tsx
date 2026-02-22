"use client"

export function SessionTypes() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 text-center animate-slide-up">
            Types of Physiotherapy Sessions
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Initial Assessment",
                description: "Comprehensive evaluation to understand your condition and develop a personalized treatment plan.",
              },
              {
                title: "Manual Therapy",
                description: "Hands-on techniques including massage, joint mobilization, and soft tissue therapy.",
              },
              {
                title: "Exercise Programs",
                description: "Customized strengthening and flexibility exercises performed at home with professional guidance.",
              },
              {
                title: "Mobility Training",
                description: "Therapy focused on improving movement, balance, and coordination for daily activities.",
              },
              {
                title: "Pain Management",
                description: "Techniques including heat therapy, cold therapy, and other modalities for pain relief.",
              },
              {
                title: "Progress Monitoring",
                description: "Regular reassessment sessions to track improvement and adjust treatment as needed.",
              },
            ].map((session, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm border border-green-500/20 rounded-lg p-6 hover:border-green-500/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <h3 className="text-lg font-semibold text-primary mb-3">{session.title}</h3>
                <p className="text-gray-300 leading-relaxed">{session.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
