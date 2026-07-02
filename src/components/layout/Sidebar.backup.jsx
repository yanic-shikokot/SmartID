import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  QrCode,
  CreditCard,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", roles: ["admin", "registrar", "finance"] },
  { to: "/students", icon: Users, label: "Students", roles: ["admin", "registrar"] },
  { to: "/scanner", icon: QrCode, label: "QR Scanner", roles: ["admin", "registrar"] },
  { to: "/fees", icon: CreditCard, label: "Fees", roles: ["admin", "finance"] },
];

export default function Sidebar() {
  const { userProfile, role, logout } = useAuth();

  const initials = userProfile?.fullName
    ? userProfile.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "?";

  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-primary-900 text-white">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-primary-700">
        <GraduationCap className="h-8 w-8 text-primary-100" />
        <div>
          <h1 className="font-bold text-lg leading-tight">SmartID</h1>
          <p className="text-primary-300 text-xs">School Management</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {visibleItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-700 text-white"
                  : "text-primary-200 hover:bg-primary-800 hover:text-white"
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-primary-700 space-y-3">
        <div className="flex items-center gap-3 px-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary-700 text-white text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {userProfile?.fullName}
            </p>
            <p className="text-xs text-primary-300 capitalize">{role}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-primary-200 hover:text-white hover:bg-primary-800 px-3"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
