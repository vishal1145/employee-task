import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';


export default function Navbar() {
  var authData = localStorage.getItem("user");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/loginpage");
    // Close the dropdown after logout
    setIsDropdownOpen(false);
  };
  return (
    // <div className="header">
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {JSON.parse(authData).role === "admin" ? (
          <div>
            <Link className="navbar-brand" to="/">
              <img
                src="/cropelogo.png"
                alt="AlgoFolks"
                style={{ width: "45px", height: "40px" }}
              />
            </Link>
          </div>
        ) : (
          <div>
            <NavLink
              className="navbar-brand"
              to={"/" + JSON.parse(authData)._id}
            >
              <img
                src="/cropelogo.png"
                alt="AlgoFolks"
                style={{ width: "45px", height: "40px" }}
              />
            </NavLink>
          </div>
        )}

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
                    to={"/alldetails/660ac3661e2437097f39c4ea"}
                  >
                    All Details
                  </NavLink>
                  {/* <NavLink className="btn" to="/addemp">
                    Add Employee
                  </NavLink> */}

                  <NavLink className="btn" to="/allemployee">
                    Employees
                  </NavLink>
                </div>
              ) : null}
              {/* </div> */}
              {/* <NavLink
                    className="btn"
                    aria-current="page"
                    to={"/" + JSON.parse(authData)._id}
                  >
                    User Dashboard
                  </NavLink> */}
              <div className="logoutbtn">
                {/* <NavLink className="btn" to="/loginpage" onClick={logout}>
                    Logout | {JSON.parse(authData).name}
                  </NavLink> */}

                <div className="d-flex flex-row justify-content-end gap-3">
                  <div className="">
                    <div className="menuimg rounded-circle text-lg-end">
                      {JSON.parse(authData).profileimage === "" ||
                      JSON.parse(authData).profileimage == null ? (
                        <img
                          className="profimage rounded-circle"
                          src={"/empimg.jpg"}
                          alt=""
                          style={{ width: "40px", height: "40px" }}
                        />
                      ) : (
                        <img
                          className="profimage rounded-circle"
                          src={JSON.parse(authData).profileimage}
                          alt=""
                          style={{ width: "40px", height: "40px" }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="text-gray pr-2">
                    <p className="m-0 text-muted">Hi Welcome</p>
                    <p className="m-0 fontWeight ">
                      {JSON.parse(authData).name}
                    </p>
                  </div>
                  <div className=" align-self-center  pe-2">
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      onClick={logout}
                      className="wid-100 cursor-pointer"
                    />
                  </div>
                </div>
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
    // </div>
  );
}
