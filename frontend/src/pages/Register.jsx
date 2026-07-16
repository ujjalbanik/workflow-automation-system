import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { register } from "../services/auth";

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await register(form);

      toast.success("Verification code sent to your email.");

      navigate("/verify-otp", {
        state: {
          email: form.email,
        },
      });
    } catch (err) {
      const errors = err.response?.data?.errors;

      if (errors) {
        const firstField = Object.keys(errors)[0];
        toast.error(errors[firstField][0]);
      } else {
        toast.error(err.response?.data?.message || "Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "60px auto",
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
        Create Account
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#666",
          marginBottom: 30,
        }}
      >
        Register to start building workflow automations.
      </p>

      <form onSubmit={submit}>
        <input
          placeholder="Username"
          disabled={loading}
          value={form.username}
          onChange={(e) =>
            setForm({
              ...form,
              username: e.target.value,
            })
          }
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
            marginBottom: 15,
            boxSizing: "border-box",
          }}
        />

        <input
          placeholder="First Name"
          disabled={loading}
          value={form.first_name}
          onChange={(e) =>
            setForm({
              ...form,
              first_name: e.target.value,
            })
          }
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
            marginBottom: 15,
            boxSizing: "border-box",
          }}
        />

        <input
          placeholder="Last Name"
          disabled={loading}
          value={form.last_name}
          onChange={(e) =>
            setForm({
              ...form,
              last_name: e.target.value,
            })
          }
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
            marginBottom: 15,
            boxSizing: "border-box",
          }}
        />

        <input
          type="email"
          placeholder="Email"
          disabled={loading}
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
            marginBottom: 15,
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          disabled={loading}
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
            marginBottom: 20,
            boxSizing: "border-box",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 14,
            background: loading ? "#94a3b8" : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "0.2s",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          {loading ? "⏳ Creating Account..." : "Create Account"}
        </button>
      </form>

      <p
        style={{
          marginTop: 25,
          textAlign: "center",
          color: "#666",
        }}
      >
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
