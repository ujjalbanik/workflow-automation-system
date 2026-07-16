import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div
      style={{
        background: "#fff",
        padding: "18px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #ddd",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
          }}
        >
          Workflow Automation System
        </h2>

        <small
          style={{
            color: "#777",
          }}
        >
          Build • Execute • Monitor
        </small>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        {profile ? (
          <div
            style={{
              textAlign: "right",
            }}
          >
            <div
              style={{
                fontWeight: 600,
              }}
            >
              👤 {profile.first_name || profile.username}
            </div>

            <div
              style={{
                fontSize: 13,
                color: "#666",
              }}
            >
              {profile.email}
            </div>

            <div
              style={{
                fontSize: 12,
                color: "#2563eb",
              }}
            >
              {profile.role}
            </div>
          </div>
        ) : (
          <div
            style={{
              color: "#888",
            }}
          >
            Loading...
          </div>
        )}

        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: 25,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}