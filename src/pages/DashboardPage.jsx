import { useEffect, useState } from "react";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import { Users, QrCode, CreditCard, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    loading: true,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const studentsSnap = await getCountFromServer(
          collection(db, "students")
        );
        setStats({
          totalStudents: studentsSnap.data().count,
          loading: false,
        });
      } catch (err) {
        setStats({ totalStudents: 0, loading: false });
      }
    }
    fetchStats();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {greeting()}, {userProfile?.fullName?.split(" ")[0]} 👋
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Here's what's happening at your school today.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Students"
            value={stats.loading ? "..." : stats.totalStudents}
            subtitle="Registered in system"
            icon={Users}
            color="bg-primary-600"
          />
          <StatsCard
            title="Scans Today"
            value="0"
            subtitle="Check-ins recorded"
            icon={QrCode}
            color="bg-emerald-500"
          />
          <StatsCard
            title="Outstanding Fees"
            value="KSh 0"
            subtitle="Across all students"
            icon={CreditCard}
            color="bg-amber-500"
          />
          <StatsCard
            title="Collection Rate"
            value="0%"
            subtitle="This term"
            icon={TrendingUp}
            color="bg-purple-500"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            Getting Started
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary-500"></span>
              Add your first student under the Students section
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gray-300"></span>
              Generate QR codes and print ID cards
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gray-300"></span>
              Set up fee records and track payments
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
