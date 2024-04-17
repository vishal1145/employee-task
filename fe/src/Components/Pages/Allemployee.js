import React, { useEffect, useState, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2"; // Import SweetAlert

export default function Allemployee() {
  const [listname, setListname] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  // const [newpassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [updatePassword, setUpdatePassword] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [originalList, setOriginalList] = useState([]);

  const closeButtonRef = useRef();

  useEffect(() => {
    getListname();
  }, []);

  const getListname = async () => {
    try {
      let result = await fetch(`${process.env.REACT_APP_API_KEY}/listname`);
      result = await result.json();
      result.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
      setOriginalList(result);
      setListname(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }};
  

  const deleteemp = async (id) => {
    // Use SweetAlert to confirm deletion
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
          `${process.env.REACT_APP_API_KEY}/deleteemp/${id}`,
          {
            method: "Delete",
            headers: {
              // authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            },
          }
        );
        result = await result.json();
        if (result) {
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          getListname();
        }
      }
    });
  };

  const collectData = async () => {
    // setLoading(true);
    if (name === "" || null) {
      toast.info("Please fill Employee Name");
      setLoading(false);
    } else if (email === "" || null) {
      toast.info("Please fill Employee Email");
      setLoading(false);
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      toast.warning("Invalid email address");
      return;
    } else if (password === "" || null) {
      toast.info("Please fill Employee Password");
      setLoading(false);
    } else {
      try {
        let result = await fetch(`${process.env.REACT_APP_API_KEY}/addemp`, {
          method: "post",
          body: JSON.stringify({ name, email, password, role }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        // if (!result.ok) {
        //   throw new Error("Email Id is already in database");
        // }
        const data = await result.json();
        if (data) {
          toast.success("Employee added successfully");
          closeButtonRef.current.click();

          // setTimeout(() => {
          //   navigate("/allemployee");
          // }, 1000);
          getListname();
          setName("");
          setEmail("");
          setRole("");
          setPassword("");
        }
        // else {
        //   throw new Error("Email Id is already in database");
        // }
      } catch (error) {
        toast.warning("Email Id already exists");
      }
    }
  };


  const collectData2 = async () => {
    if (name === "" || !name) {
      toast.info("Please fill Employee Name");
      return;
    } else if (email === "" || !email) {
      toast.info("Please fill Employee Email");
      return;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      toast.warning("Invalid email address");
      return;
    } else if (password === "" || !password) {
      toast.info("Please fill Employee Password");
      return;
    }
  
    try {
      const result = await fetch(`${process.env.REACT_APP_API_KEY}/updateprofile/${selectedEmployeeId}`, {
        method: "PUT",
        body: JSON.stringify({ name, email, password, role }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (result.ok) {
        toast.success("Employee updated successfully");
        closeButtonRef.current.click();
        getListname();
        setName("");
        setEmail("");
        setRole("");
        setPassword("");
      } else {
        const errorMessage = await result.text();
        throw new Error(errorMessage);
      }
    } catch (error) {
      toast.error("Failed to update employee: " + error.message);
    }
  };
  
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  const [showUpdatePasswordModalEdit, setShowUpdatePasswordModalEdit] = useState(false);

  const openUpdatePasswordModal = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setShowUpdatePasswordModal(true); // Set the state to true to open the modal
  };



  // const openUpdatePasswordModalEdit = (employeeId) => {
  //   setSelectedEmployeeId(employeeId);
  //   setShowUpdatePasswordModalEdit(true); // Set the state to true to open the modal
  // };

  const openUpdatePasswordModalEdit = async (employeeId) => {
    setSelectedEmployeeId(employeeId);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_KEY}/listnamess/${employeeId}`);
      const data = await response.json();
      // Populate modal fields with fetched data
      setName(data.name);
      setEmail(data.email);
      setRole(data.role);
      setPassword(data.password);
      setShowUpdatePasswordModalEdit(true); // Open the modal
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };
  

  const closeUpdatePasswordModalEdit = () => {
    setShowUpdatePasswordModalEdit(false); // Set the state to false to close the modal
  };

  const closeUpdatePasswordModal = () => {
    setShowUpdatePasswordModal(false); // Set the state to false to close the modal
  };

  const updateEmployeePassword = async () => {
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/addemp/${selectedEmployeeId}`,
        {
          method: "PUT",
          body: JSON.stringify({ password: updatePassword }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      result = await result.json();
      if (result) {
        toast.success("Password updated successfully");
        closeUpdatePasswordModal(); // Close the modal
        getListname(); // Refresh the list of employees
        setUpdatePassword(""); // Clear the updatePassword state
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    }
  };

  const sortByPosition = (role) => {
    let sortedList;
    if (role === "All") {
      sortedList = [...originalList].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else {
      sortedList = [...originalList].sort((a, b) =>
        a.role.localeCompare(b.role)
      );
      if (role === "Developer") {
        sortedList = sortedList.filter((item) => item.role === "Developer");
      } else if (role === "Team Lead") {
        sortedList = sortedList.filter((item) => item.role === "Team Lead");
      }
    }
    setListname(sortedList);
  };
  

  const handleSearch = (searchQuery) => {
    const filteredList = originalList.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setListname(filteredList);
  };
  
  

  return (
    <>
      <div className="allemployee flex-column">
        <div
          className="py-2 px-3 d-flex align-items-center justify-content-between bg-white wid-100"
          style={{ position: "sticky", top: "0", zIndex: "999" }}
        >
          <h4 className="mb-0">All Employee</h4>
          <div className="d-flex flex-row gap-3">
          <div>
  <input
    type="text"
    placeholder="Search by name..."
    onChange={(e) => handleSearch(e.target.value)}
    className="searchInput"

/>
</div>

          <div>
            <button
              type="button"
              className="btn me-0 ButtonText"
              data-bs-toggle="modal"
              data-bs-target="#addEmpModal"
            >
              Add Employee
            </button>
            <div
              className="modal fade"
              id="addEmpModal"
              tabIndex="-1"
              aria-labelledby="addEmpModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="addEmpModalLabel">
                      Add Employee
                    </h5>
                    <button
                      ref={closeButtonRef}
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <label htmlFor="addname" className="form-label shno">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="addname"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        required
                      />
                      <label htmlFor="addemail" className="form-label">
                        Email Id
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="addemail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                      />
                      <label htmlFor="addrole" className="form-label">
                        Role
                      </label>
                      <select
                        className="form-select"
                        id="addrole"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                      >
                        <option value="">Select Position</option>
                        <option value="Developer">Developer</option>
                        <option value="Team Lead">Team Lead</option>
                      </select>
                      <label htmlFor="addpassword" className="form-label pt-2">
                        Password
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="addpassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                      />
                      <div className="d-flex align-items-center justify-content-between">
                        <button
                          className="btn mt-3 wid-100"
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
          <div className="dropdown">
  <button
    className="btn me-0 dropdown-toggle ButtonText"
    type="button"
    id="dropdownMenuButton"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    Sort by Position
  </button>
  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
  <li><button className="dropdown-item" onClick={() => sortByPosition("All")}>All</button></li> 
    <li><button className="dropdown-item" onClick={() => sortByPosition("Developer")}>Developer</button></li>
    <li><button className="dropdown-item" onClick={() => sortByPosition("Team Lead")}>Team Lead</button></li>
    {/* <li><button className="dropdown-item" onClick={() => getListname()}>Alphabetical</button></li>  */}
  </ul>
</div>


        </div>



        </div>
        <div className="row px-5">
          {loading ? (
            <div className="loader-container2">
              <ClipLoader size={35} color={"#36D7B7"} loading={loading} />
            </div>
          ) : (
            <>
              {listname.length > 0 ? (
                listname
                  .filter((item) => item.role !== "admin")
                  .map((item, index) => (
                    <div
                      className="p-3 col-6 col-sm-6 col-md-3 col-lg-2"
                      key={index}
                    >
                      <NavLink
                        to={"/empprofile/" + item._id}
                        className="text-decoration-none"
                      >
                        <div className="card">
                          <div className="card-header justify-content-center d-flex">
                            <div className="dotmenu">
                              <div className="dropdown">
                                <button
                                  className="btn btn-secondary dropdown-toggl"
                                  type="button"
                                  id={`dropdownMenuButton${index}`}
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="bi bi-three-dots-vertical"></i>
                                </button>
                                <ul
                                  className="dropdown-menu p-0"
                                  aria-labelledby={`dropdownMenuButton${index}`}
                                >
                                  <li>
                                    <Link
                                      className="dropdown-item p-1 px-3 py-2"
                                      onClick={() => deleteemp(item._id)}
                                    >
                                      Delete
                                    </Link>
                                  </li>

                                  <li>
                                    <Link
                                      to="#" // Add this to prevent navigation
                                      onClick={(e) => {
                                        e.preventDefault(); // Prevent default behavior
                                        openUpdatePasswordModal(item._id);
                                      }}
                                      className="dropdown-item p-1"
                                    >
                                      <button
                                        to="#" // Add this to prevent navigation
                                        onClick={(e) => {
                                          e.preventDefault(); // Prevent default behavior
                                          openUpdatePasswordModal(item._id);
                                        }}
                                        className="dropdown-item p-1"
                                        data-bs-toggle="modal" // Add this attribute to trigger modal opening
                                        data-bs-target="#updatePasswordModal" // Correct the target to match the modal's id
                                      >
                                        Update Password
                                      </button>
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      to="#" // Add this to prevent navigation
                                      onClick={(e) => {
                                        e.preventDefault(); // Prevent default behavior
                                        openUpdatePasswordModalEdit(item._id);
                                      }}
                                      className="dropdown-item p-1"
                                    >
                                      <button
                                        to="#" // Add this to prevent navigation
                                        onClick={(e) => {
                                          e.preventDefault(); // Prevent default behavior
                                          openUpdatePasswordModalEdit(item._id);
                                        }}
                                        className="dropdown-item p-1"
                                        data-bs-toggle="modal" // Add this attribute to trigger modal opening
                                        data-bs-target="#updateEmpModal" // Correct the target to match the modal's id
                                      >
                                       Edit Employee
                                      </button>
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                              <Link></Link>
                            </div>
                            <div className="emppic">
                              {item.profileimage === "" ||
                              item.profileimage == null ? (
                                <img
                                  src={"/empimg.jpg"}
                                  alt=""
                                  style={{ width: "100%" }}
                                />
                              ) : (
                                <img
                                  src={item.profileimage}
                                  alt=""
                                  style={{ width: "100%" }}
                                />
                              )}
                            </div>
                          </div>
                          <div className="card-body text-center pb-0">
                            <h6>{item.name}</h6>
                            <h6>{item.role}</h6>
                          </div>
                        </div>
                      </NavLink>
                    </div>
                  ))
              ) : (
                <h6>Record not found..</h6>
              )}
            </>
          )}
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
      />
      {showUpdatePasswordModal && (
        <div
          className="modal fade"
          id="updatePasswordModal"
          tabIndex="-1"
          aria-labelledby="updatePasswordModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="updatePasswordModalLabel">
                  Update Password
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    setSelectedEmployeeId(null);
                    setUpdatePassword("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <label htmlFor="updatePassword" className="form-label">
                  New Password
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="updatePassword"
                  value={updatePassword}
                  onChange={(e) => setUpdatePassword(e.target.value)}
                  placeholder="Enter New Password"
                  required
                />
              </div>
              <div className="modal-footer">
                {/* <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedEmployeeId(null);
                    setUpdatePassword("");
                  }}
                >
                  Close
                </button> */}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={updateEmployeePassword}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        {showUpdatePasswordModalEdit && (
      <div
      className="modal fade"
      id="updateEmpModal"
      tabIndex="-1"
      aria-labelledby="updateEmpModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="updateEmpModalLabel">
              Update Employee
            </h5>
            <button
              ref={closeButtonRef}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <label htmlFor="addname" className="form-label shno">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="addname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
              />
              <label htmlFor="addemail" className="form-label">
                Email Id
              </label>
              <input
                type="email"
                className="form-control"
                id="addemail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <label htmlFor="addrole" className="form-label">
                Role
              </label>
              <select
                className="form-select"
                id="addrole"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select Position</option>
                <option value="Developer">Developer</option>
                <option value="Team Lead">Team Lead</option>
              </select>
              <label htmlFor="addpassword" className="form-label pt-2">
                Password
              </label>
              <input
                type="text"
                className="form-control"
                id="addpassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <div className="d-flex align-items-center justify-content-between">
                <button
                  className="btn mt-3 wid-100"
                  type="button"
                  onClick={collectData2}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
      )}
    </>
  );
}
