import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Bell, UserCircle2 } from "lucide-react";

import { getProfile, logout } from "../services/auth";

export default function Navbar() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch {
      logout();
      navigate("/login");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-8 py-5">
        {/* Left */}

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Workflow Automation
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Build • Execute • Monitor
          </p>
        </div>

        {/* Right */}

        <div className="flex items-center gap-5">
          {/* Notification */}

          <motion.button
            whileHover={{
              scale: 1.08,
              rotate: 8,
            }}
            whileTap={{
              scale: 0.95,
            }}
            className="rounded-full bg-slate-100 p-3 transition hover:bg-blue-100"
          >
            <Bell size={20} className="text-slate-700" />
          </motion.button>

          {/* User */}

          {profile ? (
            <motion.div
              whileHover={{
                y: -2,
              }}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                <UserCircle2 size={30} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-800">
                  {profile.first_name || profile.username}
                </h3>

                <p className="text-sm text-slate-500">{profile.email}</p>

                <span className="text-xs font-medium text-blue-600">
                  {profile.role}
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="text-slate-500">Loading...</div>
          )}

          {/* Logout */}

          <motion.button
            whileHover={{
              scale: 1.04,
              y: -2,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-red-600"
          >
            <LogOut size={18} />
            Logout
          </motion.button>
        </div>
      </div>
    </header>
  );
}
