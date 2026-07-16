import api from "../api/axios";

export const getWorkflows = async () => {
  const { data } = await api.get("/workflows/");
  return data.results || data;
};

export const getWorkflow = async (id) => {
  const { data } = await api.get(`/workflows/${id}/`);
  return data;
};

export const createWorkflow = async (payload) => {
  const { data } = await api.post("/workflows/", payload);
  return data;
};

export const executeWorkflow = async (id) => {
  const { data } = await api.post(`/workflows/${id}/execute/`);
  return data;
};

export const updateWorkflow = async (id, payload) => {
  const { data } = await api.patch(`/workflows/${id}/`, payload);
  return data;
};


export const getWorkflowSteps = async (id) => {
  const { data } = await api.get(`/workflows/${id}/steps/`);

  return data.results || data;
};

export const createWorkflowStep = async (id, payload) => {
  const { data } = await api.post(`/workflows/${id}/steps/`, payload);

  return data;
};

export const updateWorkflowStep = async (workflowId, stepId, payload) => {
  const { data } = await api.patch(
    `/workflows/${workflowId}/steps/${stepId}/`,
    payload,
  );

  return data;
};

export const deleteWorkflow = async (id) => {
  return api.delete(`/workflows/${id}/`);
};

export const deleteWorkflowStep = async (workflowId, stepId) => {
  return api.delete(`/workflows/${workflowId}/steps/${stepId}/`);
};

export const getWorkflowStep = async (workflowId, stepId) => {
  const { data } = await api.get(
    `/workflows/${workflowId}/steps/${stepId}/`
  );
  return data;
};
