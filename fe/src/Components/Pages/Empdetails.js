import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import JoditEditor from "jodit-react";
import parse from "html-react-parser";
import Swal from "sweetalert2";
import PageNotFound from "./PageNotFound";

export default function Empdetails() {
  var authData = localStorage.getItem("user");

  const [empdeatils, setEmpdetails] = useState([]);
  const [status, setStatus] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [listname, setListname] = useState([]);
  const [task, setTask] = useState("");
  const [time, setTime] = useState("1 hour");
  // const [statuscount, setStatusCount] = useState([]);
  // const [name, setName] = useState("");
  // const [date, setDate] = useState("");
  const [taskId, setTaskId] = useState("");
  const [loading, setLoading] = useState(false);
  const [stopInterval2, setStopInterval2] = React.useState("stop");
  // const [dataLoad, setDataLoad] = useState(false);
  // const [socket, setSocket] = useState(null);
  const [project, setProject] = useState("");
  const [listproject, setListProject] = useState([]);
  const [reassign, setReassign] = useState("");
  const [reassignListName, setReassignListName] = useState([]);

  const closeButtonRef6 = useRef();
  const closeButtonRef7 = useRef();
  const closeButtonRef15 = useRef();
  const params = useParams();
  // const navigate = useNavigate();
  const editor = useRef(null);
  const inputRef = useRef(null);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("messageButton").click();
    }
  };

  useEffect(() => {
    getMessages();
    getEmpdetails();
    getListname();
    getReassignListName();
    getListProject();
    getUpdate();
    // getStatusCount();

    if (stopInterval2 === "run") {
      const interval = setInterval(getMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [params.id, stopInterval2]);

  const idnull = () => {
    setTask("");
    setTime("1 hour");
    setProject("");
  };

  // const getStatusCount = async (id) => {
  //   let result = await fetch(
  //     `${process.env.REACT_APP_API_KEY}/statuscount/${id}`,
  //     {
  //       method: "get",
  //     }
  //   );

  //   result = await result.json();
  //   setStatusCount(result);
  // };

  const getEmpdetails = async () => {
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/empdetails/${params.id}`,
        {
          method: "get",
        }
      );

      result = await result.json();
      setEmpdetails(result);
    } catch (error) {
      toast.error("Error loading");
    }
  };

  const collectData = async () => {
    setLoading(true);
    if (task === "" || null) {
      toast.info("Please fill the task");
      setLoading(false);
    } else {
      const empid = params.id;

      try {
        let result2 = await fetch(
          `${process.env.REACT_APP_API_KEY}/adddetails`,
          {
            method: "post",
            body: JSON.stringify({
              task,
              time,
              empid,
              project,
              // name,
              date: new Date(),
              assign: "Assign",
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
          // setDate("");
          setTime("1 hour");
          setProject("");
          getEmpdetails();
          // closeButtonRef6.current.click();
        }
      } catch (error) {
        toast.error("Failed to add task");
      } finally {
        setLoading(false);
      }
    }
  };
  const [showReassignTaskModal, setShowReassignTaskModal] = useState(true);
  const reassignCollectData = async (taskId) => {
    setLoading(true);
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/updatetask/${taskId}`,
        {
          method: "PUT",
          body: JSON.stringify({ empid: reassign }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      result = await result.json();
      if (result) {
        toast.success("Task Reassign successfully");
        setReassign("");
        getEmpdetails();
        setShowReassignTaskModal(false);
        closeButtonRef15.current.click();
      }
    } catch {
      toast.error("Failed Reassign Data");
    } finally {
      setLoading(false);
    }
  };
  // const namenull =()=>{
  //   setReassign("");
  // }

  const [showUpdateTaskModal, setShowUpdateTaskModal] = useState(true);

  const getUpdate = async (id) => {
    setTaskId(id);
    if (!id) return;
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/taskautofill/${id}`,
        {
          method: "get",
        }
      );

      result = await result.json();
      setTask(result.task);
      setTime(result.time);
      setProject(result.project);
    } catch (error) {
      toast.error("Error Loading");
    }
  };

  const updateCollectData = async (taskId) => {
    setLoading(true);
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/updatetask/${taskId}`,
        {
          method: "put",
          body: JSON.stringify({ task, time, project }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      result = await result.json();
      if (result) {
        toast.success("Task updated successfully");
        setTask("");
        setProject("");
        getEmpdetails();
        setShowUpdateTaskModal(false);

        // closeButtonRef7.current.click();
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
      }
    } catch {
      toast.error("Failed Update Data");
    } finally {
      setLoading(false);
    }
  };

  const deletetask = async (id) => {
    //   let result = await fetch(
    //     `${process.env.REACT_APP_API_KEY}/deletetask/${id}`,
    //     {
    //       method: "Delete",
    //       headers: {
    //         // authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
    //       },
    //     }
    //   );
    //   result = await result.json();
    //   if (result) {
    //     toast("Task deleted Successfully");
    //     getEmpdetails();
    //   }
    // };

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
          getEmpdetails();
        }
      }
    });
  };

  const addstatus = async (id) => {
    try {
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
    } catch (error) {
      toast.error("Error Loading");
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
    const role = JSON.parse(localStorage.getItem("user")).role;
    const empid = params.id;

    try {
      let result = await fetch(`${process.env.REACT_APP_API_KEY}/addmessages`, {
        method: "post",
        body: JSON.stringify({ empid, name, text, role, sender: "sender" }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      if (result) {
        setText("");
        getMessages();
      }
    } catch {
      toast.error("Failed to send messages");
    }
    // finally {
    //   setStopInterval2("stop");
    // }
  };

  const getMessages = async () => {
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/getmessages/${params.id}`,
        {
          method: "get",
        }
      );
      result = await result.json();
      if (result) {
        setMessages(result);
        // setStopInterval("run");
      }
    } catch (error) {
      toast.error("Error Loading");
    }
  };

  const getReassignListName = async () => {
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/reassignListName`
      );

      result = await result.json();

      setReassignListName(result);
    } catch (error) {
      toast.error("Error Loading");
    }
  };

  const getListname = async () => {
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/messagebodyname/${params.id}`
      );

      result = await result.json();

      setListname(result);
    } catch (error) {
      toast.error("Error Loading");
    }
  };

  const getListProject = async () => {
    try {
      let result = await fetch(`${process.env.REACT_APP_API_KEY}/listprojects`, {
        method: "get",
      });
      result = await result.json();

      // Sort the list alphabetically

      result.sort((a, b) =>
        a.project > b.project ? 1 : b.project > a.project ? -1 : 0
      );

      setListProject(result);
    } catch (error) {
      toast.error("Error Loading");
    }
  };

  const deletechat = async (id) => {
    try {
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
    } catch (error) {
      toast.error("Error Loading");
    }
  };

  // const handleKeyPress = (e) => {
  //   if (e.key === "Enter") {
  //     addMessages();
  //   }
  // };

  const stop = () => {
    setStopInterval2("stop");
  };

  const start = () => {
    setStopInterval2("run");
  };

  const referesh = () => {
    setLoading(true);
    try {
      getEmpdetails();
    } finally {
      setLoading(false);
    }
  };

  const chatBodyRef = useRef(null);
  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  // useEffect(()=>{
  //   scrollToBottom();
  // },[getMessages]);

  return (
    <>
      {/* {params.id===JSON.parse(authData)._id ? ( */}
      <div
        className={`empdeatils ${
          JSON.parse(authData).role === "admin" ||
          JSON.parse(authData).role === "Team Lead" ||
          JSON.parse(authData).role === "Human Resource"
            ? "wid-75"
            : "wid-100"
        }`}
      >
        {/* <div className="empdetails wid-100"> */}
        <div className="headsec">
          <div className="d-flex align-items-center">
            {listname.length > 0
              ? listname.map((item, index) => (
                  <h5 className="mb-0 me-3 border" style={{padding:"2px 5px", borderRadius:"7px"}}>{item.name}</h5>
                ))
              : null}
            <h5 className="mb-0 me-3">Task</h5>
            <Link onClick={referesh}>
              {loading ? (
                <ClipLoader size={18} color={"#36D7B7"} loading={loading} />
              ) : (
                <i
                  className="bi bi-arrow-clockwise"
                  style={{ fontSize: "18px", color: "rgb(0, 137, 123)" }}
                ></i>
              )}
            </Link>
          </div>
          {JSON.parse(authData).role === "admin" ||
          JSON.parse(authData).role === "Team Lead" ||
          JSON.parse(authData).role === "Human Resource" ? (
            <div className="addtaskbtn">
              <button
                type="button"
                class="btn ButtonText"
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
                        ref={closeButtonRef6}
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

                        <div className="d-flex align-items-center justify-content-between mt-3">
                          <div className="wid-100 me-2">
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
                              <option value="On Going">On Going</option>
                            </select>
                          </div>

                          <div className="wid-100">
                            <label htmlFor="projectname" className="form-label">
                              Project Name
                            </label>
                            <select
                              // type="text"
                              className="form-select"
                              aria-label="Default select example"
                              id="projectname"
                              value={project}
                              // value={item._id}
                              onChange={(e) => setProject(e.target.value)}
                            >
                              <option value="" disabled>
                                Choose any one
                              </option>
                              {listproject.length > 0
                                ? listproject.map((item, index) => (
                                    <option key={item._id} value={item.project}>
                                      {parse(item.project)}
                                    </option>
                                  ))
                                : null}
                            </select>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button
                        className="btn wid-100"
                        type="button"
                        onClick={collectData}
                        disabled={loading}
                      >
                        {loading ? (
                          <ClipLoader
                            size={18}
                            color={"#ffffff"}
                            loading={loading}
                          />
                        ) : (
                          "Submit"
                        )}
                      </button>
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
              <th className="wid-10 text-start">Project</th>
              {JSON.parse(authData).role === "admin" ||
              JSON.parse(authData).role === "Team Lead" ||
              JSON.parse(authData).role === "Human Resource" ? (
                <>
                  {/* <th className="wid-7 text-center">Date</th> */}
                  <th className="wid-5 text-center">Estimate</th>
                </>
              ) : null}
              {JSON.parse(authData).role === "admin" ||
              JSON.parse(authData).role === "Team Lead" ||
              JSON.parse(authData).role === "Human Resource" ? null : (
                <th className=" text-center" style={{ width: "8%" }}>
                  Status
                </th>
              )}
              {JSON.parse(authData).role === "admin" ||
              JSON.parse(authData).role === "Team Lead" ||
              JSON.parse(authData).role === "Human Resource" ? (
                <th className="wid-5 text-center">Modify</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {empdeatils.length > 0 ? (
              empdeatils.map((item, index) => (
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
                  <td className="text-start lh-sm pb-0 pt-3">
                    {typeof item.project === "string"
                      ? parse(item.project)
                      : null}
                  </td>
                  {/* <td className="text-start">{item.task}</td> */}
                  {JSON.parse(authData).role === "admin" ||
                  JSON.parse(authData).role === "Team Lead" ||
                  JSON.parse(authData).role === "Human Resource" ? (
                    <>
                      {/* <td className="text-center">
                          {moment(item.date).format("DD-MM-YYYY")}
                        </td> */}
                      <td className="text-center">{item.time}</td>
                    </>
                  ) : null}

                  {JSON.parse(authData).role === "admin" ||
                  JSON.parse(authData).role === "Team Lead" ||
                  JSON.parse(authData).role === "Human Resource" ? null : (
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
                  {JSON.parse(authData).role === "admin" ||
                  JSON.parse(authData).role === "Team Lead" ||
                  JSON.parse(authData).role === "Human Resource" ? (
                    <td className="modifysec text-center">
                      <Link
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#reassignTaskModal"
                        onClick={(e) => {
                          e.preventDefault();
                          getUpdate(item._id);
                        }}
                        onMouseEnter={(e) => {
                          e.preventDefault();
                          setShowReassignTaskModal(true);
                          setReassign("");
                        }}
                      >
                        <i className="bi bi-bootstrap-reboot pe-3"></i>
                      </Link>
                      {showReassignTaskModal && (
                        <div
                          class="modal fade"
                          id="reassignTaskModal"
                          tabindex="-1"
                          aria-labelledby="reassignTaskModalLabel"
                          aria-hidden="true"
                        >
                          <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                              <div class="modal-header">
                                <h5
                                  class="modal-title"
                                  id="reassignTaskModalLabel"
                                >
                                  Reassign Task
                                </h5>
                                <button
                                  ref={closeButtonRef15}
                                  type="button"
                                  class="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                ></button>
                              </div>
                              <div class="modal-body">
                                <form className="text-start">
                                  <div className="wid-100">
                                    <label
                                      htmlFor="employeename"
                                      className="form-label"
                                    >
                                      Employee Name
                                    </label>
                                    <select
                                      className="form-select"
                                      aria-label="Default select example"
                                      id="employeename"
                                      value={reassign}
                                      onChange={(e) =>
                                        setReassign(e.target.value)
                                      }
                                    >
                                      <option value="">Choose Employee</option>
                                      {reassignListName.length > 0
                                        ? reassignListName
                                            .filter(
                                              (item) =>
                                                item.role !== "admin" &&
                                                item.role !== "Human Resource"
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
                                </form>
                              </div>
                              <div className="modal-footer">
                                <button
                                  className="btn wid-100"
                                  type="button"
                                  onClick={() => reassignCollectData(taskId)}
                                  disabled={loading}
                                >
                                  {loading ? (
                                    <ClipLoader
                                      size={18}
                                      color={"#ffffff"}
                                      loading={loading}
                                    />
                                  ) : (
                                    "Update"
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <Link
                        onClick={(e) => {
                          e.preventDefault();
                          getUpdate(item._id);
                        }}
                        onMouseEnter={(e) => {
                          e.preventDefault();
                          setShowUpdateTaskModal(true);
                        }}
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#updateTaskModal"
                      >
                        <i
                          className="bi bi-pencil-square pe-2"
                          // onClick={() => handleUpdateTaskClick(item._id)}
                          style={{ cursor: "pointer" }}
                        ></i>
                      </Link>

                      {showUpdateTaskModal && (
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
                                  ref={closeButtonRef7}
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

                                  <div className="d-flex justify-content-between pt-3">
                                    <div className="wid-100 me-2">
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
                                        <option value="On Going">
                                          On Going
                                        </option>
                                      </select>
                                    </div>

                                    <div className="wid-100">
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
                                          ? listproject.map((item, index) => (
                                              <option
                                                key={item._id}
                                                value={item.project}
                                              >
                                                {parse(item.project)}
                                              </option>
                                            ))
                                          : null}
                                      </select>
                                    </div>
                                  </div>
                                </form>
                              </div>
                              <div className="modal-footer">
                                <button
                                  className="btn wid-100"
                                  type="button"
                                  onClick={() => updateCollectData(taskId)}
                                  disabled={loading}
                                >
                                  {loading ? (
                                    <ClipLoader
                                      size={18}
                                      color={"#ffffff"}
                                      loading={loading}
                                    />
                                  ) : (
                                    "Update"
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <Link onClick={() => deletetask(item._id)}>
                        <i className="bi bi-trash3-fill"></i>
                      </Link>
                    </td>
                  ) : null}
                </tr>
              ))
            ) : (
              <h4
                className="text-center mb-0"
                style={{ marginLeft: "50%", color: "rgba(0, 137, 123, 0.3)" }}
              >
                No Record
              </h4>
            )}
          </tbody>
        </table>

        <div>
          <button
            className="btn btn-primary messagebtn"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
            aria-controls="offcanvasRight"
            onClick={start}
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
                      onClick={stop}
                    ></button>
                  </div>
                ))
              : null}

            <div className="offcanvas-body" ref={chatBodyRef}>
              {/* <scrollToBottom> */}
              {messages.length > 0 ? (
                messages.map((item, index) => (
                  <div
                    className="getmessage"
                    style={{
                      textAlign: item.role === "admin" ? "left" : "left",
                      backgroundColor:
                        item.role === "admin"
                          ? "rgba(9, 185, 129, 0.4)"
                          : "rgba(0, 137, 123, 0.4)",
                      alignSelf: item.role === "admin" ? "start" : "end",
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
                      <h6>{}</h6>
                    </div>
                  </div>
                ))
              ) : (
                <h4
                  className="text-center mb-0"
                  style={{ marginLeft: "2%", color: "rgba(0, 137, 123, 0.3)" }}
                >
                  No Message
                </h4>
              )}
              {/* </scrollToBottom> */}
            </div>

            <div className="offcanvas-footer">
              <form>
                <input
                  ref={inputRef}
                  onKeyPress={handleKeyPress}
                  type="text"
                  placeholder="Message here"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  // style={{width:"85%"}}
                  // onKeyPress={handleKeyPress}
                />
                <button
                  id="messageButton"
                  // ref={buttonRef}
                  className=""
                  type="button"
                  onClick={addMessages}
                  // style={{width:"15%"}}
                >
                  <i className="bi bi-send"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* ):<PageNotFound />} */}
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
      />
    </>
  );
}
