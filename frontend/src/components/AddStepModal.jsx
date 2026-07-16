import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, Clock3, Globe, FileText, Hash, Save, X } from "lucide-react";

import { createWorkflowStep } from "../services/workflow";

export default function AddStepModal({ workflowId, onClose, onSuccess }) {
  const [type, setType] = useState("EMAIL");

  const [form, setForm] = useState({
    order: 1,
    name: "",
    description: "",
    to: "",
    subject: "",
    message: "",
    seconds: 5,
    method: "GET",
    url: "",
    body: "",
  });

  const save = async (e) => {
    e.preventDefault();

    try {
      let configuration = {};

      if (!form.name.trim()) {
        toast.error("Enter step name");
        return;
      }

      if (type === "EMAIL") {
        if (!form.to || !form.subject || !form.message) {
          toast.error("Fill all email fields");
          return;
        }

        configuration = {
          to: form.to,
          subject: form.subject,
          message: form.message,
        };
      }

      if (type === "WAIT") {
        configuration = {
          seconds: Number(form.seconds),
        };
      }

      if (type === "HTTP_REQUEST") {
        configuration = {
          method: form.method,
          url: form.url,
          body: form.body.trim() ? JSON.parse(form.body) : {},
        };
      }

      await createWorkflowStep(workflowId, {
        order: Number(form.order),
        name: form.name,
        description: form.description,
        step_type: type,
        configuration,
      });

      toast.success("Step added successfully");

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save step.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.form
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={save}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl"
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Add Workflow Step</h1>

            <p className="mt-2 text-slate-500">
              Configure the next automation step.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <X />
          </button>
        </div>

        <div className="space-y-5">
          <input
            placeholder="Step Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-slate-200 p-3"
          />

          <textarea
            rows={3}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-xl border border-slate-200 p-3"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold">
                <Hash className="mr-2 inline" size={16} />
                Order
              </label>

              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">Step Type</label>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3"
              >
                <option value="EMAIL">Email</option>
                <option value="WAIT">Wait</option>
                <option value="HTTP_REQUEST">HTTP Request</option>
              </select>
            </div>
          </div>

          {type === "EMAIL" && (
            <div className="space-y-4">
              <input
                placeholder="Recipient Email"
                value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-3"
              />

              <input
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-3"
              />

              <textarea
                rows={5}
                placeholder="Email Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-3"
              />
            </div>
          )}

          {type === "WAIT" && (
            <input
              type="number"
              placeholder="Seconds"
              value={form.seconds}
              onChange={(e) => setForm({ ...form, seconds: e.target.value })}
              className="w-full rounded-xl border border-slate-200 p-3"
            />
          )}

          {type === "HTTP_REQUEST" && (
            <div className="space-y-4">
              <select
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-3"
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>

              <input
                placeholder="API URL"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-3"
              />

              <textarea
                rows={6}
                placeholder='{"name":"John"}'
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-3 font-mono"
              />
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold"
          >
            Cancel
          </button>

          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
            <Save size={18} />
            Save Step
          </button>
        </div>
      </motion.form>
    </div>
  );
}
