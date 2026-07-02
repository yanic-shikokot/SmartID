import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  QrCode,
  CreditCard,
  LogOut,
  GraduationCap,
  X,
  IdCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", roles: ["admin", "registrar", "finance"] },
  { to: "/students", icon: Users, label: "Students", roles: ["admin", "registrar"] },
  { to: "/id-cards", icon: IdCard, label: "ID Cards", roles: ["admin", "registrar"] },
  { to: "/scanner", icon: QrCode, label: "QR Scanner", roles: ["admin", "registrar"] },
  { to: "/fees", icon: CreditCard, label: "Fees", roles: ["admin", "finance"] },
];

export default function Sidebar({ isOpen, onClose }) {
  const { userProfile, role, logout } = useAuth();

  const initials = userProfile?.fullName
    ? userProfile.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "?";

  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-30 flex flex-col w-64 min-h-screen bg-primary-900 text-white transition-transform duration-300 lg:static lg:translate-x-0 lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-primary-700">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-primary-100" />
          <div>
            <h1 className="font-bold text-lg leading-tight">SmartID</h1>
            <p className="text-primary-300 text-xs">School Management</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-primary-800"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {visibleItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={onClose}
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
