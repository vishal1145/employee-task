import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';

export default function Updatetask() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileimage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    getUpdate();
  }, []);

  const getUpdate = async () => {
    setLoading(true); // Set loading to true when data submission starts
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
      setProfileImage(result.profileimage);
    } catch (error) {
      console.error("Error fetching update:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  const collectData = async () => {
    setLoading(true); // Set loading to true when data submission starts
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/updateprofile/${params.id}`,
        {
          method: "put",
          body: JSON.stringify({ name, email, password, profileimage }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      result = await result.json();
      if (result) {
        toast("Profile updated successfully");
      }
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false); // Set loading to false after data submission
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
      <div className="addform">
        <h3 className="mb-2">Update Task</h3>
        {loading ? ( // Display loader if loading state is true
          <div className="loader-container">
            <ClipLoader size={35} color={"#36D7B7"} loading={loading} />
          </div>
        ) : (
          <form className=" " style={{ width: "60%" }}>
            <div className="d-flex justify-content-between">
              <div className="col-lg-7">
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
                />
              </div>

              <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                <div className="profileimg">
                  <div className="profileimgbox">
                    {profileimage == "" || profileimage == null ? (
                      <img className="profimage" src={"/empimg.jpg"} alt="Photo" />
                    ) : (
                      <img className="profimage" src={profileimage} alt="Photo" />
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

            <button
              className="btn mt-3"
              type="button"
              onClick={collectData}
            >
              Submit
            </button>
          </form>
        )}
      </div>
      <ToastContainer />
    </>
  );
}
