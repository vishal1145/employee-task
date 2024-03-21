import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  var authData = localStorage.getItem("user");

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/loginpage");
  };
  return (
    <div className="header">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div>
            <NavLink className="navbar-brand" to="/">
              <img
                src="/cropelogo.png"
                alt="AlgoFolks"
                style={{ width: "80%", height: "6vh" }}
              />
            </NavLink>
          </div>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            {authData ? (
              <div className="navbar-nav">
                {/* <div className="alignend"> */}
                {JSON.parse(authData).role === "admin" ? (
                  <div>
                    <NavLink
                      className="btn"
                      aria-current="page"
                      to="/alldetails"
                    >
                      All Details
                    </NavLink>
                    <NavLink className="btn" to="/addemp">
                      Add Employee
                    </NavLink>
                  </div>
                ) : (
                  <NavLink
                    className="btn"
                    aria-current="page"
                    to={"/userdashboard/" + JSON.parse(authData)._id}
                  >
                    User Dashboard
                  </NavLink>
                )}
                {/* </div> */}
                <div className="logoutbtn">
                  <NavLink
                    className="btn"
                    to="/loginpage"
                    onClick={logout}
                  >
                    Logout | {JSON.parse(authData).name}
                  </NavLink>
                </div>
              </div>
            ) : (
              <div className=" position-fixed" style={{ right: "0.7%" }}>
                <NavLink className="" to="/loginpage"></NavLink>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
