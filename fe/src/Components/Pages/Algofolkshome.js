import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import JoditEditor from "jodit-react";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import parse from "html-react-parser";

export default function Algofolkshome() {
  const [listname, setListname] = useState([]);
  // const [employee, setEmployee] = useState("");
  // const [addtask, setAddTask] = useState("");
  // const [updatetask, setUpdateTask] = useState("");
  const [task, setTask] = useState("");
  const [name, setName] = useState("");
  // const [assign, setAssign] = useState("");
  const [time, setTime] = useState("1 hour");
  const [alltask, setAllTask] = useState([]);
  const [taskId, setTaskId] = useState("");

  const closeButtonRef = useRef();
  const editor = useRef(null);

  useEffect(() => {
    getListname();
    getUpdate();
    getAllTaskNotId();
  }, []);

  const collectData = async () => {
    // setLoading(true);

    // const empid = params.id;
    try {
      // let result1 = await fetch(`${process.env.REACT_APP_API_KEY}/listnamess`, {
      //   method: "get",
      // });
      // result1 = await result1.json();

      // setListname(result1);
      // // const name = result1.name;
      // const empid = result1._id;

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

        // Call the fetchUpdatedEmpDetails callback function
        // fetchUpdatedEmpDetails();
      }
    } catch (error) {
      toast.error("Failed to add task");
    } finally {
      // setLoading(false);
    }
    setTask("");
    // setAssign("Not Assign");
    getAllTaskNotId();
  };

  const updateTask = async (taskId) => {
    try {
      let result1 = await fetch(`${process.env.REACT_APP_API_KEY}/listnamess`, {
        method: "get",
      });
      result1 = await result1.json();

      setListname(result1);
      let empid = name

      let result2 = await fetch(
        `${process.env.REACT_APP_API_KEY}/updatetaskss/${taskId}`,
        {
          method: "put",
          body: JSON.stringify({
            task,
            empid,
            time,
            date: new Date(),
            // assign,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      result2 = await result2.json();
      if (result2) {
        toast.success("Task updated successfully");
        // window.location.reload();
        closeButtonRef.current.click();
        getAllTaskNotId(); // Refresh task list
        setTask("");
      }
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const getListname = async () => {
    let result = await fetch(`${process.env.REACT_APP_API_KEY}/listnamess`, {
      method: "get",
    });
    result = await result.json();

    setListname(result);
  };

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

  const getAllTaskNotId = async () => {
    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/alltasknotempid`,
      {
        method: "get",
      }
    );
    result = await result.json();
    console.log(result);

    setAllTask(result);
  };

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
      getAllTaskNotId();
    }
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
                className="btn me-0"
                data-bs-toggle="modal"
                data-bs-target="#addTaskModal"
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
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>

                    <div class="modal-body">
                      <div className="">
                        <form id="addform">
                          <label htmlFor="addtask" className="form-label shno">
                            Task
                          </label>
                          <JoditEditor
                            ref={editor}
                            value={task}
                            // style={{height:"200px"}}
                            // config={config}
                            // tabIndex={1} // tabIndex of textarea
                            // onBlur={(newTask) => setTask(newTask)} // preferred to use only this option to update the content for performance reasons
                            // value={displayedTask}
                            onChange={(newTask) => setTask(newTask)}
                          />

                          {/* <div className="d-flex align-items-center justify-content-between">
                          <div className="wid-100 pt-2">
                            <label
                              htmlFor="employeename"
                              className="form-label"
                            >
                              Employee Name
                            </label>
                            <select
                              type="text"
                              className="form-control"
                              id="employeename"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            >
                              
                              {listname.length > 0
                                ? listname.map((item, index) => (
                                    <option value={item.name} key={item._id}>
                                      {item.name}
                                    </option>
                                  ))
                                : null}
                            </select>
                          </div>
                        </div> */}

                          <div className="d-flex flex-row">
                            <button
                              id="add"
                              className="btn mt-3 me-2 wid-100"
                              type="button"
                              onClick={collectData}
                            >
                              Submit
                            </button>
                          </div>
                        </form>
                      </div>
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
                <th className="text-center wid-10">Assign</th>
                <th className="text-center wid-5">Modify</th>
              </tr>
            </thead>
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

                      <td className="text-center">{item.assign}</td>

                      <td className="modifysec text-center">
                        <Link
                          // to={item._id}
                          // let taskid={item._id}
                          type="button"
                          class="pe-3"
                          data-bs-toggle="modal"
                          data-bs-target="#updateTaskModal"
                        >
                          <i
                            className="bi bi-pencil-square"
                            // onClick={updateCollectData(item._id)}
                            onClick={() => getUpdate(item._id)}
                            style={{ cursor: "pointer" }}
                          ></i>
                        </Link>

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
                                  ref={closeButtonRef}
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
                                  />

                                  <div className="d-flex align-items-center justify-content-between pt-2">
                                    <div className="wid-50 pe-2">
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
                                        <option value="" disabled>
                                          Choose any one
                                        </option>
                                        {listname.length > 0
                                          ? listname.map((item, index) => (
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

                                    <div className="wid-50">
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
                                        <option value="1 hour">1 hour</option>
                                        <option value="2 hours">2 hours</option>
                                        <option value="3 hours">3 hours</option>
                                        <option value="4 hours">4 hours</option>
                                        <option value="5 hours">5 hours</option>
                                        <option value="6 hours">6 hours</option>
                                        <option value="7 hours">7 hours</option>
                                        <option value="8 hours">8 hours</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="d-flex flex-row" id="update">
                                    <button
                                      className="btn mt-3 me-2 wid-100"
                                      type="button"
                                      onClick={() => updateTask(taskId)}
                                    >
                                      Update
                                    </button>
                                  </div>
                                </form>
                                {/* </div> */}
                              </div>
                            </div>
                          </div>
                        </div>

                        <Link onClick={() => deletetask(item._id)}>
                          <i className="bi bi-trash3-fill"></i>
                        </Link>
                      </td>
                    </tr>
                  </>
                ))
              ) : (
                <h4
                  className="text-center mb-0"
                  style={{ marginLeft: "20%", color: "rgba(0, 137, 123, 0.3)" }}
                >
                  No Record
                </h4>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* </div> */}
      <ToastContainer />
    </>
  );
}
