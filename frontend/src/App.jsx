import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Workflows from "./pages/Workflows";
import WorkflowDetails from "./pages/WorkflowDetails";
import Executions from "./pages/Executions";
import NotFound from "./pages/NotFound";
import CreateWorkflow from "./pages/CreateWorkflow";
import EditWorkflow from "./pages/EditWorkflow";
import MainLayout from "./layouts/MainLayout";
import EditStep from "./pages/EditStep";
import ExecutionDetails from "./pages/ExecutionDetails";
import VerifyOTP from "./pages/VerifyOTP";
import Register from "./pages/Register";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/verify-otp" element={<VerifyOTP />} />


        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/workflows/:id" element={<WorkflowDetails />} />
          <Route path="/executions" element={<Executions />} />
          <Route path="/workflows/create" element={<CreateWorkflow />} />
          <Route path="/workflows/:id/edit" element={<EditWorkflow />} />
          <Route path="/workflows/:id/steps/:stepId/edit" element={<EditStep/>} />
          <Route path="/executions/:id" element={<ExecutionDetails />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
