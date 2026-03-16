import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Award,
  Heart,
} from "lucide-react";
import { notFound } from "next/navigation";

interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  challenge: string;
  solution: string;
  outcome: string;
  narrative: string;
  heroImage?: string | null;
  beforeImage?: string | null;
  afterImage?: string | null;
  images: string[];
  videoUrl?: string | null;
  rating?: number | null;
  timeline?: string | null;
  keyResults?: any;
  service?: { id: string; title: string } | null;
  createdAt: string;
}

async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/case-studies/${slug}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) return null;
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching case study:", error);
    return null;
  }
}

async function getRelatedCaseStudies(
  currentSlug: string,
  serviceId?: string
): Promise<CaseStudy[]> {
  try {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/case-studies`
    );
    if (serviceId) {
      url.searchParams.append("service", serviceId);
    }

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];
    const data = await response.json();
    return (data.data || []).filter((cs: CaseStudy) => cs.slug !== currentSlug).slice(0, 3);
  } catch (error) {
    console.error("Error fetching related case studies:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) {
    return {
      title: "Case Study Not Found | LivingRite Care",
    };
  }

  return {
    title: `${caseStudy.title} | LivingRite Case Studies`,
    description: caseStudy.outcome,
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.outcome,
      images: caseStudy.heroImage ? [{ url: caseStudy.heroImage }] : [],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  const relatedCaseStudies = await getRelatedCaseStudies(slug, caseStudy.service?.id);

  const keyResults = Array.isArray(caseStudy.keyResults)
    ? caseStudy.keyResults
    : caseStudy.keyResults
      ? [caseStudy.keyResults]
      : [];

  return (
    <article className="min-h-screen bg-white">
      {/* Breadcrumb & Back Button */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 py-6">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Case Studies
          </Link>
          <nav className="text-sm text-gray-600">
            <span>
              <Link href="/case-studies" className="hover:text-teal-600">
                Case Studies
              </Link>
              {" / "}
              <span className="text-gray-900 font-medium">{caseStudy.title}</span>
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative">
        {caseStudy.heroImage ? (
          <div className="relative h-96 md:h-[500px] w-full bg-gray-200">
            <Image
              src={caseStudy.heroImage}
              alt={caseStudy.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        ) : (
          <div className="h-96 md:h-[500px] bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-4 opacity-20">+</div>
            </div>
          </div>
        )}

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent pt-12 pb-8">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-3xl">
              {caseStudy.service && (
                <span className="inline-block text-xs font-semibold text-teal-400 bg-teal-900/30 px-3 py-1 rounded-full mb-3">
                  {caseStudy.service.title}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {caseStudy.title}
              </h1>
              <p className="text-lg text-gray-200">Client: {caseStudy.clientName}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Key Metrics */}
            {(caseStudy.timeline || caseStudy.rating) && (
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {caseStudy.timeline && (
                  <div className="bg-teal-50 rounded-lg p-6 border border-teal-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-teal-600" />
                      <span className="text-sm font-semibold text-gray-600">Duration</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{caseStudy.timeline}</p>
                  </div>
                )}
                {caseStudy.rating && (
                  <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm font-semibold text-gray-600">Rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-gray-900">{caseStudy.rating}</p>
                      <span className="text-sm text-gray-600">/ 5 Stars</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Challenge */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Challenge</h2>
              <p className="text-lg text-gray-600 leading-relaxed">{caseStudy.challenge}</p>
            </div>

            {/* Before & After Images */}
            {(caseStudy.beforeImage || caseStudy.afterImage) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {caseStudy.beforeImage && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Before</h3>
                    <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
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
                    <h3 className="font-semibold text-gray-900 mb-3">After</h3>
                    <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
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
            )}

            {/* Solution */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Solution</h2>
              <p className="text-lg text-gray-600 leading-relaxed">{caseStudy.solution}</p>
            </div>

            {/* Outcome */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Outcome</h2>
              <p className="text-lg text-gray-600 leading-relaxed">{caseStudy.outcome}</p>
            </div>

            {/* Narrative */}
            {caseStudy.narrative && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Full Story</h2>
                <div className="prose prose-lg prose-gray max-w-none">
                  <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {caseStudy.narrative}
                  </p>
                </div>
              </div>
            )}

            {/* Gallery */}
            {caseStudy.images && caseStudy.images.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {caseStudy.images.map((image, idx) => (
                    <div
                      key={idx}
                      className="relative h-48 bg-gray-200 rounded-lg overflow-hidden group"
                    >
                      <Image
                        src={image}
                        alt={`Gallery ${idx + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Results */}
            {keyResults.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {keyResults.map((result: any, idx: number) => (
                    <div key={idx} className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-6 border border-teal-100">
                      <p className="text-sm text-gray-600 mb-2">
                        {typeof result === "object" && result.metric ? result.metric : `Result ${idx + 1}`}
                      </p>
                      <p className="text-3xl font-bold text-teal-600">
                        {typeof result === "object" && result.value ? result.value : result}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video */}
            {caseStudy.videoUrl && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Testimonial Video</h2>
                <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={caseStudy.videoUrl}
                    title="Testimonial Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Quick Info Card */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-8 border border-teal-100 sticky top-24 mb-8">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Quick Info</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Client Name</p>
                  <p className="font-semibold text-gray-900">{caseStudy.clientName}</p>
                </div>
                {caseStudy.service && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Service</p>
                    <p className="font-semibold text-gray-900">{caseStudy.service.title}</p>
                  </div>
                )}
                {caseStudy.timeline && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Duration</p>
                    <p className="font-semibold text-gray-900">{caseStudy.timeline}</p>
                  </div>
                )}
                {caseStudy.rating && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Client Rating</p>
                    <div className="text-lg font-bold text-teal-600">
                      {"★".repeat(caseStudy.rating)}
                      {"☆".repeat(5 - caseStudy.rating)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-teal-600 text-white rounded-lg p-8 text-center sticky top-96">
              <Heart className="w-8 h-8 mx-auto mb-4 opacity-80" />
              <h3 className="font-bold text-lg mb-3">Interested in Our Services?</h3>
              <p className="text-sm text-teal-50 mb-6">
                Let us help you achieve similar results.
              </p>
              <Link
                href="/portal/booking"
                className="inline-block w-full bg-white text-teal-600 font-semibold py-3 rounded-lg hover:bg-teal-50 transition-colors"
              >
                Book Consultation
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Related Case Studies */}
      {relatedCaseStudies.length > 0 && (
        <section className="border-t border-gray-200 bg-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
              Related Case Studies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedCaseStudies.map((relatedCS) => (
                <Link key={relatedCS.id} href={`/case-studies/${relatedCS.slug}`}>
                  <div className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full overflow-hidden">
                    <div className="relative h-40 bg-gray-200">
                      {relatedCS.heroImage ? (
                        <Image
                          src={relatedCS.heroImage}
                          alt={relatedCS.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-teal-400 to-cyan-500" />
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors mb-2">
                        {relatedCS.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{relatedCS.clientName}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{relatedCS.outcome}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg md:text-xl text-teal-50 mb-8 max-w-2xl mx-auto">
            Connect with our healthcare professionals today and let us help you achieve
            your wellness goals.
          </p>
          <Link
            href="/portal/booking"
            className="inline-block bg-white text-teal-600 px-8 py-4 rounded-full font-semibold hover:bg-teal-50 transition-colors"
          >
            Schedule Your Consultation
          </Link>
        </div>
      </section>
    </article>
  );
}
