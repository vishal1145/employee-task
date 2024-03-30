import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

const Adddetails = ({ fetchUpdatedEmpDetails }) => {
  const [task, setTask] = useState("");
  const [time, setTime] = useState("2 hours");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  const collectData = async () => {
    setLoading(true);

    const empid = params.id;

    try {
      let result = await fetch(`${process.env.REACT_APP_API_KEY}/adddetails`, {
        method: "post",
        body: JSON.stringify({ task, time, status, empid, date }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      if (result) {
        // toast.success("Task added successfully");
        
        // Call the fetchUpdatedEmpDetails callback function
        fetchUpdatedEmpDetails();
      }

      // setTimeout(() => {
      //   navigate("/alldetails/"+params.id);
      // }, 2000); 
    } catch (error) {
      toast.error("Failed to add task");
    } finally {
      setLoading(false);
    }
  };
  
  // const handleCancel = () => {
  //   navigate("/alldetails/" + params.id);
  // };
  
  return (
    <>
      <div className="">
        {/* <h3 className="mb-2">Add New Task</h3> */}
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

          <label htmlFor="date" className="form-label pt-2">
            Date
          </label>
          <input
            type="date"
            className="form-control"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Date"
            required
          />

          <label htmlFor="status" className="form-label pt-2">
            Status
          </label>
          <select
            className="form-select"
            aria-label="Default select example"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option disabled selected>Choose any one</option>     
            <option value="In Development">In Development</option>
            <option value="In Testing">In Testing</option>
            <option value="Ready for work">Ready for work</option>
            <option value="Canceled">Canceled</option> 
            <option value="Completed">Completed</option>
          </select>

          <div className="d-flex flex-row">
            <button
              className="btn mt-3 me-2 wid-100"
              type="button"
              onClick={collectData}
            >
              Submit
            </button>
            {/* <button
              className="btn mt-3 wid-50"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button> */}
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}

export default Adddetails;
