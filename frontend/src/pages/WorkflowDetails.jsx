import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  Workflow,
  Play,
  Pencil,
  Trash2,
  Calendar,
  ListChecks,
  Activity,
} from "lucide-react";

import AddStepModal from "../components/AddStepModal";

import {
  getWorkflow,
  getWorkflowSteps,
  executeWorkflow,
  deleteWorkflow,
  deleteWorkflowStep,
} from "../services/workflow";

export default function WorkflowDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workflow, setWorkflow] = useState(null);
  const [steps, setSteps] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const workflowData = await getWorkflow(id);
    const stepsData = await getWorkflowSteps(id);

    setWorkflow(workflowData);
    setSteps(stepsData);
  };

  const handleExecute = async () => {
    await executeWorkflow(id);
    toast.success("Workflow execution started");
  };

  const removeWorkflow = async () => {
    if (!window.confirm("Delete this workflow?")) return;

    await deleteWorkflow(id);

    toast.success("Workflow deleted");

    navigate("/workflows");
  };

  const removeStep = async (stepId) => {
    if (!window.confirm("Delete this step?")) return;

    await deleteWorkflowStep(id, stepId);

    toast.success("Step deleted");

    load();
  };

  if (!workflow) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-white p-8 shadow-xl"
      >
        <div className="flex flex-col justify-between gap-6 lg:flex-row">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <div className="rounded-2xl bg-blue-100 p-4">
                <Workflow size={32} className="text-blue-600" />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  {workflow.name}
                </h1>

                <p className="mt-2 text-slate-500">
                  {workflow.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>

          <span
            className={`h-fit rounded-full px-4 py-2 text-sm font-semibold ${
              workflow.status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {workflow.status}
          </span>
        </div>

        <div className="my-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-5">
            <ListChecks className="mb-3 text-blue-600" />

            <p className="text-sm text-slate-500">Total Steps</p>

            <h2 className="mt-2 text-3xl font-bold">{steps.length}</h2>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <Activity className="mb-3 text-green-600" />

            <p className="text-sm text-slate-500">Status</p>

            <h2 className="mt-2 text-3xl font-bold">{workflow.status}</h2>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <Calendar className="mb-3 text-orange-500" />

            <p className="text-sm text-slate-500">Created</p>

            <h2 className="mt-2 text-lg font-bold">
              {workflow.created_at
                ? new Date(workflow.created_at).toLocaleDateString()
                : "-"}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleExecute}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
          >
            <Play size={18} />
            Execute
          </button>

          <Link
            to={`/workflows/${id}/edit`}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <Pencil size={18} />
            Edit
          </Link>

          <button
            onClick={removeWorkflow}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </motion.div>

      {/* Steps */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl bg-white p-8 shadow-xl"
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Workflow Steps
            </h2>

            <p className="mt-2 text-slate-500">
              Configure and manage execution steps.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            + Add Step
          </button>
        </div>

        {steps.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 p-16 text-center">
            <Workflow size={60} className="mx-auto mb-5 text-slate-400" />

            <h3 className="text-2xl font-semibold text-slate-700">
              No Steps Added
            </h3>

            <p className="mt-2 text-slate-500">Add your first workflow step.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-8 top-0 h-full w-1 rounded-full bg-slate-200" />

            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  className="relative ml-5"
                >
                  <div className="absolute -left-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-bold text-white shadow-lg">
                    {index + 1}
                  </div>

                  <div className="ml-12 rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:shadow-lg">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">
                          {step.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {step.step_type}
                        </p>
                      </div>

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        Step {index + 1}
                      </span>
                    </div>

                    <p className="leading-7 text-slate-600">
                      {step.description || "No description available."}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link to={`/workflows/${id}/steps/${step.id}/edit`}>
                        <button className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700">
                          Edit
                        </button>
                      </Link>

                      <button
                        onClick={() => removeStep(step.id)}
                        className="rounded-xl bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
      {showModal && (
        <AddStepModal
          workflowId={id}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            load();
          }}
        />
      )}
    </div>
  );
}
