import React, { useEffect, useState, useRef } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";

export default function Empprofile() {
  const emprole = JSON.parse(localStorage.getItem("user")).role;

  const [loading, setLoading] = useState(true);
  const [btnloading, setBtnLoading] = useState(false);
  const [empprofile, setEmpprofile] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [position, setPosition] = useState("");
  const [doj, setDoj] = useState("");
  const [location, setLocation] = useState("");
  const [profileimage, setProfileImage] = useState("");

  useEffect(() => {
    getEmpprofile();
    getUpdate();
  }, []);
  const closeButtonRef = useRef();
  const navigate = useNavigate();
  const params = useParams();

  const getEmpprofile = async () => {
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/empprofile/${params.id}`
      );

      result = await result.json();
      setEmpprofile(result);
    } catch (error) {
      toast.error("Error Loading.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUpdate = async () => {
    // setLoading(true); // Set loading to true when data submission starts
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/profileautofill/${params.id}`,
        {
          method: "get",
        }
      );
      result = await result.json();
      setName(result.name);
      setEmail(result.email);
      setPassword(result.password);
      setMobile(result.mobile);
      setDob(result.dob);
      setPosition(result.position);
      setDoj(result.dateOfJoining);
      setLocation(result.location);
      setProfileImage(result.profileimage);

    } catch (error) {
      console.error("Error fetching update:", error);
    }
    finally {
      setLoading(false);
    }
  };

  const collectData = async () => {
    setBtnLoading(true); 
    if (name === "" || null) {
      toast.info("Please fill Employee Name");
      setBtnLoading(false);
    } else if (password === "" || null) {
      toast.info("Please fill Employee Password");
      setBtnLoading(false);
    } else {
      try {
        let result = await fetch(
          `${process.env.REACT_APP_API_KEY}/updateprofile/${params.id}`,
          {
            method: "put",
            body: JSON.stringify({
              name,
              email,
              password,
              mobile,
              dob,
              position,
              dateOfJoining: doj,
              location,
              profileimage,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        result = await result.json();
        if (result) {
          toast.success("Profile updated successfully");
          getEmpprofile();
          closeButtonRef.current.click();
        }
        // setTimeout(() => {
        //   navigate(-1);
        // }, 1000);
      } catch (error) {
        console.log("Error updating profile:", error);
        toast.error("Failed Update Employee Details");
      }
      finally {
        setBtnLoading(false);
      }
    }
  };

  const convertToBase64 = (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setProfileImage(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  };

  return (
    <>
      {loading ? (
        <div className="loader-container">
          <ClipLoader size={35} color={"#36D7B7"} loading={loading} />
        </div>
      ) : (
        <div className="empprofile">
          <div className="container-xl">
            {empprofile.length > 0
              ? empprofile.map((item, index) => (
                  <div className="row mx-auto justify-content-center">
                    <div className="p-3 col-12 col-sm-5 col-md-5 col-lg-5">
                      <div className="card emppropic">
                        {item.profileimage === "" ||
                        item.profileimage == null ? (
                          <img
                            className="profimage"
                            src={"/empimg.jpg"}
                            alt=""
                          />
                        ) : (
                          <img
                            style={{ objectFit: "cover" }}
                            className="profimage"
                            src={item.profileimage}
                            alt=""
                          />
                        )}
                      </div>
                    </div>

                    <div className="p-3 col-12 col-sm-6 col-md-6 col-lg-6">
                      <div className="card border-0">
                        <h1 className="display-5" style={{ fontWeight: "500" }}>
                          {item.name}
                        </h1>
                        <h4 style={{ color: "green" }}>{item.position}</h4>
                        <h6 style={{ color: "#616161" }}>
                          There is no pill to convert yourself as a good
                          programmer, it takes lots of reading, learning and
                          practice. So start now.
                        </h6>
                        <div className="mt-4" style={{ color: "#9575CD" }}>
                          <h5>
                            <i class="bi bi-cake2-fill"></i>
                            <span className="ms-3">{item.dob}</span>
                          </h5>
                          <h5>
                            <i class="bi bi-telephone-fill"></i>
                            <span className="ms-3">{item.mobile}</span>
                          </h5>
                          <h5>
                            <i class="bi bi-envelope-fill"></i>
                            <span className="ms-3">{item.email}</span>
                          </h5>
                          <h5>
                            <i class="bi bi-calendar-check-fill"></i>
                            <span className="ms-3">{item.dateOfJoining}</span>
                          </h5>
                          <h5>
                            <i class="bi bi-person-circle"></i>
                            <span className="ms-3">{item.role}</span>
                          </h5>
                          <h5>
                            <i class="bi bi-geo-alt-fill"></i>
                            <span className="ms-3">{item.location}</span>
                          </h5>
                        </div>
                        {/* <pre style={{ overflow: "hidden" }}>
                        <h4>Name                  : {item.name}</h4>
                        <h4>Email                   : {item.email}</h4>
                        <h4>Mobile No          : {item.mobile}</h4>
                        <h4>Date of birth     : {item.dob}</h4>
                        <h4>Position              : {item.position}</h4>
                        <h4>Date of joining  : {item.joining}</h4>
                      </pre> */}
                        {/* <h4>Completed Project : </h4>
                      <h4>Running Project : </h4>
                      <h4>Pending Project : </h4> */}

                        <div className="mt-4">
                          <button
                            // to={"/updateprofile/" + item._id}
                            type="button"
                            className="btn"
                            data-bs-toggle="modal"
                            data-bs-target="#updateProfileModal"
                          >
                            Update Profile
                          </button>
                        </div>

                        {/* <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Launch demo modal
                      </button> */}

                        <div
                          className="modal fade"
                          id="updateProfileModal"
                          tabindex="-1"
                          aria-labelledby="updateProfileModalLabel"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog modal-dialog-centered modal-xl">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5
                                  className="modal-title"
                                  id="updateProfileModalLabel"
                                >
                                  Update Profile
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
                                <form className=" " style={{ width: "95%" }}>
                                  <div className="d-flex justify-content-between">
                                    <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                                      <label
                                        htmlFor="addname"
                                        className="form-label shno"
                                      >
                                        Name
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="addname"
                                        value={name}
                                        onChange={(e) =>
                                          setName(e.target.value)
                                        }
                                        placeholder="Name"
                                        required
                                      />

                                      <label
                                        htmlFor="addemail"
                                        className="form-label"
                                      >
                                        Email Id
                                      </label>
                                      <input
                                        type="email"
                                        className="form-control"
                                        id="addemail"
                                        value={email}
                                        // onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email"
                                        disabled
                                      />

                                      <label
                                        htmlFor="addpassword"
                                        className="form-label"
                                      >
                                        Password
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="addpassword"
                                        value={password}
                                        onChange={(e) =>
                                          setPassword(e.target.value)
                                        }
                                        placeholder="Password"
                                        required
                                      />

                                      <label for="addmobile" class="form-label">
                                        Mobile No
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="addmobile"
                                        value={mobile}
                                        onChange={(e) =>
                                          setMobile(e.target.value)
                                        }
                                        placeholder="Mobile No"
                                      />
                                    </div>

                                    <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                                      <label
                                        for="adddob"
                                        className="form-label"
                                      >
                                        Date of birth
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="adddob"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                        placeholder="DD/MM/YYYY"
                                      />

                                      <label
                                        for="addposition"
                                        className="form-label"
                                      >
                                        Technology
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="addposition"
                                        value={position}
                                        onChange={(e) =>
                                          setPosition(e.target.value)
                                        }
                                        placeholder="Technology"
                                      />

                                      <label for="adddoj" class="form-label">
                                        Date of Joining
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="adddoj"
                                        value={doj}
                                        onChange={(e) => setDoj(e.target.value)}
                                        placeholder="DD/MM/YYYY"
                                      />

                                      <label
                                        for="addlocation"
                                        className="form-label"
                                      >
                                        Current Location
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="addlocation"
                                        value={location}
                                        onChange={(e) =>
                                          setLocation(e.target.value)
                                        }
                                        placeholder="Current Location"
                                      />
                                    </div>

                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3">
                                      <div className="profileimg">
                                        <div className="profileimgbox">
                                          {profileimage === "" ||
                                          profileimage == null ? (
                                            <img
                                              className="profimage"
                                              src={"/empimg.jpg"}
                                              alt=""
                                            />
                                          ) : (
                                            <img
                                              className="profimage"
                                              src={profileimage}
                                              alt=""
                                              style={{ objectFit: "cover" }}
                                            />
                                          )}
                                        </div>
                                        <div className="overflow-hidden">
                                          <input
                                            accept="image/*"
                                            onChange={convertToBase64}
                                            type="file"
                                            className="inputboxp"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </div>
                              <div className="modal-footer">
                                <div className="d-flex align-items-center wid-100">
                                  <button
                                    type="button"
                                    className="btn btn-secondary wid-100"
                                    data-bs-dismiss="modal"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    className="btn w-100"
                                    type="button"
                                    onClick={collectData}
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
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
      )}
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
