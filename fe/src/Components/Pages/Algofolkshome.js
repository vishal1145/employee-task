import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import JoditEditor from "jodit-react";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import parse from "html-react-parser";

export default function Algofolkshome() {
  const [listname, setListname] = useState([]);
  // const [employee, setEmployee] = useState("");
  const [task, setTask] = useState("");
  const [editingTask, setEditingTask] = useState({
    id: "",
    task: "",
    name: "",
  });
  const [displayedTask, setDisplayedTask] = useState("");
  const [name, setName] = useState("");
  const [alltask, setAllTask] = useState([]);

  const editor = useRef(null);

  useEffect(() => {
    getListname();
    getUpdates();
    getAllTask();
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
            task: displayedTask,
            name: "No Name",
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
    setDisplayedTask("");
    // setName("");
    getAllTask();
  };

  const updateTask = async (id) => {
    try {
      // Fetch the specific task details based on its ID
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/taskautofillss/${id}`
      );
      const editingTask = await response.json();

      // Update the task using the fetched data
      const result = await fetch(
        `${process.env.REACT_APP_API_KEY}/updatetaskss/${editingTask.id}`,
        {
          method: "put",
          body: JSON.stringify({ task: editingTask.task, name }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await result.json();
      if (data) {
        toast.success("Task updated successfully");
        getAllTask(); // Refresh task list
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

  let getUpdates = async (id) => {
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

  const getAllTask = async () => {
    let result = await fetch(`${process.env.REACT_APP_API_KEY}/alltask`, {
      method: "get",
    });
    result = await result.json();

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
      getAllTask();
    }
  };

  return (
    <>
      <div className="allemployee">
        <div className="container-xl">
          <div className="mt-2">
            <div
              className="d-flex align-items-center justify-content-between bg-white"
              style={{ position: "sticky", top: "0", zIndex: "999" }}
            >
              <div className="">
                <h4>All Task</h4>
              </div>
              <div>
                <button
                  type="button"
                  className="btn btn-primary me-0"
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
                            <label
                              htmlFor="addtask"
                              className="form-label shno"
                            >
                              Task
                            </label>
                            <JoditEditor
                              ref={editor}
                              // value={task}
                              // style={{height:"200px"}}
                              // config={config}
                              // tabIndex={1} // tabIndex of textarea
                              // onBlur={(newTask) => setTask(newTask)} // preferred to use only this option to update the content for performance reasons
                              value={displayedTask}
                              onChange={(newTask) => setDisplayedTask(newTask)}
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
            <table>
              <thead>
                <tr>
                  <th className="text-start wid-85">Task</th>
                  <th className="text-start wid-10">Assign</th>
                  <th className="text-center wid-5">Modify</th>
                </tr>
              </thead>
              <tbody>
                {alltask.length > 0
                  ? alltask.map((item, index) => (
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

                        <td className="text-start">{item.name}</td>

                        <td className="modifysec text-center">
                          {/* <div> */}
                          <Link
                            type="button"
                            class="pe-2"
                            data-bs-toggle="modal"
                            data-bs-target="#updateTaskModal"
                            // onClick={() => getUpdates(item._id)}
                            onClick={() =>
                              setEditingTask({
                                id: item._id,
                                task: item.task,
                                name: item.name,
                              })
                            }
                          >
                            <i
                              className="bi bi-pencil-square"
                              // onClick={updateCollectData(item._id)}

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
                                      value={editingTask.task}
                                      // style={{height:"200px"}}
                                      // config={config}
                                      // tabIndex={1} // tabIndex of textarea
                                      // onBlur={(newTask) => setTask(newTask)} // preferred to use only this option to update the content for performance reasons
                                      onChange={(newTask) =>
                                        setEditingTask({
                                          ...editingTask,
                                          task: newTask,
                                        })
                                      }
                                    />

                                    <div className="d-flex align-items-center justify-content-between">
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
                                          // value={name}
                                          // onChange={(e) => setName(e.target.value)}
                                          value={editingTask.name}
                                          onChange={(e) =>
                                            setEditingTask({
                                              ...editingTask,
                                              name: e.target.value,
                                            })
                                          }
                                          // placeholder="Time Duration"
                                          // required
                                        >
                                          {listname.length > 0
                                            ? listname.map((item, index) => (
                                                <option
                                                  value={item.name}
                                                  key={item._id}
                                                >
                                                  {item.name}
                                                </option>
                                              ))
                                            : null}
                                        </select>
                                      </div>
                                    </div>

                                    <div
                                      className="d-flex flex-row"
                                      id="update"
                                    >
                                      <button
                                        className="btn mt-3 me-2 wid-100"
                                        type="button"
                                        onClick={updateTask}
                                      >
                                        Submit
                                      </button>
                                    </div>
                                  </form>
                                  {/* </div> */}
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* </div> */}

                          <Link onClick={() => deletetask(item._id)}>
                            <i className="bi bi-trash3-fill"></i>
                          </Link>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
