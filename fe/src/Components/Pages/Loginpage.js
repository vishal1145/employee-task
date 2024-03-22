import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Loginpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  

  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  }, []);
  const handlelogin = async () => {
    // console.log(email, password)
    let result = await fetch(`${process.env.REACT_APP_API_KEY}/login`, {
      method: "post",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
  
    if (result.auth) {
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", JSON.stringify(result.auth));

      var authData = localStorage.getItem("user");

      if(JSON.parse(authData).role === "admin"){
        navigate("/");
      }else{
        navigate("/" + JSON.parse(authData)._id);
      }
      // { JSON.parse(authData).role === "admin" ? (
      //   navigate("/");
      // )
      // :(navigate("/" + JSON.parse(authData)._id));
      // }
    } else {
      alert("please enter correct details.");
    }
  };

  return (
    <>
      <div className="container-xl">
        <div className="loginpage row" style={{ marginTop: "7%" }}>
          <div className="col-12 col-sm-12 col-md-4 col-lg-4">
            <div className="card" style={{ marginLeft: "15%" }}>
              <div className="card-header ">
                <div className="login-logo mx-auto">
                  <img src="/algofolks-logo.png" alt="Logo" />
                </div>
              </div>
              <div className="card-body text-center">
                <h3 className="my-3">Log in</h3>
              </div>
            </div>
            <form className="pt-4" style={{ marginLeft: "10%" }}>
              <label for="addemail" class="form-label">
                Email Id
              </label>
              <input
                type="text"
                class="form-control"
                id="addemail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Id"
                required
              />

              <label for="addpassword" class="form-label">
                Password
              </label>
              <input
                type="password"
                class="form-control"
                id="addpassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <div className="resetpass text-end py-2">
                <Link className="text-decoration-none">Reset Password</Link>
              </div>
              {/* <div className="wid-100"> */}
              <button className="btn mt-2" type="button" onClick={handlelogin}>
                Login
              </button>
              {/* </div> */}
            </form>
          </div>
          {/* </div> */}

          <div
            className="col-12 col-sm-12 col-md-8 col-lg-8"
            style={{ position: "relative" }}
          >
            <img
              src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/6b8a0699093857.5eeafdd995e46.gif"
              alt="GIF"
              style={{
                width: "100%",
                position: "absolute",
                top: "10%",
                right: "-7%",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
