import React, { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";

export default function Empdashmenu() {
  var authData = localStorage.getItem("user");

  const [empprofile, setEmpprofile] = React.useState([]);

  const params = useParams();

  useEffect(() => {
    getEmpprofile();
  }, []);

  const getEmpprofile = async () => {
    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/empprofile/${params.id}`
    );

    result = await result.json();

    setEmpprofile(result);
  };

  if (authData) {
    var authData = JSON.parse(authData);
  } else {
    <h6>No Record Found</h6>;
  }

  return (
    <>
      {empprofile.length > 0
        ? empprofile.map((item, index) => (
            <div
              className="menu wid-20 border-end mt-2 pe-3"
              style={{ height: "85vh", justifyContent: "start" }}
            >
              <div
                className="authpic"
                style={{ overflow: "hidden", width: "100%", height: "35vh" }}
              >
                {/* <img src={authData.profileimage} alt="Photo"  style={{width:"100%"}}/> */}
                {item.profileimage == "" || item.profileimage == null ? (
                  <img src={"/empimg.jpg"} alt="photo" style={{ width: "100%", height: "35vh" }} />
                ) : (
                  <img src={item.profileimage} alt="photo" style={{ width: "100%", height: "35vh" }} />
                )}
              </div>

              <div className="card mt-3 border-0">
                <h6>Name: {item.name}</h6>
                <h6>Email: {item.email}</h6>
                <h6>Running: {item.running}</h6>
                <h6>Pending: {item.pending}</h6>
                <h6>Completed: {item.completed}</h6>
              </div>

              <NavLink
                to={"/empprofile/" + item._id}
                className="btn"
              >
                Profile
              </NavLink>
            </div>
          ))
        : null}
    </>
  );
}
