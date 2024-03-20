import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Adddetails() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const collectData = async () => {
    let result = await fetch(`${process.env.REACT_APP_API_KEY}/addemp`, {
      method: "post",
      body: JSON.stringify({ name, email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
    if (result) {
      alert("Employee add successfully");
    }
    navigate(-1);
  };

  return (
    <>
      <div className="addform">
        <h3 className="mb-2">Add New Employee</h3>
        <form>
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
            type="password"
            class="form-control"
            id="addpassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          {/* <label for="status" class="form-label">
            Status
          </label>
          <select class="form-select" aria-label="Default select example" value={status} onChange={(e)=>setStatus(e.target.value)} >
            <option selected>Choose any one</option>
            <option value="Running">Running</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select> */}

          <button
            className="btn btn-outline-primary mt-3"
            type="button"
            onClick={collectData}
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
