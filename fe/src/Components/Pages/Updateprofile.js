import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';

export default function Updateprofile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [position, setPosition] = useState("");
  const [profileimage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const params = useParams();

  var authData = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getUpdate();
  }, []);

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
      setProfileImage(result.profileimage);

    } catch (error) {
      console.error("Error fetching update:", error);
    } 
    finally {
      setLoading(false); 
    }
  };

  const collectData = async () => {
    // setLoading(true); 
    if (name === "" || null) {
      toast.info("Please fill Employee Name");
    } else if (password === "" || null) {
      toast.info("Please fill Employee Password");
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
        }
        setTimeout(() => {
          navigate(-1);
        }, 1000);
      } catch (error) {
        console.log("Error updating profile:", error);
        toast.error("Failed Update Employee Details");
      }
      finally {
        setLoading(false); 
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

  const backstep = () => {
    {authData.role==="admin" || authData.role==="Team Lead" || authData.role==="Human Resource" ?
      navigate("/allemployee")
    :
    navigate("/" + authData._id)
    }
    // navigate(-1);
  }

  return (
    <>
      <div className="addform">
        <h3 className="mb-2">Update Profile</h3>
        {loading ? ( // Display loader if loading state is true
          <div className="loader-container">
            <ClipLoader size={35} color={"#36D7B7"} loading={loading} />
          </div>
        ) : (
          <form className=" " style={{ width: "75%" }}>
            <div className="d-flex justify-content-between">
              <div className="col-14 col-sm-4 col-md-4 col-lg-4">
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
                  // onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  disabled
                />

                <label htmlFor="addpassword" className="form-label">
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
              </div>

              <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                <label for="addmobile" class="form-label">
                  Mobile No
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="addmobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Mobile No"
                />

                <label for="adddob" className="form-label">
                  Date of birth
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="adddob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  placeholder="DD/MM/Year"
                />

                <label for="addposition" className="form-label">
                  Technology
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="addposition"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Technology"
                  // disabled
                />
              </div>

              <div className="col-3 col-sm-3 col-md-3 col-lg-3">
                <div className="profileimg">
                  <div className="profileimgbox">
                    {profileimage === "" || profileimage == null ? (
                      <img className="profimage" src={"/empimg.jpg"} alt="" />
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
            <div className="d-flex pt-3">
              <div className="pe-2" style={{ width: "50%" }}>
                <button className="btn w-100" type="button" onClick={backstep}>
                  Cancel
                </button>
              </div>

              <div className="" style={{ width: "50%" }}>
                <button
                  className="btn w-100"
                  type="button"
                  onClick={collectData}
                  disabled={loading}
                >
                  {loading ? (
                    <ClipLoader size={18} color={"#ffffff"} loading={loading} />
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
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
