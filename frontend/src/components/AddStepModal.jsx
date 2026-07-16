import { useState } from "react";
import toast from "react-hot-toast";
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
          seconds: Number(form.seconds || 5),
        };
      }

      if (type === "HTTP_REQUEST") {
        if (!form.url.trim()) {
          toast.error("Enter URL");
          return;
        }

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <form
        onSubmit={save}
        className="bg-white rounded-xl w-[650px] p-8 space-y-4"
      >
        <h1 className="text-2xl font-bold">Add Workflow Step</h1>

        <input
          className="border p-3 rounded w-full"
          placeholder="Step Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <textarea
          className="border p-3 rounded w-full"
          placeholder="Description"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            className="border p-3 rounded"
            type="number"
            placeholder="Order"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value })}
          />

          <select
            className="border p-3 rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="EMAIL">📧 Email</option>
            <option value="WAIT">⏱ Wait</option>
            <option value="HTTP_REQUEST">🌐 HTTP Request</option>
          </select>
        </div>

        {type === "EMAIL" && (
          <>
            <input
              className="border p-3 rounded w-full"
              placeholder="Recipient Email"
              value={form.to}
              onChange={(e) => setForm({ ...form, to: e.target.value })}
            />

            <input
              className="border p-3 rounded w-full"
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />

            <textarea
              className="border p-3 rounded w-full"
              rows={5}
              placeholder="Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </>
        )}

        {type === "WAIT" && (
          <input
            className="border p-3 rounded w-full"
            type="number"
            placeholder="Seconds"
            value={form.seconds}
            onChange={(e) => setForm({ ...form, seconds: e.target.value })}
          />
        )}

        {type === "HTTP_REQUEST" && (
          <>
            <select
              className="border p-3 rounded"
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value })}
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>

            <input
              className="border p-3 rounded w-full"
              placeholder="URL"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />

            <textarea
              className="border p-3 rounded w-full"
              rows={5}
              placeholder='{"name":"Ujjal"}'
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
          </>
        )}

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="border px-5 py-2 rounded"
          >
            Cancel
          </button>

          <button className="bg-blue-600 text-white px-5 py-2 rounded">
            Save Step
          </button>
        </div>
      </form>
    </div>
  );
}
