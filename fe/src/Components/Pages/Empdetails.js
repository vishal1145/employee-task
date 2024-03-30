import React, { useState, useEffect } from "react";
import { NavLink, Link, useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Adddetails from "./Addtask";
import Updatetask from "./Updatetask";

export default function Empdetails() {
  var authData = localStorage.getItem("user");

  const [empdeatils, setEmpdetails] = useState("");
  const [status, setStatus] = useState("");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showUpdateTaskModal, setShowUpdateTaskModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [dataUploaded, setDataUploaded] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  const getEmpdetails = async () => {
    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/empdetails/${params.id}`,
      {
        method: "get",
      }
    );

    result = await result.json();
    setEmpdetails(result);
  };

  useEffect(() => {
    getEmpdetails();
  }, [params.id, dataUploaded]); // Adding params.id to the dependency array

  // const searchuser = async (event) => {
  //   let key = event.target.value;
  //   if (key) {
  //     let result = await fetch(
  //       `http://localhost:5000/empdetailssearch/${key}`,
  //       {
  //         headers: {
  //           // authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
  //         },
  //       }
  //     );
  //     result = await result.json();
  //     if (result) {
  //       setEmpdetails(result);
  //     }
  //   } else {
  //     getEmpdetails();
  //   }
  // };

  const deletetask = async (id) => {
    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/deletetask/${id}`,
      {
        method: "Delete",
        headers: {
          // authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        },
      }
    );
    result = await result.json();
    if (result) {
      toast("Task deleted Successfully");
      getEmpdetails();
    }
  };

  const addstatus = async (id) => {
    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/addstatus/${id}`,
      {
        method: "put",
        body: JSON.stringify({ status }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    result = await result.json();
    if (result) {
      getEmpdetails();
    }
  };

  // const getUpdate = async () => {
  //   let result = await fetch(
  //     `http://localhost:5000/taskautofill/${params.id}`,
  //     {
  //       method: "get",
  //       //   headers: {
  //       //     // authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
  //       //   },
  //     }
  //   );

  //   result = await result.json();
  //   setStatus(result.status);
  // };

  const getStatusColorClass = (status) => {
    switch (status) {
      // case "In Development":
      // case "In Testing":
      //   return "textBlue";
      case "running":
        return "textYellow";
      case "pending":
        return "textRed";
      case "completed":
        return "textGreen";
      default:
        return "textRed";
    }
  };


  const fetchUpdatedEmpDetails = async () => {
    // Fetch the updated employee details
    await getEmpdetails();
  };

  const handleUpdateTaskClick = (taskId) => {
    setSelectedTaskId(taskId);
    setShowUpdateTaskModal(true);
  };

  return (
    <>
      <div className="empdeatils wid-80">
        <div className="headsec">
          <h5 className="">Task</h5>
          {JSON.parse(authData).role === "admin" ? (
            <div
              className="addtaskbtn"
              // style={{ position: "fixed", top: "10%", right: "1.5%" }}
            >
              <button
                // to={"/alldetails/" + params.id}
                className="btn"
                type="button"
                onClick={() => setShowAddTaskModal(true)}
                // data-bs-toggle="modal"
                // data-bs-target="#exampleModal"
              >
                Add Task
              </button>
            </div>
          ) : null}
        </div>
        <table className="wid-100">
          <thead>
            <tr>
              <th className="wid-20 text-start">Task</th>
              <th className="wid-10 text-center">Date</th>
              <th className="wid-10 text-center">Estimate</th>
              <th className="wid-10 text-center">
                Status
              </th>

              {JSON.parse(authData).role === "admin" ? (
                <th className="wid-5 text-center">Modify</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {empdeatils.length > 0
              ? empdeatils.map((item, index) => (
                  <tr
                    style={{
                      backgroundColor:
                        item.status === "pending"
                          ? "rgba(239, 154, 154, 0.7)"
                          : item.status === "running"
                          ? "rgba(255, 235, 59, 0.6)"
                          : item.status === "completed"
                          ? "rgba(0, 137, 123, 0.8)"
                          : "rgba(239, 154, 154, 0.7)",
                    }}
                  >
                    <td className="text-start">{item.task}</td>
                    <td className="text-center">{item.date}</td>
                    <td className="text-center">{item.time}</td>
                    <td className="text-center">
                      <NavLink
                        className="text-decoration-none"
                        onClick={() => addstatus(item._id)}
                      >
                        <select
                          className={`form-select choosestatus ${getStatusColorClass(
                            item.status || status
                          )}`}
                          value={item.status || status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="pending" className="textRed">
                            Pending
                          </option>
                          <option value="running" className="textYellow">
                            Running
                          </option>
                          <option value="completed" className="textGreen">
                            Completed
                          </option>
                          {/* <option value="Ready for work" className="textGray">
                            Ready for work
                          </option>
                          <option value="Canceled" className="textRed">
                            Canceled
                          </option> */}
                        </select>{" "}
                      </NavLink>
                    </td>
                    {JSON.parse(authData).role === "admin" ? (
                      <td className="modifysec text-center">
                        <i
                          className="bi bi-pencil-square"
                          onClick={() => handleUpdateTaskClick(item._id)}
                        ></i>

                        <Link onClick={() => deletetask(item._id)}>
                          <i className="bi bi-trash3-fill"></i>
                        </Link>
                      </td>
                    ) : null}
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
      {showAddTaskModal && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Task</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddTaskModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <Adddetails fetchUpdatedEmpDetails={fetchUpdatedEmpDetails} />
                {/* Render AddDetails component within the modal */}
              </div>
            </div>
          </div>
        </div>
      )}

      {showUpdateTaskModal && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Task</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowUpdateTaskModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <Updatetask taskId={selectedTaskId} paramsId={params.id} />
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
}
