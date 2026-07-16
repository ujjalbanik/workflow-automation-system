import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
      toast.error("Please enter the verification code.");
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

      toast.success("🎉 Email verified successfully!");

      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setResending(true);

      await resendOTP(email);

      toast.success("Verification code sent again.");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to resend OTP."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 450,
        margin: "80px auto",
        background: "#fff",
        padding: 35,
        borderRadius: 15,
        boxShadow: "0 10px 25px rgba(0,0,0,.08)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: 10,
        }}
      >
        Verify Email
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#666",
          marginBottom: 30,
        }}
      >
        We've sent a verification code to
        <br />
        <b>{email}</b>
      </p>

      <form onSubmit={submit}>
        <input
          value={otp}
          disabled={loading || resending}
          onChange={(e) => setOTP(e.target.value)}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          style={{
            width: "100%",
            padding: 15,
            fontSize: 22,
            letterSpacing: 10,
            textAlign: "center",
            borderRadius: 8,
            border: "1px solid #ccc",
            boxSizing: "border-box",
            marginBottom: 20,
          }}
        />

        <button
          type="submit"
          disabled={loading || resending}
          style={{
            width: "100%",
            padding: 14,
            background:
              loading || resending
                ? "#94a3b8"
                : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor:
              loading || resending
                ? "not-allowed"
                : "pointer",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          {loading ? "⏳ Verifying..." : "Verify Email"}
        </button>
      </form>

      <div
        style={{
          marginTop: 25,
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#666",
            marginBottom: 10,
          }}
        >
          Didn't receive the code?
        </p>

        <button
          type="button"
          disabled={loading || resending}
          onClick={handleResendOTP}
          style={{
            background: "transparent",
            border: "none",
            color: "#2563eb",
            cursor:
              loading || resending
                ? "not-allowed"
                : "pointer",
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          {resending ? "Sending..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}