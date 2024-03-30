import React, { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";

export default function Empdashmenu() {
  var authData = localStorage.getItem("user");
  if (authData) {
    var authData = JSON.parse(authData);
  } else {
    <h6>No Record Found</h6>;
  }

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

  

  return (
    <>
      {empprofile.length > 0
        ? empprofile.map((item, index) => (
            <div
              className="menu wid-25 border-end mt-2 px-3 pt-2"
              style={{ justifyContent: "start" }}
            >
              <div
                className="authpic"
              >
                {/* <img src={authData.profileimage} alt="Photo"  style={{width:"100%"}}/> */}
                {item.profileimage === "" || item.profileimage == null ? (
                  <img src={"/empimg.jpg"} alt="" />
                ) : (
                  <img src={item.profileimage} alt="" />
                )}
              </div>

              <div className="card mt-3 border-0 text-center">
                <h6>{item.name}</h6>
                <h6>{item.email}</h6>
                <h6>{item.position}</h6>
                
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
