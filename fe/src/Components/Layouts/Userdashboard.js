import React from "react";
// import { Link, NavLink, useParams, useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import Empdashmenu from "../Pages/Empdashmenu";
import Empdetails from "../Pages/Empdetails";
import PageNotFound from "../Pages/PageNotFound";

// const authData = localStorage.getItem("user");

export default function Userdashboard() {
  return (
    <>
    {/* {JSON.parse(authData).role != "admin" || JSON.parse(authData).role != "Team Lead" ? ( */}
      <div className="main">
        {/* <Empdashmenu /> */}
        <Empdetails />
      </div>
     {/* ) : <PageNotFound />} */}
    </>
  );
}
