import { Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function TopBar({ onMenuClick }) {
  const { userProfile } = useAuth();

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4 sticky top-0 z-10">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex-1" />
      <span className="text-sm text-gray-600 font-medium">
        {userProfile?.fullName}
      </span>
    </header>
  );
}
