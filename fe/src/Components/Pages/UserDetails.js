import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import parse from "html-react-parser";
import PageNotFound from "./PageNotFound";

export default function Empdetails() {
  const authData = localStorage.getItem("user");
  const userId= JSON.parse(authData)._id;

  const [empdetails, setEmpdetails] = useState([]);
  const [status, setStatus] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [listname, setListname] = useState([]);
  const [taskId, setTaskId] = useState("");
  const [loading, setLoading] = useState(false);
  const [btnloading, setBtnLoading] = useState(false);
  const [stopInterval2, setStopInterval2] = React.useState("stop");
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(true);

  const params = useParams();
  const inputRef = useRef(null);
  const closeButtonRef = useRef();

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
    getUpdate();

    // if (stopInterval2 === "run") {
    //   const interval = setInterval(getMessages, 5000);
    //   return () => clearInterval(interval);
    // }
  }, [userId]);

  // const idnull = () => {
  //   setTask("");
  //   setTime("1 hour");
  //   setProject("");
  // };

  const getEmpdetails = async () => {
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/empdetails/${userId}`,
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

  const addstatus = async () => {
    setBtnLoading(true);
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/addstatus/${taskId}`,
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
        setStatus("");
        closeButtonRef.current.click();
        setShowUpdateStatusModal(false);
      }
    } catch (error) {
      toast.error("Error Loading");
    } finally {
      setBtnLoading(false);
    }
  };

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
      setStatus(result.status);
    } catch (error) {
      toast.error("Error Loading");
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
    const empid = userId;

    try {
      let result = await fetch(`${process.env.REACT_APP_API_KEY}/addmessages`, {
        method: "post",
        body: JSON.stringify({
          empid,
          name,
          text,
          role,
          sender: "sender",
          msgStatus: "Pending",
        }),
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
        `${process.env.REACT_APP_API_KEY}/getmessages/${userId}`,
        {
          method: "get",
        }
      );
      result = await result.json();
      if (result) {
        setMessages(result);
        // setStopInterval("run");

        const newUnreadCount = result.filter(
          (message) => message.msgStatus === "Pending" && !message.seen
        ).length;
        setUnreadCount(newUnreadCount);
      }
    } catch (error) {
      toast.error("Error Loading");
    }
  };

  const getListname = async () => {
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/messagebodyname/${userId}`
      );

      result = await result.json();

      setListname(result);
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

  // const stop = () => {
  //   setStopInterval2("stop");
  // };

  // const start = () => {
  //   setStopInterval2("run");
  // };

  const referesh = () => {
    setBtnLoading(true);
    try {
      getEmpdetails();
      getMessages();
    } finally {
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
      <div className="empdetails wid-100">
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
        </div>

        <table className="wid-100">
          <thead>
            <tr>
              <th className="wid-60 text-start">Task</th>
              <th className="wid-10 text-start">Project</th>
              {/* <th className="wid-5 text-center">Estimate</th> */}
              <th className=" text-center wid-10">Status</th>
              <th className=" text-center" style={{ width: "2%" }}>
                P
              </th>
            </tr>
          </thead>
          {loading ? (
            <div className="loader-container">
              <ClipLoader size={35} color={"#36D7B7"} loading={loading} />
            </div>
          ) : (
            <tbody>
              {empdetails.length > 0 ? (
                empdetails.map((item, index) => (
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
                    {/* <td className="text-center">{item.time}</td> */}
                    <td className="text-center" key={item._id}>
                      <button
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#updateStatusModal"
                        className="wid-100"
                        style={{
                          overflow: "hidden",
                          backgroundColor:
                            item.status === "Pending"
                              ? "rgba(239, 154, 154, 0.7)"
                              : item.status === "Running"
                              ? "rgba(255, 235, 59, 0.6)"
                              : item.status === "Completed"
                              ? "rgba(0, 137, 123, 0.8)"
                              : "rgba(239, 154, 154, 0.7)",
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          getUpdate(item._id);
                          setShowUpdateStatusModal(true);
                        }}
                      >
                        {item.status}
                      </button>
                      {showUpdateStatusModal && (
                        <div
                          className="modal fade"
                          id="updateStatusModal"
                          tabindex="-1"
                          aria-labelledby="updateStatusModalLabel"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5
                                  className="modal-title"
                                  id="updateStatusModalLabel"
                                >
                                  Choose Status
                                </h5>
                                <button
                                  type="button"
                                  ref={closeButtonRef}
                                  className="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                ></button>
                              </div>
                              <div className="modal-body">
                                <form className="text-start">
                                  <label
                                    htmlFor="status"
                                    className="form-label"
                                  >
                                    Status
                                  </label>
                                  <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    id="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                  >
                                    <option value="" disabled className="">
                                      Choose Status
                                    </option>
                                    <option
                                      value="Pending"
                                      // style={{ color: "red" }}
                                    >
                                      Pending
                                    </option>
                                    <option
                                      value="Running"
                                      // style={{ color: "rgba(255, 235, 59, 0.6)" }}
                                    >
                                      Running
                                    </option>
                                    <option
                                      value="Completed"
                                      // style={{ color: "green" }}
                                    >
                                      Completed
                                    </option>
                                  </select>
                                </form>
                              </div>
                              <div className="modal-footer">
                                <div className="d-flex wid-100">
                                  <button
                                    type="button"
                                    className="btn wid-100"
                                    data-bs-dismiss="modal"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      addstatus();
                                    }}
                                    className="btn wid-100"
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
                        </div>
                      )}
                    </td>

                    <td className="text-center">
                      <div className="">
                        <i className={`bi ${item.priority}`}></i>
                      </div>
                    </td>
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
            {unreadCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger position-absolute top-0 ">
                {unreadCount}
              </span>
            )}
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
