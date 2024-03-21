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
        className="menu wid-20 border-end ms-0"
        style={{ height: "92vh", justifyContent: "start" }}
      >
        <div className=" menusearch">
          {/* <h5 className="text-center">Employees</h5> */}
          <form action="">
            <input
              className="p-1 mt-3"
              type="text"
              placeholder="Search here"
              // onChange={searchuser}
            />
          </form>
        </div>
        {listname.length > 0 ? (
          listname.map((item, index) => (
            <div className="pe-0 allemp">
              <NavLink to={"/alldetails/" + item._id} className="btn">
                <div className="menudiv">
                  <div className="menuimg">
                    {item.profileimage === "" || item.profileimage == null ? (
                      <img
                        className="profimage"
                        src={"/empimg.jpg"}
                        alt="Photo"
                      />
                    ) : (
                      <img
                        className="profimage"
                        src={item.profileimage}
                        alt="Photo"
                      />
                    )}
                  </div>
                  <div className="menuname">{item.name}</div>
                </div>
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
