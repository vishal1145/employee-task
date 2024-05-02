import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import JoditEditor from "jodit-react";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
// import moment from "moment";
import parse from "html-react-parser";
import Swal from "sweetalert2";
import PageNotFound from "./PageNotFound";

export default function Algofolkshome() {

  var authData = JSON.parse(localStorage.getItem("user"));

  const [task, setTask] = useState("");
  const [alltask, setAllTask] = useState([]);
  const [taskId, setTaskId] = useState("");
  const [loading, setLoading] = useState(true);
  const [showempid, setShowEmpId] = useState("");

  useEffect(() => {
    getAllArchiveTask();
  }, []);

  const idnull = () => {
    setTask("");
  };

  const getAllArchiveTask = async () => {
    // setLoading(true);
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/allarchivetask`,
        {
          method: "get",
        }
      );
      result = await result.json();

      setAllTask(result);
    } catch (error) {
      toast.error("Failed Data Loading");
    } finally {
      setLoading(false);
    }
  };

  const deletetask = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
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
          Swal.fire("Deleted!", "Your Task has been deleted.", "success");
          getAllArchiveTask();
        }
      }
    });
  };

  const origString = showempid;
  const modifString = origString.replace("archive", "");

  const removearchivetask = async () => {
    // setArchiveTask(modifString);
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/updatetask/${taskId}`,
        {
          method: "put",
          body: JSON.stringify({ empid: modifString, archive: "N" }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      result = await result.json();
      if (result) {
        toast.success("Task Reassign Successfully");
        getAllArchiveTask();
        setTaskId("");
      }
    } catch {
      toast.error("Failed Update Data");
    }
  };

  return (
    <>
      {authData.role === "admin" ||
      authData.role === "Team Lead" ||
      authData.role === "Human Resource" ? (
        <div className="allemployee">
          <div className=" wid-100 mx-3">
            <div
              className="bg-white py-3"
              style={{ position: "sticky", top: "0", zIndex: "999" }}
            >
              <h4 className="mb-2">All Archive Task</h4>

              <table className="wid-100">
                <thead>
                  <tr>
                    <th className="text-start wid-60">Task</th>
                    <th className="wid-10 text-start">Project</th>
                    <th className=" text-center wid-5">Status</th>
                    <th className="text-center wid-5">Modify</th>
                  </tr>
                </thead>
                {loading ? (
                  <div className="loader-container">
                    <ClipLoader size={35} color={"#36D7B7"} loading={loading} />
                  </div>
                ) : (
                  <tbody>
                    {alltask.length > 0 ? (
                      alltask.map((item, index) => (
                        <>
                          <tr
                            key={item._id}
                            style={{
                              backgroundColor:
                                item.status === "Pending"
                                  ? "rgba(239, 154, 154, 0.7)"
                                  : item.status === "Running"
                                  ? "rgba(255, 235, 59, 0.6)"
                                  : item.status === "Completed"
                                  ? "rgba(0, 137, 123, 0.8)"
                                  : "rgba(239, 154, 154, 0.7)",
                            }}
                          >
                            <td className="text-start lh-sm pb-0 pt-3">
                              {parse(item.task)}
                            </td>

                            <td className="text-start lh-sm pb-0 pt-3">
                              {typeof item.project === "string"
                                ? parse(item.project)
                                : null}
                            </td>

                            <td className="text-center">{item.status}</td>

                            <td>
                              <Link
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="Reassign"
                                className="me-3"
                                onClick={(e) => {
                                  e.preventDefault();
                                  removearchivetask();
                                }}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setTaskId(item._id);
                                  setShowEmpId(item.empid);
                                }}
                              >
                                <i
                                  class="bi bi-dash-circle-fill"
                                  style={{ color: "brown" }}
                                ></i>
                              </Link>

                              <Link
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="Delete"
                                onClick={() => deletetask(item._id)}
                              >
                                <i className="bi bi-trash3-fill"></i>
                              </Link>
                            </td>
                          </tr>
                        </>
                      ))
                    ) : (
                      <h4
                        className="text-center mb-0"
                        style={{
                          marginLeft: "7%",
                          color: "rgba(0, 137, 123, 0.3)",
                        }}
                      >
                        No Record
                      </h4>
                    )}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      ) : (
        <PageNotFound />
      )}
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        class="m-0"
      />
    </>
  );
}
