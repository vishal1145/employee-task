import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

export default function Updatetask() {
  const [task, setTask] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("Pending");

  const navigate = useNavigate();
  const params = useParams();

  const getUpdate = async () => {
    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/taskautofill/${params.id}`,
      {
        method: "get",
        //   headers: {
        //     // authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        //   },
      }
    );

    result = await result.json();
    console.log(result);
    setTask(result.task);
    setTime(result.time);
    setStatus(result.status);
  };

  useEffect(() => {
    getUpdate();
  }, []);

  // const collectData = async () => {
  //   // const empid = JSON.parse(localStorage.getItem("user"))._id;
  //   // const empid=params.id;

  //   let result = await fetch(
  //     `${process.env.REACT_APP_API_KEY}/updatetask/${params.id}`,
  //     {
  //       method: "put",
  //       body: JSON.stringify({ task, time, status }),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   result = await result.json();
  //   if (result) {
  //     alert("Task updated successfully");
  //   }
  //   // history.goBack();
  //   // navigate("/alldetails/");
  //   navigate(-1);
  // };



  const collectData = async () => {
    // Check if status is selected
    if (!status || status === "Choose any one") {
      // Set status to "Pending"
      setStatus("Pending");
    }
  
    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/updatetask/${params.id}`,
      {
        method: "put",
        body: JSON.stringify({ task, time, status }),
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
      navigate(-1);
    }, 2000);
  };
  
  return (
    <>
      <div className="addform">
        <h3 className="mb-2">Update Task</h3>
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
             <option value="Pending" selected>Pending</option>
            <option value="Running">Running</option>
           
            <option value="Completed">Completed</option>
          </select>

          <button
            className="btn mt-3"
            type="button"
            onClick={collectData}
          >
            Update
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}