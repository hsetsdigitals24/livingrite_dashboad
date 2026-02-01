"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Thermometer,
  Heart,
  Zap,
  Activity,
  Moon,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

// Mock vitals data (fallback)
const mockVitalsData = [
  {
    date: "Jan 1",
    temperature: 98.6,
    systolic: 120,
    diastolic: 76,
    heartRate: 72,
    steps: 8234,
    activeMinutes: 45,
    sleepMinutes: 450,
  },
  {
    date: "Jan 8",
    temperature: 98.4,
    systolic: 118,
    diastolic: 74,
    heartRate: 70,
    steps: 9234,
    activeMinutes: 52,
    sleepMinutes: 480,
  },
  {
    date: "Jan 15",
    temperature: 98.7,
    systolic: 122,
    diastolic: 78,
    heartRate: 75,
    steps: 10234,
    activeMinutes: 60,
    sleepMinutes: 510,
  },
  {
    date: "Jan 22",
    temperature: 98.5,
    systolic: 119,
    diastolic: 76,
    heartRate: 71,
    steps: 11234,
    activeMinutes: 58,
    sleepMinutes: 495,
  },
  {
    date: "Jan 29",
    temperature: 98.6,
    systolic: 121,
    diastolic: 77,
    heartRate: 73,
    steps: 12847,
    activeMinutes: 78,
    sleepMinutes: 441,
  },
];

interface LatestVitals {
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  steps: number;
  activeMinutes: number;
  sleepHours: number;
}

interface WeekSummary {
  avgSteps: number;
  avgSleepHours: number;
  avgCalories: number;
  workoutsCompleted: number;
}

const Overview = ({ user }: any) => {
  const [vitalsData, setVitalsData] = useState(mockVitalsData);
  const [latestVitals, setLatestVitals] = useState<LatestVitals>({
    temperature: 98.6,
    bloodPressure: "121/79",
    heartRate: 73,
    steps: 12847,
    activeMinutes: 78,
    sleepHours: 7.4,
  });
  const [weekSummary, setWeekSummary] = useState<WeekSummary>({
    avgSteps: 10234,
    avgSleepHours: 7.4,
    avgCalories: 1875,
    workoutsCompleted: 5,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomerVitals();
  }, []);

  const fetchCustomerVitals = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/dashboard/vitals");

      if (!response.ok) {
        throw new Error("Failed to fetch vitals");
      }

      const data = await response.json();

      if (data.vitalsData && data.vitalsData.length > 0) {
        setVitalsData(data.vitalsData);
      }

      if (data.latestVitals) {
        setLatestVitals(data.latestVitals);
      }

      if (data.weekSummary) {
        setWeekSummary(data.weekSummary);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching vitals:", err);
      setError("Unable to load vitals. Displaying sample data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">
        Welcome, {user.toUpperCase?.() || user}!
      </h2>
      <p className="text-gray-700 mb-6">
        Here you can manage your consultations, view your health logs, and
        stay updated with your care plans.
      </p>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Quick Stats - Row 1: Vital Signs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-accent">Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestVitals.temperature}°F
            </div>
            <p className="text-xs text-gray-500">Normal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-accent">Blood Pressure</CardTitle>
            <Zap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestVitals.bloodPressure}
            </div>
            <p className="text-xs text-gray-500">mmHg</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-accent">Heart Rate</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestVitals.heartRate}</div>
            <p className="text-xs text-gray-500">bpm</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats - Row 2: Activity & Sleep */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold text-accent">Steps Today</CardTitle>
                <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                {latestVitals.steps.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500">Goal: 10,000</p>
            </CardContent>
            </Card> */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-accent">Active Minutes</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestVitals.activeMinutes}</div>
            <p className="text-xs text-gray-500">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-accent">Sleep</CardTitle>
            <Moon className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestVitals.sleepHours}h</div>
            <p className="text-xs text-gray-500">Last night</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Temperature Trend</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={vitalsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[97, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ff7300"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Heart Rate Trend</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={vitalsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[60, 85]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="heartRate"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blood Pressure Trend</CardTitle>
            <CardDescription>Systolic / Diastolic</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={vitalsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[70, 130]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="systolic"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  stroke="#60a5fa"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Steps & Active Minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={vitalsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="steps" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="activeMinutes" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(weekSummary.avgSteps).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Sleep</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(weekSummary.avgSleepHours * 10) / 10}h
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(weekSummary.avgCalories).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weekSummary.workoutsCompleted}</div>
            <p className="text-xs text-gray-500">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Consultations</CardTitle>
            <CardDescription>
              View and manage your upcoming appointments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">View Appointments</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Logs</CardTitle>
            <CardDescription>
              Track your vitals and mood over time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">View Health Logs</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Care Plans</CardTitle>
            <CardDescription>
              Review your personalized care plans.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">View Care Plans</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;