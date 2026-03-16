import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Filter } from "lucide-react";

export const metadata: Metadata = {
  title: "Case Studies | LivingRite Care",
  description: "Explore our success stories and client case studies showcasing the impact of our healthcare services.",
};

interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  heroImage?: string | null;
  outcome: string;
  timeline?: string | null;
  rating?: number | null;
  service?: { id: string; title: string } | null;
  featured: boolean;
}

interface Service {
  id: string;
  title: string;
}

async function getCaseStudies(serviceId?: string) {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/case-studies`);
    if (serviceId) {
      url.searchParams.append("service", serviceId);
    }
    
    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) throw new Error("Failed to fetch case studies");
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return [];
  }
}

async function getServices() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/services`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch services");
    return await response.json();
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

export default async function CaseStudiesPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const params = await searchParams;
  const [caseStudies, services] = await Promise.all([
    getCaseStudies(params.service),
    getServices(),
  ]);

  const selectedService = params.service
    ? services.find((s: Service) => s.id === params.service)
    : null;

  // Sort: featured first, then by creation date
  const sortedStudies = [...caseStudies].sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Case Studies</h1>
            <p className="text-lg md:text-xl text-teal-50">
              Discover how we've transformed lives and improved outcomes for our clients through
              personalized, compassionate healthcare services.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-gray-200 bg-white py-6 sticky top-20 z-40">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <Link
              href="/case-studies"
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                !selectedService
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Services
            </Link>
            {services.map((service: Service) => (
              <Link
                key={service.id}
                href={`/case-studies?service=${service.id}`}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedService?.id === service.id
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {service.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        {sortedStudies.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              No case studies found. Please check back soon!
            </p>
          </div>
        ) : (
          <>
            {/* Featured Section */}
            {sortedStudies.some((cs) => cs.featured) && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sortedStudies
                    .filter((cs) => cs.featured)
                    .map((caseStudy) => (
                      <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} featured />
                    ))}
                </div>
              </div>
            )}

            {/* Regular Case Studies */}
            {sortedStudies.some((cs) => !cs.featured) && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  {sortedStudies.some((cs) => cs.featured) ? "More Case Studies" : "Case Studies"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sortedStudies
                    .filter((cs) => !cs.featured)
                    .map((caseStudy) => (
                      <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA Section */}
      {sortedStudies.length > 0 && (
        <section className="bg-teal-50 border-t border-gray-200 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Health?
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Our team of experienced healthcare professionals is dedicated to providing you with
              personalized care and support.
            </p>
            <Link
              href="/portal/booking"
              className="inline-block bg-teal-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-teal-700 transition-colors"
            >
              Book Consultation Today
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

function CaseStudyCard({
  caseStudy,
  featured = false,
}: {
  caseStudy: CaseStudy;
  featured?: boolean;
}) {
  return (
    <Link href={`/case-studies/${caseStudy.slug}`}>
      <div
        className={`group h-full bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
          featured ? "md:col-span-1 ring-2 ring-teal-600" : ""
        }`}
      >
        {/* Image */}
        <div className="relative h-48 md:h-56 bg-gray-200 overflow-hidden">
          {caseStudy.heroImage ? (
            <Image
              src={caseStudy.heroImage}
              alt={caseStudy.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <span className="text-white text-5xl opacity-20">+</span>
            </div>
          )}
          {featured && (
            <div className="absolute top-3 right-3 bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col h-full">
          {/* Service Badge */}
          {caseStudy.service && (
            <span className="inline-block text-xs font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-full mb-3 w-fit">
              {caseStudy.service.title}
            </span>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
            {caseStudy.title}
          </h3>

          {/* Client Name */}
          <p className="text-sm text-gray-600 mb-4">Client: {caseStudy.clientName}</p>

          {/* Outcome Preview */}
          <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">
            {caseStudy.outcome}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              {caseStudy.timeline && (
                <span className="text-xs font-medium">{caseStudy.timeline}</span>
              )}
              {caseStudy.rating && (
                <div className="flex items-center gap-1">
                  {"★".repeat(caseStudy.rating)}
                  {"☆".repeat(5 - caseStudy.rating)}
                </div>
              )}
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
