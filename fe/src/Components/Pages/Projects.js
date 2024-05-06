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
  //   const [listname, setListname] = useState([]);
  const [project, setProject] = useState("");
  //   const [name, setName] = useState("");
  // const [assign, setAssign] = useState("");
  //   const [time, setTime] = useState("1 hour");
  const [allprojects, setAllProjects] = useState([]);
  const [projectId, setProjectId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnloading, setBtnLoading] = useState(false);
  // const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  var authData = JSON.parse(localStorage.getItem("user"));

  const closeButtonRef8 = useRef();
  const closeButtonRef9 = useRef();
  const editor = useRef(null);

  useEffect(() => {
    // getListname();
    getUpdate();
    getAllProjects();
  }, []);

  const idnull = () => {
    setProject("");
  };

  const collectData = async () => {
    setBtnLoading(true);
    if (project === "" || null) {
      toast.info("Please fill the project Name");
      setBtnLoading(false);
    } else {
      // setBtnLoading(true);
      try {
        let result2 = await fetch(
          `${process.env.REACT_APP_API_KEY}/addprojects`,
          {
            method: "post",
            body: JSON.stringify({
              project,
              //   assign: "Not Assign",
              // empid,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        result2 = await result2.json();
        if (result2) {
          toast.success("Project added successfully");
          // closeButtonRef8.current.click();
          setProject("");
          // setAssign("Not Assign");
          getAllProjects();
        }
      } catch (error) {
        toast.error("Failed to add project");
      } finally {
        setBtnLoading(false);
      }
    }
  };

  const [showUpdateProjectModal, setShowUpdateProjectModal] = useState(true);

  let getUpdate = async (id) => {
    setShowUpdateProjectModal(true);
    setProjectId(id);
    if (!id) return;

    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/projectsautofillss/${id}`,
      {
        method: "get",
      }
    );

    result = await result.json();
    setProject(result.project);

    // setName(result.name);
  };

  const updateProjects = async () => {
    setBtnLoading(true);
    if (project === "" || null) {
      toast.info("Please fill the project Name");
      setBtnLoading(false);
    } else {
      try {
        let result2 = await fetch(
          `${process.env.REACT_APP_API_KEY}/updateprojects/${projectId}`,
          {
            method: "PUT",
            body: JSON.stringify({
              project,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        result2 = await result2.json();

        if (result2) {
          toast.success("Project updated successfully");
          // closeButtonRef9.current.click();
          setShowUpdateProjectModal(false);
          getAllProjects(); // Refresh task list
          setProject("");
          // setTimeout(() => {
          //   window.location.reload();
          // }, 1000);
        }
      } catch (error) {
        toast.error("Failed to update Project");
      } finally {
        setBtnLoading(false);
      }
    }
  };

  //   const getListname = async () => {
  //     let result = await fetch(`${process.env.REACT_APP_API_KEY}/listnamess`, {
  //       method: "get",
  //     });
  //     result = await result.json();

  //     // Sort the list alphabetically

  //     result.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

  //     setListname(result);
  //   };

  const getAllProjects = async () => {
    // setLoading(true);
    try {
      let result = await fetch(`${process.env.REACT_APP_API_KEY}/allprojects`, {
        method: "get",
      });
      result = await result.json();

      setAllProjects(result);
    } catch (error) {
      toast.error("Failed Data Loading");
    } finally {
      setLoading(false);
    }
  };

  const deleteproject = async (id) => {
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
    //     getAllTaskNotId();
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
          `${process.env.REACT_APP_API_KEY}/deleteproject/${id}`,
          {
            method: "Delete",
            headers: {
              // authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            },
          }
        );
        result = await result.json();
        if (result) {
          Swal.fire("Deleted!", "Your Project has been deleted.", "success");
          getAllProjects();
        }
      }
    });
  };

  return (
    <>
      {authData.role === "admin" ||
      authData.role === "Team Lead" ||
      authData.role === "Human Resource" ? (
        <div className="allemployee">
          {/* <div className=""> */}
          <div className=" wid-100 mx-3">
            <div
              className="d-flex align-items-center justify-content-between bg-white py-2"
              style={{ position: "sticky", top: "0", zIndex: "999" }}
            >
              {/* <div className=""> */}
              <h4 className="mb-0">All Projects</h4>
              {/* </div> */}

              <div>
                <button
                  type="button"
                  className="btn me-0 ButtonText"
                  data-bs-toggle="modal"
                  data-bs-target="#addProjectModal"
                  onClick={idnull}
                >
                  Add Project
                </button>

                <div
                  class="modal fade"
                  id="addProjectModal"
                  tabindex="-1"
                  aria-labelledby="addProjectModalLabel"
                  aria-hidden="true"
                >
                  <div class="modal-dialog modal-dialog-centered modal-xl">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="addProjectModalLabel">
                          Add Project
                        </h5>
                        <button
                          ref={closeButtonRef8}
                          type="button"
                          class="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>

                      <div class="modal-body">
                        <form id="addform">
                          <label
                            htmlFor="addproject"
                            className="form-label shno"
                          >
                            Project
                          </label>
                          <JoditEditor
                            ref={editor}
                            value={project}
                            // config={config}
                            // tabIndex={1} // tabIndex of textarea
                            // onBlur={(newTask) => setTask(newTask)} // preferred to use only this option to update the content for performance reasons
                            // value={displayedTask}
                            onChange={(newProject) => setProject(newProject)}
                          />
                        </form>
                      </div>
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
                  <th className="text-start wid-60">Project</th>
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
                  {allprojects.length > 0 ? (
                    allprojects.map((item, index) => (
                      <>
                        <tr
                          key={item._id}
                          // style={{
                          //   backgroundColor:
                          //     item.status === "Pending"
                          //       ? "rgba(239, 154, 154, 0.7)"
                          //       : item.status === "Running"
                          //       ? "rgba(255, 235, 59, 0.6)"
                          //       : item.status === "Completed"
                          //       ? "rgba(0, 137, 123, 0.8)"
                          //       : "rgba(239, 154, 154, 0.7)",
                          // }}
                        >
                          <td className="text-start lh-sm pb-0 pt-3">
                            {parse(item.project)}
                            {/* <div style={{ marginBottom: "0" }}>
                            <div
                              className="remove-margin remove-marginol"
                              dangerouslySetInnerHTML={{ __html: item.project }}
                            />
                          </div> */}
                          </td>

                          {/* <td className="text-center">{item.assign}</td> */}

                          <td className="modifysec text-center">
                            <Link
                              onClick={(e) => {
                                e.preventDefault();
                                getUpdate(item._id);
                                // setShowUpdateProjectModal(true);
                              }}
                              onMouseEnter={(e) => {
                                e.preventDefault();
                                setShowUpdateProjectModal(true);
                              }}
                              // onMouseEnter={setShowUpdateProjectModal(true)}
                              // to={item._id}
                              // let taskid={item._id}
                              type="button"
                              class="pe-3 pb-0"
                              data-bs-toggle="modal"
                              data-bs-target="#updateProjectModal"
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

                            {showUpdateProjectModal && (
                              <div
                                class="modal fade"
                                id="updateProjectModal"
                                tabindex="-1"
                                aria-labelledby="updateProjectModalLabel"
                                aria-hidden="true"
                              >
                                <div class="modal-dialog modal-dialog-centered modal-xl">
                                  <div class="modal-content">
                                    <div class="modal-header">
                                      <h5
                                        class="modal-title"
                                        id="updateProjectModalLabel"
                                      >
                                        Update Task
                                      </h5>
                                      <button
                                        // ref={closeButtonRef9}
                                        type="button"
                                        class="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                      ></button>
                                    </div>

                                    <div class="modal-body text-start">
                                      <form id="updateform">
                                        <label
                                          htmlFor="updateproject"
                                          className="form-label shno"
                                        >
                                          Project
                                        </label>
                                        <JoditEditor
                                          ref={editor}
                                          // value={editingTask.task}
                                          value={project}
                                          onChange={(newProject) =>
                                            setProject(newProject)
                                          }
                                          className="m"
                                        />
                                      </form>
                                    </div>

                                    {/* <div className="d-flex align-items-center justify-content-between pt-2">
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
                                    </div> */}

                                    <div className="modal-footer" id="update">
                                      <button
                                        className="btn wid-100"
                                        type="button"
                                        onClick={updateProjects}
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
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="Delete"
                              onClick={() => deleteproject(item._id)}
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
      ) : (
        <PageNotFound />
      )}
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
      />
    </>
  );
}
