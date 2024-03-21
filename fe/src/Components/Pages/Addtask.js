import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Adddetails() {
  const [task, setTask] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();
  const params = useParams();

  const collectData = async () => {
    // const empid = JSON.parse(localStorage.getItem('user'))._id;
    // const name = JSON.parse(localStorage.getItem('user')).name;
    const empid = params.id;

    let result = await fetch(`${process.env.REACT_APP_API_KEY}/adddetails`, {
      method: "post",
      body: JSON.stringify({ task, time, status, empid }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
    if (result) {
      alert("Task added successfully");
    }

    // navigate('/alldetails/' + empid);
    navigate(-1);
    // console.log(result);
  };

  return (
    <>
      <div className="addform">
        <h3 className="mb-2">Add New Task</h3>
        <form>
          <label for="addtask" className="form-label shno">
            Add Task
          </label>
          <textarea
            type="text"
            class="form-control"
            id="addtask"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add Task Here"
            required
          />

          <label for="timeduration" class="form-label">
            Time Duration
          </label>
          <input
            type="text"
            class="form-control"
            id="timeduration"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="Time Duration"
            required
          />

          <label for="status" class="form-label">
            Status
          </label>
          <select
            class="form-select"
            aria-label="Default select example"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option selected>Choose any one</option>
            <option value="Running">Running</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          <button
            className="btn mt-3"
            type="button"
            onClick={collectData}
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
