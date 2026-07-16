import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ShieldCheck, ArrowRight, RotateCcw } from "lucide-react";

import { verifyOTP, resendOTP } from "../services/auth";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const email = state?.email;

  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error("Please register first.");
      navigate("/register");
    }
  }, [email, navigate]);

  const submit = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error("Enter verification code");
      return;
    }

    try {
      setLoading(true);

      const data = await verifyOTP({
        email,
        otp,
      });

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      toast.success("Email verified!");

      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      setResending(true);

      await resendOTP(email);

      toast.success("OTP Sent");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-5"
      >
        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-2xl shadow-2xl">
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
              <ShieldCheck className="text-white" />
            </div>

            <h1 className="text-3xl font-bold text-white">Verify Email</h1>

            <p className="mt-3 text-slate-300">Verification code sent to</p>

            <p className="font-semibold text-blue-300">{email}</p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <input
              value={otp}
              maxLength={6}
              onChange={(e) => setOTP(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/10 py-4 text-center text-3xl tracking-[12px] text-white outline-none focus:border-blue-500"
              placeholder="000000"
            />

            <button
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
            >
              {loading ? (
                "Verifying..."
              ) : (
                <>
                  Verify
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <button
            onClick={resend}
            disabled={resending}
            className="mt-6 flex w-full items-center justify-center gap-2 text-blue-300 hover:text-white"
          >
            <RotateCcw size={16} />

            {resending ? "Sending..." : "Resend OTP"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
