"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, User, ArrowRight } from "lucide-react";

interface Training {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  instructor?: string;
  duration?: number;
  createdAt: string;
}

export function TrainingSection() {
  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestTraining = async () => {
      try {
        const response = await fetch("/api/trainings/latest");
        if (response.ok) {
          const data = await response.json();
          setTraining(data);
        }
      } catch (error) {
        console.error("Failed to fetch training:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestTraining();
  }, []);

  if (loading || !training) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Image */}
          {training.imageUrl && (
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={training.imageUrl}
                alt={training.title}
                fill
                className="object-contain"
              />
            </div>
          )}

          {/* Content */}
          <div className="space-y-6">
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
                Latest Training
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                {training.title}
              </h2>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">
              {training.description}
            </p>

            {/* Meta Info */}
            <div className="flex gap-6 text-sm text-gray-600">
              {training.instructor && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{training.instructor}</span>
                </div>
              )}
              {training.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{training.duration} mins</span>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Link
              href="/training"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Trainings
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
