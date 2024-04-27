import React, { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";

export default function Empprofile() {
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

  const emprole = JSON.parse(localStorage.getItem("user")).role;

  return (
    <div className="empprofile">
      <div className="container-xl">
        {/* <div className=""> */}
        {empprofile.length > 0
          ? empprofile.map((item, index) => (
              <div className="row mx-auto justify-content-center">
                <div className="p-3 col-12 col-sm-5 col-md-5 col-lg-5">
                  <div className="card emppropic">
                    {item.profileimage === "" || item.profileimage == null ? (
                      <img className="profimage" src={"/empimg.jpg"} alt="" />
                    ) : (
                      <img
                        className="profimage"
                        src={item.profileimage}
                        alt=""
                      />
                    )}
                  </div>
                </div>

                <div className="p-3 col-12 col-sm-6 col-md-6 col-lg-6">
                  <div className="card border-0" >
                    <pre style={{overflow:"hidden"}}>
                      <h4>Name                  : {item.name}</h4>
                      <h4>Email                   : {item.email}</h4>
                      <h4>Mobile No          : {item.mobile}</h4>
                      <h4>Date of birth     : {item.dob}</h4>
                      <h4>Position              : {item.position}</h4>
                      <h4>Date of joining  : {item.joining}</h4>
                    </pre>
                    {/* <h4>Completed Project : </h4>
                      <h4>Running Project : </h4>
                      <h4>Pending Project : </h4> */}

                    {emprole === "admin" || emprole === "Team Lead" ? null : (
                      <div>
                        <NavLink
                          to={"/updateprofile/" + item._id}
                          className="btn"
                        >
                          Edit Profile
                        </NavLink>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          : null}
        {/* </div> */}
      </div>
    </div>
  );
}
