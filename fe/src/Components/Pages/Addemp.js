import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';

export default function Adddetails() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();

  const collectData = async () => {
    setLoading(true); 
    try {
      let result = await fetch(`${process.env.REACT_APP_API_KEY}/addemp`, {
        method: "post",
        body: JSON.stringify({ name, email, password,role }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!result.ok) {
        throw new Error('Email Id is already in database');
      }
      const data = await result.json();
      
      if (data) {
        toast.success("Employee added successfully");

        setTimeout(() => {
          navigate(-1);
        }, 2000);
      } else {
        throw new Error('Email Id is already in database');
      }
    } catch (error) {
      toast.error("Email Id is already in database");
    } finally {
      setLoading(false); // Set loading to false after data submission completes
    }
  };

  return (
    <>
      <div className="addform">
        <h3 className="mb-2">Add New Employee</h3>
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
          />

          <label htmlFor="addpassword" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="addpassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
           <label htmlFor="role" className="form-label">
      Role
    </label>
    <select
      className="form-select"
      id="role"
      value={role}
      onChange={(e) => setRole(e.target.value)}
    >
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>

          <button
            className="btn mt-3"
            type="button"
            onClick={collectData}
            disabled={loading} // Disable button when loading is true
          >
            {loading ? (
              <ClipLoader size={20} color={"#ffffff"} loading={loading} />
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
