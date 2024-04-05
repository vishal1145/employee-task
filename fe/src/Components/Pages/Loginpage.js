import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

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

  const loginwithgoogle = () => {
    window.open(
      `${process.env.REACT_APP_API_KEY}/auth/google/callback`,
      "_self"
    );
  };

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

      if (JSON.parse(authData).role === "admin") {
        navigate("/");
      } else {
        navigate("/" + JSON.parse(authData)._id);
      }
    } else {
      toast("please enter correct details.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handlelogin();
    }
  };

  const handleResetPassword = async () => {
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/forgotpassword`,
        {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      result = await result.json();
      if (result.message === "Reset password email sent") {
        toast.success("Reset password email sent successfully.");
      } else {
        toast.error("Failed to send reset password email.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Internal Server Error");
    }
  };

  return (
    <>
      <div className="loginpage">
        <div
          className="row"
          // style={{ marginTop: "7%", overflow: "hidden" }}
        >
          <div className="col-12 col-sm-12 col-md-4 col-lg-4">
            <div className="loginpagecard card">
              <div className="card-header ">
                <div className="login-logo mx-auto">
                  <img src="/algofolks-logo.png" alt="Logo" />
                </div>
              </div>
              <div className="card-body text-center">
                <h3 className="my-3">Log in</h3>
              </div>
            </div>
            <form className="loginpagecard pt-4">
              <label for="addemail" className="form-label">
                Email Id
              </label>
              <input
                type="text"
                className="form-control"
                id="addemail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Id"
                required
              />

              <label for="addpassword" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="addpassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Password"
                required
              />
              <div className="resetpass text-end py-2">
                <Link
                  className="text-decoration-none"
                  onClick={handleResetPassword}
                >
                  Reset Password
                </Link>
              </div>
              {/* <div className="wid-100"> */}
              <button className="btn mt-2" type="button" onClick={handlelogin}>
                Login
              </button>

              {/* <button
                className="btn mt-2"
                type="button"
                onClick={loginwithgoogle}
              >
                <i class="bi bi-google"></i> Sign in with Google
              </button> */}
              {/* </div> */}
            </form>
          </div>
          {/* </div> */}

          <div
            className="col-12 col-sm-12 col-md-8 col-lg-8"
            style={{ position: "relative" }}
          >
            <img
              className="loginpagesvg"
              src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/6b8a0699093857.5eeafdd995e46.gif"
              alt="GIF"
              style={{}}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
