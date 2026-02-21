import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock, TrendingUp } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ImageGalleryCarousel } from "@/components/testimonials/image-gallery-carousel"
import { CTABanner } from "@/components/cta-banner"

interface CaseStudyDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const caseStudies = await prisma.caseStudy.findMany({
    where: { status: "APPROVED" },
    select: { slug: true },
  })

  return caseStudies.map((cs) => ({
    slug: cs.slug,
  }))
}

export async function generateMetadata({ params }: CaseStudyDetailPageProps) {
  const { slug } = await params

  const caseStudy = await prisma.caseStudy.findUnique({
    where: { slug },
  })

  if (!caseStudy) {
    return {
      title: "Case Study Not Found",
    }
  }

  return {
    title: `${caseStudy.title} - Case Study`,
    description: caseStudy.challenge,
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.challenge,
      images: caseStudy.heroImage ? [{ url: caseStudy.heroImage }] : [],
    },
  }
}

export default async function CaseStudyDetailPage({ params }: CaseStudyDetailPageProps) {
  const { slug } = await params

  const caseStudy = await prisma.caseStudy.findUnique({
    where: { slug },
    include: { service: true },
  })

  if (!caseStudy || caseStudy.status !== "APPROVED") {
    notFound()
  }

  const keyResults = caseStudy.keyResults as Array<{ metric: string; value: string }> | null

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Back Button */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Testimonials
          </Link>
        </div>
      </div>

      {/* Hero Section with Image */}
      {caseStudy.heroImage && (
        <div className="relative w-full h-96 md:h-96 bg-gray-100">
          <Image
            src={caseStudy.heroImage}
            alt={caseStudy.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full mb-3">
              {caseStudy.service?.title || "Case Study"}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Meta */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {caseStudy.title}
              </h1>
              <p className="text-lg text-gray-600">Client: {caseStudy.clientName}</p>
            </div>

            {/* Challenge Section */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">The Challenge</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{caseStudy.challenge}</p>
            </div>

            {/* Solution Section */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Our Solution</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{caseStudy.solution}</p>
            </div>

            {/* Outcome Section */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">The Outcome</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{caseStudy.outcome}</p>
            </div>

            {/* Full Narrative */}
            <div className="space-y-3 pt-6 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Full Story</h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {caseStudy.narrative.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Gallery Section */}
            {caseStudy.images && caseStudy.images.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Photo Gallery</h2>
                <ImageGalleryCarousel images={caseStudy.images} title={caseStudy.title} />
              </div>
            )}

            {/* Before/After Images */}
            {(caseStudy.beforeImage || caseStudy.afterImage) && (
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {caseStudy.beforeImage && (
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wider">Before</p>
                      <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={caseStudy.beforeImage}
                          alt="Before"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  {caseStudy.afterImage && (
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wider">After</p>
                      <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={caseStudy.afterImage}
                          alt="After"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Video Section */}
            {caseStudy.videoUrl && (
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Video Testimonial</h2>
                <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={caseStudy.videoUrl.includes("youtu")
                      ? caseStudy.videoUrl.replace("watch?v=", "embed/")
                      : caseStudy.videoUrl}
                    title={caseStudy.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Key Metrics */}
            {keyResults && keyResults.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-32 space-y-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Key Results
                </h3>
                <div className="space-y-4">
                  {keyResults.map((result, i) => (
                    <div key={i} className="border-l-4 border-blue-500 pl-4">
                      <p className="text-sm text-gray-600 mb-1">{result.metric}</p>
                      <p className="text-2xl font-bold text-gray-900">{result.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline and Rating */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 mt-6">
              {caseStudy.timeline && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Timeline</h4>
                  <p className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Clock className="w-5 h-5 text-blue-600" />
                    {caseStudy.timeline}
                  </p>
                </div>
              )}

              {caseStudy.rating && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Rating</h4>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: caseStudy.rating }).map((_, i) => (
                      <span key={i} className="text-2xl text-amber-400">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{caseStudy.rating}/5 stars</p>
                </div>
              )}
            </div>

            {/* Service Link */}
            {caseStudy.service && (
              <Link
                href={`/services/${caseStudy.service.slug}`}
                className="block w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
              >
                Learn About {caseStudy.service.title}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <CTABanner />
    </main>
  )
}
