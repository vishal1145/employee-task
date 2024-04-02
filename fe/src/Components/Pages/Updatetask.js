import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import JoditEditor from "jodit-react";
// import DOMPurify from "dompurify";

// import CKEditor from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function Updatetask(props) {
  const [empdeatils, setEmpdetails] = useState("");
  const { taskId, paramsId } = props;
  const [task, setTask] = useState("");
  const [time, setTime] = useState("");
  // const [status, setStatus] = useState("Pending");
  // const [date, setDate] = useState("");

  const navigate = useNavigate();
  const params = useParams();
  console.log("dbchdhc", taskId);

  // const config = useMemo(
    
  //   {
  //     readonly: false, // all options from https://xdsoft.net/jodit/docs/,
  //     placeholder: "Start typings...",
  //   },
  //   []
  // );


  useEffect(() => {
    getUpdate();
  },[]);
  
  const getUpdate = async () => {
    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/taskautofill/${taskId}`,
      {
        method: "get",
      }
    );

    result = await result.json();
    // console.log(result);
    setTask(result.task);
    setTime(result.time);
    // setStatus(result.status || "Pending");
    // setDate(result.date || ""); // If date is not present, set it to an empty string
  };

  const collectData = async () => {
    // if (!status || status === "Choose any one") {
    //   setStatus("Pending");
    // }
    // const sanitizedContent = DOMPurify.sanitize(editor.current.value);

    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/updatetask/${taskId}`,
      {
        method: "put",
        body: JSON.stringify({ task, time }), // Include date in the request body
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    result = await result.json();
    if (result) {
      toast("Task updated successfully");
      // navigate("/alldetails/" + paramsId);
      window.location.reload();
    }
    // setTimeout(() => {
    //   navigate("/alldetails/" + paramsId); // Navigating to the same page with paramsId
    // }, 1000);
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

          <JoditEditor
            //ref={editor}
            value={task}
            // config={config}
            // tabIndex={1} // tabIndex of textarea
            // onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
            onChange={(newTask) => {
              setTask(newTask);
            }}
          />
          {/* <textarea
            type="text"
            className="form-control"
            id="addtask"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add Task Here"
          /> */}
          <div className="d-flex justify-content-between pt-2">
            <div className="wid-100">
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
                <option value="1 hours">1 hours</option>
                <option value="2 hours">2 hours</option>
                <option value="3 hours">3 hours</option>
                <option value="4 hours">4 hours</option>
                <option value="5 hours">5 hours</option>
                <option value="6 hours">6 hours</option>
                <option value="7 hours">7 hours</option>
                <option value="8 hours">8 hours</option>
              </select>
            </div>

            {/* <div className="wid-50 p-1">
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
            </div> */}
          </div>
          {/* <div>
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
            <option value="Pending">Pending</option>
            <option value="Running">Running</option>
            <option value="Completed">Completed</option>
          </select>
          </div> */}

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
      {/* <ToastContainer /> */}
    </>
  );
}
