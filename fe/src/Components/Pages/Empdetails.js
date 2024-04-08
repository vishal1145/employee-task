import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import JoditEditor from "jodit-react";
import parse from "html-react-parser";

export default function Empdetails() {
  var authData = localStorage.getItem("user");

  const [empdeatils, setEmpdetails] = useState("");
  const [status, setStatus] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState("");
  const [listname, setListname] = useState("");
  const [task, setTask] = useState("");
  const [time, setTime] = useState("1 hour");
  // const [name, setName] = useState("");
  // const [date, setDate] = useState("");
  const [taskId, setTaskId] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useParams();
  // const navigate = useNavigate();
  const editor = useRef(null);
  const closeButtonRef = useRef();

  useEffect(() => {
    getEmpdetails();
    getMessages();
    getListname();
    getUpdate();
  }, [params.id]);
  // [params.id, dataUploaded];

  const idnull=()=>{
    setTask("");
    setTime("1 hour");
  };

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

  const collectData = async () => {
    setLoading(true);
    if (task === "" || null) {
      toast.info("Please fill the task");
      setLoading(false);
    } else {
      const empid = params.id;

      try {
        let result2 = await fetch(`${process.env.REACT_APP_API_KEY}/adddetails`, {
          method: "post",
          body: JSON.stringify({
            task,
            time,
            empid,
            // name,
            date: new Date(),
            assign: "Assign",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        result2 = await result2.json();

        if (result2) {
          toast.success("Task added successfully");
          setTask("");
          // setDate("");
          setTime("1 hour");
          getEmpdetails();
        }
      } catch (error) {
        toast.error("Failed to add task");
      } finally {
        setLoading(false);
      }
    }
  };

  const getUpdate = async (id) => {
    setTaskId(id);
    if (!id) return;
    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/taskautofill/${id}`,
      {
        method: "get",
      }
    );

    result = await result.json();
    setTask(result.task);
    setTime(result.time);
  };

  const updateCollectData = async (taskId) => {
    setLoading(true);
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/updatetask/${taskId}`,
        {
          method: "put",
          body: JSON.stringify({ task, time }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      result = await result.json();
      // closeButtonRef.current.click();
      if (result) {
        toast.success("Task updated successfully");
        setTask("");
        getEmpdetails();

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch {
      toast.error("Failed Update Data")
    } finally {
      setLoading(false);
    }
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
      setStatus("Pending");
    }
  };

  const getStatusColorClass = (status) => {
    switch (status) {
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

  const addMessages = async () => {
    const name = JSON.parse(localStorage.getItem("user")).name;
    const empid = params.id;
    // var messages = message;

    let result = await fetch(`${process.env.REACT_APP_API_KEY}/addmessages`, {
      method: "post",
      body: JSON.stringify({ empid, name, text, sender: "sender" }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
    if (result) {
      setText("");
      getMessages();
    }
  };

  const getMessages = async () => {
    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/getmessages/${params.id}`,
      {
        method: "get",
      }
    );
    result = await result.json();
    setMessages(result);
    // setEmpdetails(result);
  };

  const getListname = async () => {
    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/messagebodyname/${params.id}`
    );

    result = await result.json();

    setListname(result);
  };

  const deletechat = async (id) => {
    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/deletechat/${id}`,
      {
        method: "Delete",
        headers: {
          // authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        },
      }
    );
    result = await result.json();
    if (result) {
      // alert("Task deleted Successfully");
      getMessages();
    }
  };

  // const handleKeyPress = (e) => {
  //   if (e.key === "Enter") {
  //     addMessages();
  //   }
  // };

  return (
    <>
      <div className="empdeatils wid-80">
        <div className="headsec">
          <h5 className="mb-0">Task</h5>
          {JSON.parse(authData).role === "admin" ? (
            <div className="addtaskbtn">
              <button
                type="button"
                class="btn"
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
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <form>
                        <label htmlFor="addtask" className="form-label shno">
                          Task
                        </label>

                        <JoditEditor
                          ref={editor}
                          value={task}
                          onChange={(newTask) => {
                            setTask(newTask);
                          }}
                        />

                        <div className="d-flex align-items-center justify-content-between">
                          <div className="wid-100 pt-2">
                            <label
                              htmlFor="timeduration"
                              className="form-label"
                            >
                              Time Duration
                            </label>
                            <select
                              className="form-select"
                              aria-label="Default select example"
                              id="timeduration"
                              value={time}
                              onChange={(e) => setTime(e.target.value)}
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

                        <div className="d-flex flex-row">
                          <button
                            className="btn mt-3 me-2 wid-100"
                            type="button"
                            onClick={collectData}
                            disabled={loading}
                          >
                            {loading ? (
                              <ClipLoader size={18} color={"#ffffff"} loading={loading} />
                            ) : (
                              "Submit"
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <table className="wid-100">
          <thead>
            <tr>
              <th className="wid-40 text-start">Task</th>
              {JSON.parse(authData).role === "admin" ? (
                <>
                  {/* <th className="wid-7 text-center">Date</th> */}
                  <th className="wid-5 text-center">Estimate</th>
                </>
              ) : null}
              {JSON.parse(authData).role === "admin" ? null : (
                <th className=" text-center" style={{ width: "8%" }}>
                  Status
                </th>
              )}
              {JSON.parse(authData).role === "admin" ? (
                <th className="wid-5 text-center">Modify</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {empdeatils.length > 0
              ? empdeatils.map((item, index) => (
                <tr
                  key={index}
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
                  {/* <td className="text-start">{htmlToText(item.task)}</td> */}
                  <td className="text-start lh-sm pb-0 pt-3">
                    {parse(item.task)}
                  </td>
                  {/* <td className="text-start">{item.task}</td> */}
                  {JSON.parse(authData).role === "admin" ? (
                    <>
                      {/* <td className="text-center">
                          {moment(item.date).format("DD-MM-YYYY")}
                        </td> */}
                      <td className="text-center">{item.time}</td>
                    </>
                  ) : null}

                  {JSON.parse(authData).role === "admin" ? null : (
                    <td className="text-center" key={index}>
                      <NavLink
                        className="text-decoration-none"
                        onClick={() => addstatus(item._id)}
                      >
                        <select
                          className={`form-select choosestatus ${getStatusColorClass(
                            status
                          )}`}
                          value={item.status || status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="Pending" className="textRed">
                            Pending
                          </option>
                          <option value="Running" className="textYellow">
                            Running
                          </option>
                          <option value="Completed" className="textGreen">
                            Completed
                          </option>
                        </select>
                      </NavLink>
                    </td>
                  )}
                  {JSON.parse(authData).role === "admin" ? (
                    <td className="modifysec text-center">
                      {/* <i
                          className="bi bi-pencil-square pe-3"
                          onClick={() => handleUpdateTaskClick(item._id)}
                          style={{ cursor: "pointer" }}
                        ></i> */}

                      <Link
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#updateTaskModal"
                      >
                        <i
                          className="bi bi-pencil-square pe-3"
                          // onClick={() => handleUpdateTaskClick(item._id)}
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
                            <div class="modal-body">
                              <form className="text-start">
                                <label
                                  htmlFor="addtask"
                                  className="form-label shno"
                                >
                                  Task
                                </label>

                                <JoditEditor
                                  //ref={editor}
                                  value={task}
                                  onChange={(newTask) => {
                                    setTask(newTask);
                                  }}
                                />

                                <div className="d-flex justify-content-between pt-2">
                                  <div className="wid-100">
                                    <label
                                      htmlFor="timeduration"
                                      className="form-label"
                                    >
                                      Time Duration
                                    </label>
                                    <select
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

                                <div className="d-flex flex-row">
                                  <button
                                    className="btn mt-3 me-2 wid-100"
                                    type="button"
                                    onClick={() => updateCollectData(taskId)}
                                    disabled={loading}
                                  >
                                    {loading ? (
                                      <ClipLoader size={18} color={"#ffffff"} loading={loading} />
                                    ) : (
                                      "Update"
                                    )}
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>

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

        <div>
          <button
            className="btn btn-primary messagebtn"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
            aria-controls="offcanvasRight"
          >
            <i className="bi bi-chat-square-text-fill"></i>
          </button>

          <div
            className="offcanvas"
            tabIndex="-1"
            id="offcanvasRight"
            aria-labelledby="offcanvasRightLabel"
          >
            {listname.length > 0
              ? listname.map((item, index) => (
                <div className="offcanvas-header">
                  <div className="menudiv d-flex align-items-center">
                    <div
                      className="menuimg"
                      style={{
                        backgroundColor:
                          item.online === true ? "yellow" : "white",
                        width: "35px",
                        height: "35px",
                        borderRadius: "100px",
                      }}
                    >
                      {item.profileimage === "" ||
                        item.profileimage == null ? (
                        <img
                          className="profimage"
                          src={"/empimg.jpg"}
                          alt=""
                          style={{
                            width: "35px",
                            height: "35px",
                            borderRadius: "100px",
                          }}
                        />
                      ) : (
                        <img
                          className="profimage"
                          src={item.profileimage}
                          alt=""
                          style={{
                            width: "35px",
                            height: "35px",
                            borderRadius: "100px",
                          }}
                        />
                      )}
                    </div>
                    <div className="ps-2">{item.name}</div>
                  </div>
                  <button
                    type="button"
                    className="btn-close text-reset"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  ></button>
                </div>
              ))
              : null}

            <div className="offcanvas-bodys">
              {messages.length > 0
                ? messages.map((item, index) => (
                  <div
                    className="getmessage"
                    style={{
                      textAlign: item.name === "Admin" ? "left" : "left",
                      backgroundColor:
                        item.name === "Rishi Ranjan"
                          ? "rgba(9, 185, 129, 0.4)"
                          : "rgba(0, 137, 123, 0.4)",
                      alignSelf: item.name === "Admin" ? "start" : "end",
                    }}
                  >
                    <div className="">
                      <div className="d-flex align-items-center justify-content-between">
                        <h6
                          style={{
                            fontSize: "10px",
                            marginBottom: "2px",
                            paddingRight: "3px",
                          }}
                        >
                          {item.name}
                        </h6>

                        <div className="chatdotmenu">
                          <div className="dropdown">
                            <button
                              className="btn dropdown-toggl"
                              type="button"
                              id="dropdownMenuButton1"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i
                                className="bi bi-three-dots-vertical"
                                style={{ fontSize: "9px" }}
                              ></i>
                            </button>
                            <ul
                              className="dropdown-menu p-0"
                              aria-labelledby="dropdownMenuButton1"
                            >
                              <li className="">
                                <Link
                                  className="dropdown-item p-1"
                                  onClick={() => deletechat(item._id)}
                                >
                                  Delete
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="msgbody">
                        <h6>{item.text}</h6>
                      </div>
                      <h6>{ }</h6>
                    </div>
                  </div>
                ))
                : null}
            </div>

            <div className="offcanvas-footer">
              <form>
                <input
                  type="text"
                  placeholder="Message here"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                // onKeyPress={handleKeyPress}
                />
                <button
                  // ref={buttonRef}
                  className=""
                  type="button"
                  onClick={addMessages}
                >
                  <i className="bi bi-send"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
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
      // transition:Bounce
      />
    </>
  );
}
