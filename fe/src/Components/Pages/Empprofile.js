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
    <div>
      <div className="container-xl">
        <div className="row mt-5">
          <div className="col-12 col-sm-5 col-md-5 col-lg-5">
            <div className="card emppropic">
              <img src="" alt="Photo" />
            </div>
          </div>

          <div className="col-12 col-sm-7 col-md-7 col-lg-7">
            {empprofile.length > 0
              ? empprofile.map((item, index) => (
                  <div className="card border-0">
                    <h4>Name : {item.name}</h4>
                    <h4>Email : {item.email}</h4>
                    <h4>Mobile No : </h4>
                    <h4>Age : </h4>
                    <h4>State : </h4>
                    <h4>Completed Project : </h4>
                    <h4>Running Project : </h4>
                    <h4>Pending Project : </h4>

                    {emprole === "user" ? (
                      <div>
                        <NavLink
                          to={"/updateprofile/" + item._id}
                          className="btn btn-outline-primary"
                        >
                          Edit Profile
                        </NavLink>
                      </div>
                    ) : null}
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
