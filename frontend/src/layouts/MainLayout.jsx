import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f5f7fb",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />

        <div
          style={{
            padding: 30,
            maxWidth: "1200px",
            width: "100%",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          <Outlet />

          <div style={{ marginTop: "auto" }}>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
