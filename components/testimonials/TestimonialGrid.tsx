"use client";

import { useState, useMemo } from "react";
import { TestimonialCard } from "./TestimonialCard";
import { CaseStudyCard } from "./CaseStudyCard";
import { X } from "lucide-react";

interface Testimonial {
  id: string;
  clientName: string;
  clientTitle?: string;
  clientImage?: string;
  rating: number;
  content: string;
  videoUrl?: string;
  serviceId?: string;
  service?: { id: string; title: string };
}

interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  heroImage?: string;
  challenge: string;
  outcome: string;
  serviceId?: string;
  service?: { id: string; title: string };
  timeline?: string;
}

interface Service {
  id: string;
  title: string;
}

interface TestimonialGridProps {
  testimonials: Testimonial[];
  caseStudies: CaseStudy[];
  services: Service[];
}

export function TestimonialGrid({
  testimonials,
  caseStudies,
  services,
}: TestimonialGridProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const filteredContent = useMemo(() => {
    if (selectedServices.length === 0) {
      return { testimonials, caseStudies };
    }

    return {
      testimonials: testimonials.filter((t) =>
        t.serviceId ? selectedServices.includes(t.serviceId) : true
      ),
      caseStudies: caseStudies.filter((cs) =>
        cs.serviceId ? selectedServices.includes(cs.serviceId) : true
      ),
    };
  }, [testimonials, caseStudies, selectedServices]);

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const clearFilters = () => {
    setSelectedServices([]);
  };

  const hasContent =
    filteredContent.testimonials.length > 0 ||
    filteredContent.caseStudies.length > 0;

  return (
    <div className="space-y-8">
      {/* Filter section */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => toggleService(service.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedServices.includes(service.id)
                  ? "bg-teal-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {service.title}
            </button>
          ))}
        </div>

        {/* Clear filters button */}
        {selectedServices.length > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear filters
          </button>
        )}

        {/* Result count */}
        {selectedServices.length > 0 && (
          <p className="text-sm text-gray-600">
            Showing {filteredContent.testimonials.length + filteredContent.caseStudies.length} result
            {filteredContent.testimonials.length + filteredContent.caseStudies.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Content grid */}
      {hasContent ? (
        <div className="space-y-8">
          {/* Case Studies */}
          {filteredContent.caseStudies.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Case Studies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContent.caseStudies.map((caseStudy) => (
                  <CaseStudyCard
                    key={caseStudy.id}
                    slug={caseStudy.slug}
                    title={caseStudy.title}
                    clientName={caseStudy.clientName}
                    heroImage={caseStudy.heroImage}
                    challenge={caseStudy.challenge}
                    outcome={caseStudy.outcome}
                    serviceName={caseStudy.service?.title}
                    timeline={caseStudy.timeline}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Testimonials */}
          {filteredContent.testimonials.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Testimonials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContent.testimonials.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.id}
                    id={testimonial.id}
                    clientName={testimonial.clientName}
                    clientTitle={testimonial.clientTitle}
                    clientImage={testimonial.clientImage}
                    rating={testimonial.rating}
                    content={testimonial.content}
                    videoUrl={testimonial.videoUrl}
                    serviceName={testimonial.service?.title}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            No testimonials or case studies found for the selected filters.
          </p>
        </div>
      )}
    </div>
  );
}
