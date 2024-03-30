import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function Updatetask(props) {
  const { taskId, paramsId } = props;
  const [task, setTask] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("pending");
  const [date, setDate] = useState("");

  const navigate = useNavigate();
  console.log("dbchdhc", taskId);

  const getUpdate = async () => {
    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/taskautofill/${taskId}`,
      {
        method: "get",
      }
    );

    result = await result.json();
    console.log(result);
    setTask(result.task);
    setTime(result.time);
    setStatus(result.status || "pending");
    setDate(result.date || ""); // If date is not present, set it to an empty string
  };

  useEffect(() => {
    getUpdate();
  },[]);

  const collectData = async () => {
    if (!status || status === "Choose any one") {
      setStatus("Pending");
    }

    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/updatetask/${taskId}`,
      {
        method: "put",
        body: JSON.stringify({ task, time, status, date }), // Include date in the request body
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    result = await result.json();
    if (result) {
      toast("Task updated successfully");
    }
    setTimeout(() => {
      navigate("/alldetails/" + paramsId); // Navigating to the same page with paramsId
    }, 1000);
  };
  // const handleCancel = () => {
  //   navigate("/alldetails/" + paramsId);
  // };
  return (
    <>
      <div className="">
        {/* <h3 className="mb-2">Update Task</h3> */}
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
            <option disabled selected>
              Choose any one
            </option>
            <option value="2 hours">2 hours</option>
            <option value="4 hours">4 hours</option>
            <option value="6 hours">6 hours</option>
          </select>

          <label htmlFor="status" className="form-label">
            Status
          </label>
          <select
            className="form-select"
            aria-label="Default select example"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option disabled>Choose any one</option>
            {/* <option value="In Development">In Development</option> */}
            {/* <option value="In Testing">In Testing</option> */}
            <option value="pending">Pending</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
          </select>

          <label htmlFor="date" className="form-label">
            Date
          </label>
          <input
            type="date"
            className="form-control"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <div className="d-flex flex-row">
            <button
              className="btn mt-3 me-2 wid-100"
              type="button"
              onClick={collectData}
            >
              Update
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
