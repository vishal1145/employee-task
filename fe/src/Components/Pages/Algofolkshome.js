import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import JoditEditor from "jodit-react";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
// import moment from "moment";
import parse from "html-react-parser";
import Swal from "sweetalert2";

export default function Algofolkshome() {
  const [listname, setListname] = useState([]);
  const [task, setTask] = useState("");
  const [name, setName] = useState(null);
  // const [assign, setAssign] = useState("");
  const [time, setTime] = useState("1 hour");
  const [alltask, setAllTask] = useState([]);
  const [taskId, setTaskId] = useState("");
  const [project, setProject] = useState("");
  const [listproject, setListProject] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnloading, setBtnLoading] = useState(false);

  const closeButtonRef4 = useRef();
  const closeButtonRef5 = useRef();
  const editor = useRef(null);

  useEffect(() => {
    getListname();
    getListProject();
    getUpdate();
    getAllTaskNotId();
  }, []);

  const idnull = () => {
    setTask("");
  };

  const collectData = async () => {
    setBtnLoading(true);
    if (task === "" || null) {
      toast.info("Please fill the task");
      setBtnLoading(false);
    } else {
      try {
        let result2 = await fetch(
          `${process.env.REACT_APP_API_KEY}/adddetailss`,
          {
            method: "post",
            body: JSON.stringify({
              task,
              assign: "Not Assign",
              // empid,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        result2 = await result2.json();
        if (result2) {
          toast.success("Task added successfully");
          setTask("");
          setProject("");
          // setName(null);
          // setAssign("Not Assign");
          getAllTaskNotId();
          // closeButtonRef5.current.click();
        }
      } catch (error) {
        toast.error("Failed to add task");
      } finally {
        setBtnLoading(false);
      }
    }
  };

  const [showUpdateNullTaskModal, setShowUpdateNullTaskModal] = useState(true);

  let getUpdate = async (id) => {
    setTaskId(id);
    if (!id) return;

    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/taskautofillss/${id}`,
      {
        method: "get",
      }
    );

    result = await result.json();
    setTask(result.task);
    setName(result.name);
  };

  const updateTask = async (taskId) => {
    setBtnLoading(true);
    if (task === "" || null) {
      toast.info("Please fill the task");
      setBtnLoading(false);
    } else {
      try {
        let result1 = await fetch(
          `${process.env.REACT_APP_API_KEY}/listnamess`,
          {
            method: "get",
          }
        );
        result1 = await result1.json();
        setListname(result1);
        let empid = name;

        let result3 = await fetch(
          `${process.env.REACT_APP_API_KEY}/updatetaskss/${taskId}`,
          {
            method: "PUT",
            body: JSON.stringify({
              task,
              empid,
              time,
              project,
              date: new Date(),
              // assign,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        result3 = await result3.json();

        if (result3) {
          toast.success("Task updated successfully");
          setShowUpdateNullTaskModal(false);
          getAllTaskNotId(); // Refresh task list
          setTask("");
          setTime("1 hour");
          setName(null);
          setProject("");
          // closeButtonRef4.current.click();
          // setTimeout(() => {
          //   window.location.reload();
          // }, 1000);
        }
      } catch (error) {
        toast.error("Failed to update task");
      } finally {
        setBtnLoading(false);
      }
    }
  };

  const getListname = async () => {
    let result = await fetch(`${process.env.REACT_APP_API_KEY}/listnamess`, {
      method: "get",
    });
    result = await result.json();

    // Sort the list alphabetically

    result.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

    setListname(result);
  };

  const getListProject = async () => {
    let result = await fetch(`${process.env.REACT_APP_API_KEY}/listprojects`, {
      method: "get",
    });
    result = await result.json();

    // Sort the list alphabetically

    result.sort((a, b) =>
      a.project > b.project ? 1 : b.project > a.project ? -1 : 0
    );

    setListProject(result);
  };

  const getAllTaskNotId = async () => {
    // setLoading(true);
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/alltasknotempid`,
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
          getAllTaskNotId();
        }
      }
    });
  };

  return (
    <>
      <div className="allemployee">
        {/* <div className=""> */}
        <div className=" wid-100 mx-3">
          <div
            className="d-flex align-items-center justify-content-between bg-white py-2"
            style={{ position: "sticky", top: "0", zIndex: "999" }}
          >
            {/* <div className=""> */}
            <h4 className="mb-0">Not Assigned Task</h4>
            {/* </div> */}

            <div>
              <button
                type="button"
                className="btn me-0 ButtonText"
                data-bs-toggle="modal"
                data-bs-target="#addTaskModal"
                onClick={idnull}
              >
                Add Task
              </button>

              <div
                class="modal fade"
                id="addTaskModal"
                tabindex="-1"
                aria-labelledby="addTaskModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog modal-dialog-centered modal-xl">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="addTaskModalLabel">
                        Add Task
                      </h5>
                      <button
                        ref={closeButtonRef5}
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>

                    <div class="modal-body">
                      {/* <div className=""> */}
                      <form id="addform">
                        <label htmlFor="addtask" className="form-label shno">
                          Task
                        </label>
                        <JoditEditor
                          ref={editor}
                          value={task}
                          // config={config}
                          // tabIndex={1} // tabIndex of textarea
                          // onBlur={(newTask) => setTask(newTask)} // preferred to use only this option to update the content for performance reasons
                          // value={displayedTask}
                          onChange={(newTask) => setTask(newTask)}
                        />
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button
                        id="add"
                        className="btn wid-100"
                        type="button"
                        onClick={collectData}
                      >
                        {btnloading ? (
                          <div className="d-flex align-items-center justify-content-center">
                            <ClipLoader
                              size={22}
                              color={"#36D7B7"}
                              loading={btnloading}
                            />
                          </div>
                        ) : (
                          <span>Submit</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <table className="wid-100">
            <thead>
              <tr>
                <th className="text-start wid-60">Task</th>
                {/* <th className="text-center wid-10">Assign</th> */}
                <th className="text-center wid-5">Modify</th>
              </tr>
            </thead>
            {loading ? ( // Display loader if loading state is true
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
                          {/* <div>
                            <div
                              className="remove-margin remove-marginol"
                              dangerouslySetInnerHTML={{ __html: item.task }}
                            />
                          </div> */}
                        </td>

                        {/* <td className="text-center">{item.assign}</td> */}

                        <td className="modifysec text-center">
                          <Link
                            onClick={(e) => {
                              e.preventDefault();
                              getUpdate(item._id);
                            }}
                            onMouseEnter={(e) => {
                              e.preventDefault();
                              setShowUpdateNullTaskModal(true);
                              setName(null);
                            }}
                            // to={item._id}
                            // let taskid={item._id}
                            type="button"
                            class="pe-3 pb-0"
                            data-bs-toggle="modal"
                            data-bs-target="#updateTaskModal"
                            // onClick={(e)=>{e.preventDefault();}}
                          >
                            <i
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="Update"
                              className="bi bi-pencil-square"
                              // onClick={updateCollectData(item._id)}
                              style={{ cursor: "pointer" }}
                            ></i>
                          </Link>

                          {showUpdateNullTaskModal && (
                            <div
                              class="modal fade"
                              id="updateTaskModal"
                              tabindex="-1"
                              aria-labelledby="updateTaskModalLabel"
                              aria-hidden="true"
                            >
                              <div class="modal-dialog modal-dialog-centered modal-xl">
                                <div class="modal-content">
                                  <div class="modal-header">
                                    <h5
                                      class="modal-title"
                                      id="updateTaskModalLabel"
                                    >
                                      Update Task
                                    </h5>
                                    <button
                                      ref={closeButtonRef4}
                                      type="button"
                                      class="btn-close"
                                      data-bs-dismiss="modal"
                                      aria-label="Close"
                                    ></button>
                                  </div>

                                  <div class="modal-body text-start">
                                    {/* <div className=""> */}
                                    <form id="updateform">
                                      <label
                                        htmlFor="updatetask"
                                        className="form-label shno"
                                      >
                                        Task
                                      </label>
                                      <JoditEditor
                                        ref={editor}
                                        // value={editingTask.task}
                                        value={task}
                                        onChange={(newTask) => setTask(newTask)}
                                        className="m"
                                      />

                                      <div className="d-flex align-items-center justify-content-between pt-2">
                                        <div className="wid-100 pe-2">
                                          <label
                                            htmlFor="employeename"
                                            className="form-label"
                                          >
                                            Employee Name
                                          </label>
                                          <select
                                            // type="text"
                                            className="form-select"
                                            aria-label="Default select example"
                                            id="employeename"
                                            value={name}
                                            onChange={(e) =>
                                              setName(e.target.value)
                                            }
                                          >
                                            <option value="">
                                              Choose any one
                                            </option>
                                            {listname.length > 0
                                              ? listname
                                                  .filter(
                                                    (item) =>
                                                      item.role !== "admin"
                                                  )
                                                  .map((item, index) => (
                                                    <option
                                                      value={item._id}
                                                      key={item._id}
                                                    >
                                                      {item.name}
                                                    </option>
                                                  ))
                                              : null}
                                          </select>
                                        </div>

                                        <div className="wid-100 pe-2">
                                          <label
                                            htmlFor="projectname"
                                            className="form-label"
                                          >
                                            Project Name
                                          </label>
                                          <select
                                            // type="text"
                                            className="form-select"
                                            aria-label="Default select example"
                                            id="projectname"
                                            value={project}
                                            // value={item._id}
                                            onChange={(e) =>
                                              setProject(e.target.value)
                                            }
                                          >
                                            <option value="" disabled>
                                              Choose any one
                                            </option>
                                            {listproject.length > 0
                                              ? listproject.map(
                                                  (item, index) => (
                                                    <option
                                                      key={item._id}
                                                      value={item.project}
                                                    >
                                                      {parse(item.project)}
                                                    </option>
                                                  )
                                                )
                                              : null}
                                          </select>
                                        </div>

                                        <div className="wid-100">
                                          <label
                                            htmlFor="timeduration"
                                            className="form-label"
                                          >
                                            Time Duration
                                          </label>
                                          <select
                                            // type="text"
                                            className="form-select"
                                            aria-label="Default select example"
                                            id="timeduration"
                                            value={time}
                                            onChange={(e) =>
                                              setTime(e.target.value)
                                            }
                                          >
                                            <option value="1 hour">
                                              1 hour
                                            </option>
                                            <option value="2 hours">
                                              2 hours
                                            </option>
                                            <option value="3 hours">
                                              3 hours
                                            </option>
                                            <option value="4 hours">
                                              4 hours
                                            </option>
                                            <option value="5 hours">
                                              5 hours
                                            </option>
                                            <option value="6 hours">
                                              6 hours
                                            </option>
                                            <option value="7 hours">
                                              7 hours
                                            </option>
                                            <option value="8 hours">
                                              8 hours
                                            </option>
                                            <option value="On Going">
                                              On Going
                                            </option>
                                          </select>
                                        </div>
                                      </div>
                                    </form>
                                  </div>
                                  <div className="modal-footer" id="update">
                                    <button
                                      className="btn wid-100"
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        updateTask(taskId);
                                      }}
                                    >
                                      {btnloading ? (
                                        <div className="d-flex align-items-center justify-content-center">
                                          <ClipLoader
                                            size={22}
                                            color={"#36D7B7"}
                                            loading={btnloading}
                                          />
                                        </div>
                                      ) : (
                                        <span>Update</span>
                                      )}
                                    </button>
                                  </div>

                                  {/* </div> */}
                                </div>
                              </div>
                            </div>
                          )}

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
      {/* </div> */}
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
        // transition:Bounce
      />
    </>
  );
}
