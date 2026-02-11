import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch total counts
    const [totalClients, totalPatients, totalBookings, payments] = await Promise.all([
      prisma.user.count({ where: { role: "CLIENT" } }),
      prisma.patient.count(),
      prisma.booking.count(),
      prisma.payment.findMany({
        where: { status: "PAID" },
        select: { amount: true },
      }),
    ]);

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    // Bookings by status
    const bookingsByStatusRaw = await prisma.booking.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    const bookingsByStatus = bookingsByStatusRaw.map((item) => ({
      status: item.status,
      count: item._count.id,
    }));

    // Patients by gender
    const patientsByGenderRaw = await prisma.patient.groupBy({
      by: ["biologicalGender"],
      _count: { id: true },
    });

    const patientsByGender = patientsByGenderRaw
      .filter((item) => item.biologicalGender)
      .map((item) => ({
        gender: item.biologicalGender || "Not Specified",
        count: item._count.id,
      }));

    // Bookings trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const bookingsTrendRaw = await prisma.booking.findMany({
      where: {
        scheduledAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        scheduledAt: true,
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });

    // Group bookings by date
    const bookingsByDate: { [key: string]: number } = {};
    bookingsTrendRaw.forEach((booking) => {
      const date = new Date(booking.scheduledAt).toLocaleDateString();
      bookingsByDate[date] = (bookingsByDate[date] || 0) + 1;
    });

    const bookingsTrend = Object.entries(bookingsByDate).map(([date, count]) => ({
      date,
      count,
    }));

    // Top services
    const topServicesRaw = await prisma.booking.groupBy({
      by: ["serviceId"],
      _count: { id: true },
      where: {
        serviceId: { not: null },
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 5,
    });

    const topServices = await Promise.all(
      topServicesRaw.map(async (item) => {
        const service = await prisma.service.findUnique({
          where: { id: item.serviceId! },
          select: { title: true },
        });
        return {
          service: service?.title || "Unknown Service",
          bookings: item._count.id,
        };
      })
    );

    // Recent bookings
    const recentBookings = await prisma.booking.findMany({
      take: 10,
      orderBy: { scheduledAt: "desc" },
      select: {
        id: true,
        eventTitle: true,
        status: true,
        scheduledAt: true,
        payment: {
          select: { amount: true },
        },
      },
    });

    const formattedRecentBookings = recentBookings.map((booking) => ({
      id: booking.id,
      eventTitle: booking.eventTitle,
      status: booking.status,
      scheduledAt: booking.scheduledAt,
      amount: booking.payment?.amount,
    }));

    return NextResponse.json({
      totalClients,
      totalPatients,
      totalBookings,
      totalRevenue,
      bookingsByStatus,
      patientsByGender,
      bookingsTrend,
      topServices,
      recentBookings: formattedRecentBookings,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
