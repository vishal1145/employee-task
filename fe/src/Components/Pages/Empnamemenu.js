import React, { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";

export default function Empnamemenu() {
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
      <div
        className="menu wid-20 border-end"
        style={{ height: "85vh", justifyContent: "start" }}
      >
        <div>
          <h5>Employee Name</h5>
        </div>
        {listname.length > 0 ? (
          listname.map((item, index) => (
            <div className="wid-90 pe-2" >
              <NavLink
                to={"/alldetails/" + item._id}
                className="btn btn-outline-primary"
              >
                {item.name}
              </NavLink>
            </div>
          ))
        ) : (
          <h6>Record not found..</h6>
        )}
      </div>
    </>
  );
}
