import React, { useEffect } from "react";
import { NavLink, Link, useParams } from "react-router-dom";

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

  const deleteemp = async (id) => {
    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/deleteemp/${id}`,
      {
        method: "Delete",
        headers: {
          // authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        },
      }
    );
    result = await result.json();
    if (result) {
      // alert("Task deleted Successfully");
      getListname();
    }
  };

  return (
    <>
      <div className="container-xl">
        <div className="row allemployee">
          <div>{/* <h5>All Employees</h5> */}</div>
          {listname.length > 0 ? (
            listname.map((item, index) => (
              <div className="p-3 col-6 col-sm-4 col-md-3 col-lg-3">
                <NavLink
                  to={"/empprofile/" + item._id}
                  className="text-decoration-none"
                >
                  <div className="card">
                    <div className="card-header justify-content-center d-flex">
                      <div className="dotmenu">
                        <div class="dropdown">
                          <button
                            class="btn btn-secondary dropdown-toggl"
                            type="button"
                            id="dropdownMenuButton1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i class="bi bi-three-dots-vertical"></i>
                          </button>
                          <ul
                            class="dropdown-menu p-0"
                            aria-labelledby="dropdownMenuButton1"
                          >
                            <li>
                              <Link
                                className="dropdown-item p-1"
                                onClick={() => deleteemp(item._id)}
                              >
                                Delete
                              </Link>
                            </li>
                            {/* <li><a class="dropdown-item" href="#">Another action</a></li> */}
                            {/* <li><a class="dropdown-item" href="#">Something else here</a></li> */}
                          </ul>
                        </div>
                        <Link></Link>
                      </div>
                      <div className="emppic">
                        {/* <img src="empimg.jpg" alt="Photo" style={{width:"100%"}}/> */}
                        {item.profileimage === "" ||
                        item.profileimage == null ? (
                          <img
                            src={"/empimg.jpg"}
                            alt="photo"
                            style={{ width: "100%" }}
                          />
                        ) : (
                          <img
                            src={item.profileimage}
                            alt="photo"
                            style={{ width: "100%" }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="card-body text-center pb-0">
                      <h6>{item.name}</h6>
                      <h6>Developer</h6>
                      {/* <h6 className="emailtext">Email: {item.email}</h6> */}
                      {/* <h6>Completed: {item.completed}</h6> */}
                      {/* <h6>Running: {item.running}</h6> */}
                      {/* <h6>Pending: {item.pending}</h6> */}
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
