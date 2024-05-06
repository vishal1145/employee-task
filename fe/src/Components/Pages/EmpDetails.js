import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import JoditEditor from "jodit-react";
import parse from "html-react-parser";
import Swal from "sweetalert2";
import ProgressBar from "./ProgressBar";
import PageNotFound from "./PageNotFound";
// import Empnamemenu from "./Empnamemenu";

export default function Empdetails() {
  var authData = localStorage.getItem("user");

  const [listnamemenu, setListNameMenu] = useState([]);
  const [empdeatils, setEmpdetails] = useState([]);
  const [status, setStatus] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [listname, setListname] = useState([]);
  const [task, setTask] = useState("");
  const [time, setTime] = useState("1 hour");
  // const [date, setDate] = useState("");
  const [taskId, setTaskId] = useState("");
  const [loading, setLoading] = useState(true);
  const [btnloading, setBtnLoading] = useState(false);
  const [stopInterval2, setStopInterval2] = useState("stop");
  // const [socket, setSocket] = useState(null);
  const [project, setProject] = useState("");
  const [listproject, setListProject] = useState([]);
  const [reassign, setReassign] = useState("");
  const [reassignListName, setReassignListName] = useState([]);
  const [paramsid, setParamsId] = useState("");

  const closeButtonRef6 = useRef();
  const closeButtonRef7 = useRef();
  const closeButtonRef15 = useRef();
  const params = useParams();
  // const navigate = useNavigate();
  const editor = useRef(null);
  const inputRef = useRef(null);

  // const paramsid= params.id;

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("messageButton").click();
    }
  };

  useEffect(() => {
    getListNameMenu();
    getMessages();
    getEmpdetails();
    getListname();
    getReassignListName();
    getListProject();
    getUpdate();

    // if (stopInterval2 === "run") {
    //   const interval = setInterval(getMessages, 5000);
    //   return () => clearInterval(interval);
    // }
  }, [params.id, stopInterval2]);

  const idnull = () => {
    setTask("");
    setTime("1 hour");
    setProject("");
  };

  const getListNameMenu = async () => {
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/listname-menu`
      );
      result = await result.json();

      const maxChars = 15;
      result.forEach((item) => {
        item.name =
          item.name.length > maxChars
            ? item.name.slice(0, maxChars) + ".."
            : item.name;
      });

      result.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
      if (result) {
        setListNameMenu(result);
      }
    } catch (error) {
      console.log("Error loading");
    } finally {
      setLoading(false);
    }
  };

  const searchuser = (event) => {
    let key = event.target.value.toLowerCase();
    if (key) {
      const filteredList = listnamemenu.filter((item) =>
        item.name.toLowerCase().includes(key)
      );
      setListNameMenu(filteredList);
    } else {
      getListNameMenu();
    }
  };

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
    } finally {
      setLoading(false);
    }
  };

  const collectData = async () => {
    setBtnLoading(true);
    if (task === "" || null) {
      toast.info("Please fill the task");
      setBtnLoading(false);
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
          setTaskId("");
          getEmpdetails();
          getListNameMenu();
          // closeButtonRef6.current.click();
        }
      } catch (error) {
        toast.error("Failed to add task");
      } finally {
        setBtnLoading(false);
      }
    }
  };

  const [showReassignTaskModal, setShowReassignTaskModal] = useState(true);
  const reassignCollectData = async (taskId) => {
    setBtnLoading(true);
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
        getListNameMenu();
        setShowReassignTaskModal(false);
        closeButtonRef15.current.click();
      }
    } catch {
      toast.error("Failed Reassign Data");
    } finally {
      setBtnLoading(false);
    }
  };

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
      setStatus(result.status);
    } catch (error) {
      toast.error("Error Loading");
    }
  };

  const updateCollectData = async (taskId) => {
    setBtnLoading(true);
    if (task === "" || null) {
      toast.info("Please fill the task");
      setBtnLoading(false);
    } else {
      try {
        let result = await fetch(
          `${process.env.REACT_APP_API_KEY}/updatetask/${taskId}`,
          {
            method: "put",
            body: JSON.stringify({ task, time, project, status }),
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
          setStatus("");
          getEmpdetails();
          getListNameMenu();
          setShowUpdateTaskModal(false);

          // closeButtonRef7.current.click();
          // setTimeout(() => {
          //   window.location.reload();
          // }, 1000);
        }
      } catch {
        toast.error("Failed Update Data");
      } finally {
        setBtnLoading(false);
      }
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
          getEmpdetails();
          getListNameMenu();
        }
      }
    });
  };

  // const archivetask = paramsid + "archive";

  const addarchivetask = async () => {
    // setArchiveTask(paramsid+"archive");
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/updatetask/${taskId}`,
        {
          method: "put",
          // body: JSON.stringify({ empid: archivetask, archive: "Y" }),
          body: JSON.stringify({ archive: true }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      result = await result.json();
      if (result) {
        toast.success("Task Archived successfully");
        getEmpdetails();
        getListNameMenu();
        setTaskId("");
      }
    } catch {
      toast.error("Failed Update Data");
    }
  };

  // const getStatusColorClass = (status) => {
  //   switch (status) {
  //     case "running":
  //       return "textYellow";
  //     case "pending":
  //       return "textRed";
  //     case "completed":
  //       return "textGreen";
  //     default:
  //       return "textRed";
  //   }
  // };

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
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/listprojects`,
        {
          method: "get",
        }
      );
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

  const nocheckbtn = async (id) => {
    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/addhighlight/${id}`,
      {
        method: "put",
        body: JSON.stringify({
          priority: "bi-check-circle-fill",
        }),
        headers: {
          "Content-Type": "application/json",
          // authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        },
      }
    );
    result = await result.json();
    if (result) {
      getEmpdetails();
    }
  };

  const yescheckbtn = async (id) => {
    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/addhighlight/${id}`,
      {
        method: "put",
        body: JSON.stringify({
          priority: "bi-check-circle",
        }),
        headers: {
          "Content-Type": "application/json",
          // authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        },
      }
    );
    result = await result.json();
    if (result) {
      getEmpdetails();
    }
  };

  const stop = () => {
    setStopInterval2("stop");
  };

  const start = () => {
    setStopInterval2("run");
  };

  const referesh = () => {
    setBtnLoading(true);
    try {
      getEmpdetails();
      getListNameMenu();
    } finally {
      // catch(error){
      //   toast.error("Error Loading")
      // }
      setBtnLoading(false);
    }
  };

  const chatBodyRef = useRef(null);
  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [getMessages]);

  return (
    <>
      <div
        className="menu wid-35 border-end ms-0"
        style={{ justifyContent: "start" }}
      >
        <div className=" menusearch">
          <form className="px-2 py-2">
            <input
              className="p-1 mb-0"
              type="text"
              placeholder="Search here"
              onChange={searchuser}
            />
          </form>
        </div>
        {loading ? (
          <div className="d-flex justify-content-center">
            <ClipLoader size={35} color={"#36D7B7"} loading={loading} />
          </div>
        ) : (
          <>
            {listnamemenu.length > 0 ? (
              listnamemenu
                .filter(
                  (item) =>
                    item.role !== "admin" && item.role !== "Human Resource"
                )
                .map((item, index) => (
                  <div className="pe-0 allemp" key={item._id}>
                    <NavLink
                      to={"/all-employee/" + item._id}
                      className="navlink-custom btn"
                      // onClick={loadData}
                    >
                      <div className="menudiv">
                        <div className="menuimg">
                          {item.profileimage === "" ||
                          item.profileimage == null ? (
                            <img
                              className="profimage"
                              src={"/empimg.jpg"}
                              alt=""
                            />
                          ) : (
                            <img
                              className="profimage"
                              src={item.profileimage}
                              alt=""
                            />
                          )}
                        </div>
                        <div className="menuname">
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="" style={{ fontSize: "1vw" }}>
                              {item.name}
                            </div>
                            <div
                              className=""
                              // key={}
                              style={{
                                fontSize: "0.9vw",
                                // marginLeft: "0.9vw",
                              }}
                            >
                              {item.time > 0 ? (
                                <span
                                  className=""
                                  style={{
                                    color: "blue",
                                    fontSize: "1vw",
                                    fontWeight: "bold",
                                    marginRight: "0.3vw",
                                  }}
                                >
                                  G
                                </span>
                              ) : null}
                              <span
                                className=""
                                style={{
                                  color: "white",
                                  fontSize: "0.9vw",
                                  borderRadius: "5px",
                                  backgroundColor: "green",
                                  padding: "0 0.2vw",
                                  marginRight: "0.2vw",
                                  fontWeight: "500",
                                }}
                              >
                                C: {item.completed}
                              </span>
                              <span
                                className=""
                                style={{
                                  color: "white",
                                  fontSize: "0.9vw",
                                  borderRadius: "5px",
                                  backgroundColor: "rgb(251, 192, 45)",
                                  padding: "0 0.2vw",
                                  marginRight: "0.3vw",
                                  fontWeight: "500",
                                }}
                              >
                                R: {item.running}
                              </span>
                              <span
                                className=""
                                style={{
                                  color: "white",
                                  fontSize: "0.9vw",
                                  borderRadius: "5px",
                                  backgroundColor: "rgb(239, 83, 80)",
                                  padding: "0 0.2vw",
                                  marginRight: "0.3vw",
                                  fontWeight: "500",
                                }}
                              >
                                P: {item.pending}
                              </span>
                            </div>
                          </div>
                          <div style={{}}>
                            <ProgressBar
                              totalTimes={item.totalTime * 3600000}
                              hourTime={item.totalTime}
                              empId={item._id}
                            />
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  </div>
                ))
            ) : (
              <h4
                className="text-center mb-0"
                style={{ marginLeft: "0%", color: "rgba(0, 137, 123, 0.3)" }}
              >
                No Record
              </h4>
            )}
          </>
        )}
      </div>

      <div className="empdeatils wid-75">
        <div className="headsec">
          <div className="d-flex align-items-center">
            {listname.length > 0
              ? listname.map((item, index) => (
                  <h5
                    className="mb-0 me-3 border"
                    style={{ padding: "2px 5px", borderRadius: "7px" }}
                  >
                    {item.name}
                  </h5>
                ))
              : null}
            <h5 className="mb-0 me-3">Task</h5>
            <Link
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Referesh"
              onClick={referesh}
            >
              {btnloading ? (
                <ClipLoader size={18} color={"#36D7B7"} loading={btnloading} />
              ) : (
                <i
                  className="bi bi-arrow-clockwise"
                  style={{ fontSize: "18px", color: "rgb(0, 137, 123)" }}
                ></i>
              )}
            </Link>
          </div>

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
                          <label htmlFor="timeduration" className="form-label">
                            Time Duration
                          </label>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            id="timeduration"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                          >
                            <option value="">Choose Time</option>
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
              <th className="wid-40 text-start">Task</th>
              <th className="wid-10 text-start">Project</th>
              <th className="wid-5 text-center">Estimate</th>
              <th className=" text-center" style={{ width: "2%" }}>
                P
              </th>
              <th className="wid-10 text-center">Modification</th>
            </tr>
          </thead>
          {loading ? (
            <div
              className="text-center d-flex align-items-center"
              style={{ marginLeft: "80%" }}
            >
              <ClipLoader size={30} color={"#36D7B7"} loading={loading} />
            </div>
          ) : (
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
                    {/* <td className="text-center">
                          {moment(item.date).format("DD-MM-YYYY")}
                        </td> */}
                    <td className="text-center">{item.time}</td>
                    <td className="text-center">
                      <Link
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Priority"
                        className="modifysec"
                        onClick={() => {
                          if (item.priority === "bi-check-circle") {
                            nocheckbtn(item._id);
                          } else {
                            yescheckbtn(item._id);
                          }
                        }}
                      >
                        <i className={`bi ${item.priority}`}></i>
                      </Link>
                    </td>

                    <td className="modifysec text-center">
                      <Link
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
                        <i
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Switch Task"
                          // type="button"
                          className="bi bi-bootstrap-reboot pe-2"
                        ></i>
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
                                  // disabled={loading}
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
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Update Task"
                          // type="button"
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
                                        <option value="">Choose Time</option>
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

                                    <div className="wid-100 me-2">
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

                                    <div className="wid-100">
                                      <label
                                        htmlFor="statusname"
                                        className="form-label"
                                      >
                                        Status
                                      </label>
                                      <select
                                        // type="text"
                                        className="form-select"
                                        aria-label="Default select example"
                                        id="statusname"
                                        value={status}
                                        // value={item._id}
                                        onChange={(e) =>
                                          setStatus(e.target.value)
                                        }
                                      >
                                        <option value="">Choose any one</option>
                                        <option value="Pending">Pending</option>
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
                            </div>
                          </div>
                        </div>
                      )}

                      <Link
                        className=""
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Archive"
                        // type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          addarchivetask();
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setTaskId(item._id);
                          setParamsId(item.empid);
                        }}
                      >
                        <i class="bi bi-dash-circle"></i>
                      </Link>

                      <Link
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Delete"
                        // type="button"
                        onClick={() => deletetask(item._id)}
                      >
                        <i className="bi bi-trash3-fill"></i>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <h4
                  className="text-center mb-0"
                  style={{ marginLeft: "65%", color: "rgba(0, 137, 123, 0.3)" }}
                >
                  No Record
                </h4>
              )}
            </tbody>
          )}
        </table>

        <div>
          <button
            type="button"
            className="btn btn-primary messagebtn"
            data-bs-toggle="modal"
            data-bs-target="#chatModal"
            // onClick={joinroom}
          >
            <i className="bi bi-chat-square-text-fill"></i>
          </button>

          <div
            className="modal fade"
            id="chatModal"
            tabIndex="-1"
            aria-labelledby="chatModalLabel"
            aria-hidden="true"
          >
            <div
              className="modal-dialog modal-dialog-scrollable"
              style={{
                width: "25%",
                height: "69%",
                position: "absolute",
                bottom: "-2%",
                right: "1.5%",
              }}
            >
              <div className="modal-content">
                {listname.length > 0
                  ? listname.map((item, index) => (
                      <div
                        className="modal-header p-2 pe-3"
                        key={index}
                        style={{}}
                      >
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
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          // onClick={messageclose}
                        ></button>
                      </div>
                    ))
                  : null}

                <div className="modal-body" ref={chatBodyRef}>
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
                        <div className="ps-1 pt-1 mb-2">
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
                      style={{
                        marginLeft: "2%",
                        color: "rgba(0, 137, 123, 0.3)",
                      }}
                    >
                      No Message
                    </h4>
                  )}
                  {/* {messages.length > 0 ? (
                    messages.map((item, index) => (
                      <div className="message">
                        <div style={{ fontSize: "8px" }}>{item.author}</div>
                        <div >{item.message}</div>
                        <div style={{ fontSize: "8px" }}>{item.time}</div>
                      </div>
                    ))
                  ) : (
                    <h6 style={{ marginLeft: "32%", color: "rgba(0, 137, 123)", fontSize: "20px" }}>No message</h6>
                  )} */}
                </div>

                <div className="modal-footer p-0">
                  <form className="wid-100 d-flex align-items-center">
                    <input
                      className="wid-100 p-1 mb-0 px-2"
                      style={{
                        borderRadius: "10px",
                        border: "1px solid #24b7a7",
                      }}
                      ref={inputRef}
                      onKeyPress={handleKeyPress}
                      type="text"
                      placeholder="Message here"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                    <button
                      id="messageButton"
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
        </div>

        {/* <div>
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
                      <h6>{ }</h6>
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
               
                <button
                  id="messageButton"
                  
                  className=""
                  type="button"
                  onClick={addMessages}
                
                >
                  <i className="bi bi-send"></i>
                </button>
              </form>
            </div>
          </div>
        </div> */}
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
      />
    </>
  );
}
