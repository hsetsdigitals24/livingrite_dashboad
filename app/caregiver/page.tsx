"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  MessageCircle,
  ArrowRight,
  Award,
  Clock,
} from "lucide-react";

interface CaregiverUser {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  role: string;
  emailVerificaion: boolean;
  createdAt: string;
  caregiverProfile: {
    id: string;
    licenseNumber: string | null;
    title: string;
    specialization: string[];
    yearsOfExperience: number | null;
    bio: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
}

interface CaregiverStats {
  patientCount: number;
  bookingCount: number;
  messageCount: number;
}

interface CaregiverData {
  user: CaregiverUser;
  stats: CaregiverStats;
}

export default function StaffDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [caregiverData, setCaregiverData] = useState<CaregiverData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const fetchCaregiverData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/caregiver/me");
      if (res.ok) {
        const data = await res.json();
        setCaregiverData(data);
        // console.log('Caregiver data:', data)
      } else {
        console.error("Failed to fetch caregiver data");
      }
    } catch (error) {
      console.error("Error fetching caregiver data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "CAREGIVER") {
      fetchCaregiverData();
    }
  }, [status, session]);

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (session?.user?.role !== "CAREGIVER" && session?.user?.role !== "ADMIN")
    ) {
      router.push("/auth/signin");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-gray-800">
      {/* Hero */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-blue-900 pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-white mb-4 animate-fade-in-up">
            Caregiver Dashboard
          </h1>
          <p
            className="text-lg md:text-xl text-slate-50 max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            Access your patients, schedule, and messages all in one place.
          </p>
        </div>
      </section>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      ) : (
        <>
          {caregiverData && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Welcome Card */}
              <div className="bg-gradient-to-r from-slate-800 to-blue-900 text-white rounded-lg shadow-lg p-8 mb-8">
                <div className="flex justify-start items-center">
                  <div className="rounded-full bg-white bg-opacity-30 ml-4 p-4 w-fit animate-fade-in-up">
                    <img
                      src={caregiverData?.user?.image || "/default-avatar.png"}
                      alt="Caregiver Avatar"
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  </div>

                  <div className="ml-4">
                    <h2 className="text-3xl font-bold mb-2">
                      Welcome, {caregiverData.user?.caregiverProfile?.title}{" "}
                      {caregiverData.user?.name || "Caregiver"}!
                    </h2>
                    <p className="text-blue-100">{caregiverData.user?.email}</p>
                    {caregiverData.user?.caregiverProfile
                      ?.yearsOfExperience && (
                      <p className="text-blue-100 mt-1">
                        <Clock className="inline mr-2 h-4 w-4" />
                        {caregiverData.user.caregiverProfile.yearsOfExperience}+
                        years of experience
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <Users className="text-blue-600 h-8 w-8 mr-4" />
                    <div>
                      <p className="text-gray-600 text-sm">Active Patients</p>
                      <p className="text-3xl font-bold">
                        {caregiverData.stats?.patientCount || 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <Calendar className="text-green-600 h-8 w-8 mr-4" />
                    <div>
                      <p className="text-gray-600 text-sm">Total Bookings</p>
                      <p className="text-3xl font-bold">
                        {caregiverData.stats?.bookingCount || 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <MessageCircle className="text-purple-600 h-8 w-8 mr-4" />
                    <div>
                      <p className="text-gray-600 text-sm">Messages Sent</p>
                      <p className="text-3xl font-bold">
                        {caregiverData.stats?.messageCount || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/caregiver"
                className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
              >
                ← Back to Dashboard
              </Link>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "My Patients",
                    desc: "View and manage your assigned patients",
                    href: "/caregiver/patients",
                    icon: Users,
                    color: "from-blue-500 to-blue-600",
                  },
                  {
                    title: "Schedule",
                    desc: "View your consultations and appointments",
                    href: "/caregiver/schedule",
                    icon: Calendar,
                    color: "from-green-500 to-green-600",
                  },
                  {
                    title: "My Messages",
                    desc: "View and manage your messages with clients",
                    href: "/caregiver/messages",
                    icon: MessageCircle,
                    color: "from-purple-500 to-purple-600",
                  },
                ].map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={idx}
                      className="group relative bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all animate-fade-in-up"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <Icon size={24} />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {card.title}
                      </h2>
                      <p className="text-gray-600 mb-4">{card.desc}</p>
                      <Link
                        href={card.href}
                        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                      >
                        {`View ${card.title.split(" ")[1]}`}{" "}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
