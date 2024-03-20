import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    // console.log(result);
    if (result.auth) {
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", JSON.stringify(result.auth));
      navigate("/");
    } else {
      alert("please enter correct details.");
    }
  };

  return (
    <>
      <div className="addform">
        <h3 className="mb-2">Login Page</h3>
        <form>
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

          <button
            className="btn btn-outline-primary mt-3"
            type="button"
            onClick={handlelogin}
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}
