import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getWorkflow,
  updateWorkflow,
} from "../services/workflow";

export default function EditWorkflow() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name:"",
    description:"",
    status:"DRAFT",
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const wf = await getWorkflow(id);

    setForm({
      name:wf.name,
      description:wf.description || "",
      status:wf.status,
    });
  };

  const save = async(e)=>{
    e.preventDefault();

    await updateWorkflow(id,form);

    toast.success("Workflow Updated");

    navigate(`/workflows/${id}`);
  };

  return(

<div className="max-w-2xl">

<h1 className="text-3xl font-bold mb-6">
Edit Workflow
</h1>

<form
onSubmit={save}
className="space-y-5 bg-white p-8 rounded-xl shadow"
>

<input
className="border p-3 rounded w-full"
value={form.name}
placeholder="Name"
onChange={(e)=>
setForm({...form,name:e.target.value})
}
/>

<textarea
rows={5}
className="border p-3 rounded w-full"
value={form.description}
placeholder="Description"
onChange={(e)=>
setForm({...form,description:e.target.value})
}
/>

<select
className="border p-3 rounded w-full"
value={form.status}
onChange={(e)=>
setForm({...form,status:e.target.value})
}
>

<option>DRAFT</option>

<option>ACTIVE</option>

<option>PAUSED</option>

</select>

<button
className="bg-blue-600 text-white px-5 py-3 rounded"
>

Save Changes

</button>

</form>

</div>

);

}