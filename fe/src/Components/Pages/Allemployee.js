import React, { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";

export default function Allemployee() {
  // const auth = localStorage.getItem('user');
  const [listname, setListname] = React.useState([]);

  const params = useParams();

  useEffect(() => {
    getListname();
  }, []);

  const getListname = async () => {
    let result = await fetch(`${process.env.REACT_APP_API_KEY}/listname`);

    result = await result.json();

    setListname(result);
  };
  return (
    <>
      <div className="container-xl">
        <div className="row">
          <div>
            <h5>All Employees</h5>
          </div>
          {listname.length > 0 ? (
            listname.map((item, index) => (
              <div className="p-3 col-12 col-sm-6 col-md-4 col-lg-4">
                <NavLink
                  to={"/empprofile/" + item._id}
                  className="text-decoration-none"
                >
                  <div className="cards">
                    <div className="emppic wid-40">
                      <img src="" alt="Photo" />
                    </div>
                    <div className="empcontent wid-60">
                      <h6>Name: {item.name}</h6>
                      {/* <h6 className="emailtext">Email: {item.email}</h6> */}
                      <h6>Completed: </h6>
                      <h6>Running: </h6>
                      <h6>Pending:</h6>
                    </div>
                  </div>
                </NavLink>
              </div>
            ))
          ) : (
            <h6>Record not found..</h6>
          )}
        </div>
      </div>
    </>
  );
}
