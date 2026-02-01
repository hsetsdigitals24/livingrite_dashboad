import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { userProfile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch user profile
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: user.id },
    });

    // Fetch medical appointments (last 5)
    const medicalAppointments = await prisma.medicalAppointment.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 5,
    });

    // Fetch lab results (last 3)
    const labResults = await prisma.labResults.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 3,
    });

    // Fetch today's daily log with all relations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayLog = await prisma.dailyLog.findFirst({
      where: {
        userId: user.id,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        morningVitals: true,
        eveningVitals: true,
        sleepData: true,
        physicalActivity: {
          include: {
            workouts: true,
          },
        },
        nutritionData: true,
        mentalHealthData: true,
        womenHealth: true,
        glucoseMonitoring: true,
      },
    });

    // Fetch last 30 days of daily logs for chart data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const logs = await prisma.dailyLog.findMany({
      where: {
        userId: user.id,
        date: {
          gte: thirtyDaysAgo,
        },
      },
      include: {
        morningVitals: true,
        eveningVitals: true,
        sleepData: true,
        physicalActivity: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    // Format chart data from 30-day logs
    const chartData = logs.map((log) => {
      const morning = log.morningVitals;
      const evening = log.eveningVitals;
      const vitals = morning || evening;

      return {
        date: log.date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        temperature: vitals?.temperatureCelsius || null,
        systolic: vitals?.systolic || null,
        diastolic: vitals?.diastolic || null,
        heartRate: vitals?.pulse || null,
        steps: log.physicalActivity?.steps || 0,
        activeMinutes: log.physicalActivity?.activeMinutes || 0,
        sleepMinutes: log.sleepData?.totalSleepMinutes || 0,
        sleepScore: log.sleepData?.sleepScore || null,
      };
    });

    // Get latest vitals for stat cards
    const latestVital = todayLog?.morningVitals || todayLog?.eveningVitals;
    
    const latestVitals = {
      temperature: latestVital?.temperatureCelsius || 98.6,
      bloodPressure: latestVital
        ? `${latestVital.systolic}/${latestVital.diastolic}`
        : "121/79",
      heartRate: latestVital?.pulse || 73,
      steps: todayLog?.physicalActivity?.steps || 0,
      activeMinutes: todayLog?.physicalActivity?.activeMinutes || 0,
      sleepHours: todayLog?.sleepData
        ? Math.round((todayLog.sleepData.totalSleepMinutes / 60) * 10) / 10
        : 0,
    };

    // Get weekly summary
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weekLogs = await prisma.dailyLog.findMany({
      where: {
        userId: user.id,
        date: {
          gte: sevenDaysAgo,
        },
      },
      include: {
        morningVitals: true,
        eveningVitals: true,
        sleepData: true,
        physicalActivity: true,
        nutritionData: true,
      },
    });

    const weekSummary = {
      avgSteps:
        weekLogs.reduce((sum, log) => sum + (log.physicalActivity?.steps || 0), 0) /
        weekLogs.length,
      avgSleepHours:
        weekLogs.reduce(
          (sum, log) => sum + (log.sleepData?.totalSleepMinutes || 0),
          0
        ) /
        weekLogs.length /
        60,
      avgCalories:
        weekLogs.reduce(
          (sum, log) => sum + (log.nutritionData?.totalCalories || 0),
          0
        ) / weekLogs.length,
      workoutsCompleted: weekLogs.filter((log) =>
        log.physicalActivity?.workouts?.length
      ).length,
    };

    return NextResponse.json({
      vitalsData: chartData,
      latestVitals,
      weekSummary,
      todayLog,
      userProfile,
      medicalAppointments,
      labResults,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching vitals:", error);
    return NextResponse.json(
      { error: "Failed to fetch vitals" },
      { status: 500 }
    );
  }
}