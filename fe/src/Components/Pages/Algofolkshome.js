import React, { useState, useEffect, useRef } from "react";
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
  const [text, setText] = useState("");
  const [messages, setMessages] = useState("");
  const [listname, setListname] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getEmpdetails();
    getMessages();
    getListname();
  }, [params.id, dataUploaded]);

  function htmlToText(html) {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText || "";
  }

  const getEmpdetails = async () => {
    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/empdetails/${params.id}`,
      {
        method: "get",
      }
    );

    result = await result.json();
    // let textContent = htmlToText(result);
    setEmpdetails(result);
  };



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
      setStatus("pending");
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
    getEmpdetails();
  };

  const addMessages = async () => {
    // const empid = JSON.parse(localStorage.getItem('user'))._id;
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
    setText("");
    getMessages();
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
              <th className="wid-10 text-center">Status</th>

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
                  <td className="text-start">{htmlToText(item.task)}</td>
                  <td className="text-center">{item.date}</td>
                  <td className="text-center">{item.time}</td>
                  <td className="text-center" key={item._id}>
                    <NavLink

                      className="text-decoration-none"
                    onClick={() => addstatus(item._id)}
                    >
                      <select
                        className={`form-select choosestatus ${getStatusColorClass(
                          item.status
                        )}`}
                        // aria-label="Default select example"
                        value={item.status||status}
                        onChange={(e) => setStatus(e.target.value)}
                        // onClick={() => addstatus(item._id)}

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

        <div>
          <button
            className="btn btn-primary messagebtn"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
            aria-controls="offcanvasRight"
          >
            Message
          </button>

          <div
            className="offcanvas"
            tabindex="-1"
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
                      textAlign:
                        item.name === "Admin" ? "left" : "left",
                      backgroundColor:
                        item.name === "Rishi Ranjan"
                          ? "rgba(9, 185, 129, 0.4)"
                          : "rgba(0, 137, 123, 0.4)",
                      alignSelf:
                        item.name === "Admin" ? "start" : "end",
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
                          <div class="dropdown">
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
                                  {/* <i class="bi bi-trash3-fill"></i> */}
                                  Delete
                                </Link>
                              </li>
                              {/* <li> */}
                              {/* <Link className="p-1 dropdown-item" onClick={() => { if (item.role === 'user') { addadmin(item._id) } else { adduser(item._id) } }}>{item.role}</Link> */}
                              {/* </li> */}
                              {/* <li><a class="dropdown-item" href="#">Another action</a></li> */}
                              {/* <li><a class="dropdown-item" href="#">Something else here</a></li> */}
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
