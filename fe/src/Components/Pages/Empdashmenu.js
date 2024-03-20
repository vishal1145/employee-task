import React, { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";

export default function Empdashmenu() {
  var authData = localStorage.getItem("user");

  if (authData) {
    var authData = JSON.parse(authData);
  } else {
    <h6>No Record Found</h6>;
  }

  return (
    <>
      <div
        className="menu wid-20 border-end mt-2"
        style={{ height: "85vh", justifyContent: "start" }}
      >
        <div className="authpic">
          <img src="" alt="Photo" />
        </div>

        <div className="card mt-3 border-0">
          <h6>Name: {authData.name}</h6>
          <h6>Email: {authData.email}</h6>
          <h6>Running: {authData.running}</h6>
          <h6>Pending: {authData.pending}</h6>
          <h6>Completed: {authData.completed}</h6>
        </div>
      </div>
    </>
  );
}
