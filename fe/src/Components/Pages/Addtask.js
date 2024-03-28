import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

export default function Adddetails() {
  const [task, setTask] = useState("");
  const [time, setTime] = useState("2 hours");
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(false); // Add loading state

  const navigate = useNavigate();
  const params = useParams();

  const collectData = async () => {
    setLoading(true); // Set loading to true when data submission starts
    const empid = params.id;

    try {
      let result = await fetch(`${process.env.REACT_APP_API_KEY}/adddetails`, {
        method: "post",
        body: JSON.stringify({ task, time, status, empid }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      if (result) {
        toast.success("Task added successfully"); // Display success toast
      }

      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      toast.error("Failed to add task"); // Display error toast if submission fails
    } finally {
      setLoading(false); // Set loading to false after data submission completes
    }
  };

  return (
    <>
      <div className="addform">
        <h3 className="mb-2">Add New Task</h3>
        <form>
          <label htmlFor="addtask" className="form-label shno">
            Add Task
          </label>
          <textarea
            type="text"
            className="form-control"
            id="addtask"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add Task Here"
            required
          />

          <label htmlFor="timeduration" className="form-label">
            Time Duration
          </label>
          <select
            type="text"
            className="form-control"
            id="timeduration"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="Time Duration"
            required
          >
            <option disabled selected>Choose any one</option>  
             <option value="2 hours">2 hours</option>
            <option value="4 hours">4 hours</option>
         
            <option value="6 hours">6 hours</option>
          </select>

          <label htmlFor="status" className="form-label pt-2">
            Status
          </label>
          <select
            className="form-select"
            aria-label="Default select example"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option disabled selected>Choose any one</option>   <option value="Pending">Pending</option>
            <option value="Running">Running</option>
         
            <option value="Completed">Completed</option>
          </select>

          <button
            className="btn mt-3"
            type="button"
            onClick={collectData}
            disabled={loading} // Disable button when loading is true
          >
            {loading ? (
              <ClipLoader size={20} color={"#ffffff"} loading={loading} />
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
