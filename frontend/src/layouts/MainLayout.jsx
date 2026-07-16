import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";

export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <main className="mx-auto w-full max-w-7xl flex-1 p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </div>
  );
}
