import React, { useEffect, useState } from "react";
import { NavLink, Link, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2"; // Import SweetAlert

export default function Allemployee() {
  const [listname, setListname] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const params = useParams();

  useEffect(() => {
    getListname();
  }, []);

  const getListname = async () => {
    try {
      setLoading(true); // Set loading to true before fetching data
      let result = await fetch(`${process.env.REACT_APP_API_KEY}/listname`);
      result = await result.json();
      setListname(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  const deleteemp = async (id) => {
    // Use SweetAlert to confirm deletion
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
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
          getListname();
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      }
    });
  };

  return (
    <>
      <div className="allemployee">
        <div className="container-xl">
          <div className="row mt-2">
            <div className="d-flex align-items-center justify-content-between bg-white" style={{position:"sticky", top:"0", zIndex:"999"}}>
              <div className="">
                <h4>All Employee</h4>
              </div>
              <div>
                <NavLink className="btn addempbtn" to="/addemp">
                  Add Employee
                </NavLink>
              </div>
            </div>
            {loading ? ( // Display loader if loading state is true
              <div className="loader-container2">
                <ClipLoader size={35} color={"#36D7B7"} loading={loading} />
              </div>
            ) : (
              <>
                {listname.length > 0 ? (
                  listname
                    .filter((item) => item.role !== "admin") // Filter out admins
                    .map((item, index) => (
                      <div
                        className="p-3 col-6 col-sm-4 col-md-3 col-lg-3"
                        key={index}
                      >
                        <NavLink
                          to={"/empprofile/" + item._id}
                          className="text-decoration-none"
                        >
                          <div className="card">
                            <div className="card-header justify-content-center d-flex">
                              <div className="dotmenu">
                                <div className="dropdown">
                                  <button
                                    className="btn btn-secondary dropdown-toggl"
                                    type="button"
                                    id="dropdownMenuButton1"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="bi bi-three-dots-vertical"></i>
                                  </button>
                                  <ul
                                    className="dropdown-menu p-0"
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
                                  </ul>
                                </div>
                                <Link></Link>
                              </div>
                              <div className="emppic">
                                {item.profileimage === "" ||
                                item.profileimage == null ? (
                                  <img
                                    src={"/empimg.jpg"}
                                    alt=""
                                    style={{ width: "100%" }}
                                  />
                                ) : (
                                  <img
                                    src={item.profileimage}
                                    alt=""
                                    style={{ width: "100%" }}
                                  />
                                )}
                              </div>
                            </div>
                            <div className="card-body text-center pb-0">
                              <h6>{item.name}</h6>
                              <h6>Developer</h6>
                            </div>
                          </div>
                        </NavLink>
                      </div>
                    ))
                ) : (
                  <h6>Record not found..</h6>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
