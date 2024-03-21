import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Updatetask() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileimage, setProfileImage] = useState("");

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    getUpdate();
  }, []);

  const getUpdate = async () => {
    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/profileautofill/${params.id}`,
      {
        method: "get",
        //   headers: {
        //     // authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        //   },
      }
    );

    result = await result.json();
    // console.log(result);
    setName(result.name);
    setEmail(result.email);
    setPassword(result.password);
    setProfileImage(result.profileimage);
  };

  const collectData = async () => {
    // const empid = JSON.parse(localStorage.getItem("user"))._id;
    // const empid=params.id;

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
      alert("Profile updated successfully");
    }
    // history.goBack();
    // navigate("/alldetails/");
    navigate(-1);
  };

  const convertToBase64 = (e) => {
    console.log(e);
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      console.log(reader.result);
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
        <form className=" " style={{ width: "60%" }}>
          <div className="d-flex justify-content-between">
            <div className="col-lg-7">
              <label for="addname" className="form-label shno">
                Name
              </label>
              <input
                type="text"
                class="form-control"
                id="addname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
              />

              <label for="addemail" class="form-label">
                Email Id
              </label>
              <input
                type="email"
                class="form-control"
                id="addemail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />

              <label for="addpassword" class="form-label">
                Password
              </label>
              <input
                type="text"
                class="form-control"
                id="addpassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>

            <div className=" col-4 col-sm-4 col-md-4 col-lg-4">
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

          {/* <div className="col-lg-12"> */}
          <button
            className="btn mt-3"
            type="button"
            onClick={collectData}
          >
            Submit
          </button>
          {/* </div> */}
        </form>
      </div>
    </>
  );
}
