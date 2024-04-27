import React, { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
// import axios from "axios";

export default function Empnamemenu() {
  const [listname, setListname] = React.useState([]);
  // const [empdetails, setEmpdetails] = React.useState([]);
  const [loading, setLoading] = React.useState(true); // Add loading state
  // const [stopInterval, setStopInterval] = React.useState("stop");
  // const [dataLoad, setDataLoad] = React.useState(false);

  const params = useParams();

  useEffect(() => {
    getListname();

    // if (stopInterval === "run") {
    //   const interval = setInterval(async () => {
    //     await getListname();
    //   }, 7000);
    //   return () => clearInterval(interval);
    // }
  }, []);
  // stopInterval

  const getListname = async () => {
    try {
      let result = await fetch(`${process.env.REACT_APP_API_KEY}/listname`);
      result = await result.json();

      const updatedList1 = await Promise.all(
        result.map(async (user) => {
          const counts = await getStatusCount(user._id);
          return { ...user, counts };
        })
      );

      // Sort the updatedList1 alphabetically by the 'name' property
      updatedList1.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      );

      if (updatedList1) {
        setListname(updatedList1);
      }
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  const getStatusCount = async (id) => {
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/statuscount/${id}`,
        {
          method: "get",
        }
      );

      result = await result.json();
      return result;
    } catch (error) {
      // console.log("Error fetching status counts:", error);
      return {
        pending: 0,
        // running: 0,
        completed: 0,
      };
    }
  };

  // const searchusers = async (event) => {
  //   let key = event.target.value//.toLowerCase();
  //   if (key) {
  //     try {
  //       let result = await fetch(
  //         `${process.env.REACT_APP_API_KEY}/searchusers/${key}`
  //       );
  //       result = await result.json();
  //       if (result) {
  //         const updatedList2 = await Promise.all(
  //           result.map(async (user) => {
  //             const statusCounts = await getStatusCount(user._id);
  //             return { ...user, counts: statusCounts };
  //           })
  //         );
  //         setListname(updatedList2);
  //       }
  //       else {
  //         setListname([]);
  //       }
  //     } catch (error) {
  //       console.error("Error searching users:", error);
  //       // Handle error
  //     }
  //   } else {
  //     getListname();
  //   }
  // };

  const searchuser = (event) => {
    let key = event.target.value.toLowerCase(); // Convert search key to lowercase
    if (key) {
      // setStopInterval("stop");
      const filteredList = listname.filter((item) =>
        item.name.toLowerCase().includes(key)
      );
      setListname(filteredList);
    } else {
      // setStopInterval("run");
      getListname(); // If search key is empty, reset the list
    }
  };

  const loadData = () => {
    getListname();
  }

  // const start =()=>{
  //   setStopInterval("run");
  // }
  // setTimeout(() => {
  //   setStopInterval("stop");
  // }, 10000);

  return (
    <>
      <div
        className="menu wid-35 border-end ms-0"
        style={{ justifyContent: "start" }}
      >
        <div className=" menusearch">
          <form className="px-2 py-2">
            <input
              className="p-1 mb-0"
              type="text"
              placeholder="Search here"
              onChange={searchuser}
              // style={{ width: "100%" }}
            />
          </form>
        </div>
        {loading ? ( // Display loader if loading state is true
          <div className="loader-container">
            <ClipLoader size={35} color={"#36D7B7"} loading={loading} />
          </div>
        ) : (
          <>
            {listname.length > 0 ? (
              listname
                .filter((item) => item.role !== "admin") // Filter out admins
                .map((item, index) => (
                  <div className="pe-0 allemp" key={item._id}>
                    <NavLink
                      to={"/alldetails/" + item._id}
                      className="navlink-custom btn"
                      onClick={loadData}
                      // activeclassname="active-link" // Add activeClassName for active state
                    >
                      <div className="menudiv">
                        <div className="menuimg">
                          {item.profileimage === "" ||
                          item.profileimage == null ? (
                            <img
                              className="profimage"
                              src={"/empimg.jpg"}
                              alt=""
                            />
                          ) : (
                            <img
                              className="profimage"
                              src={item.profileimage}
                              alt=""
                            />
                          )}
                        </div>
                        <div className="menuname">
                          <div>{item.name}</div>
                          <div
                            className="mt-1"
                            // key={}
                            style={{
                              fontSize: "10px",
                              // color:
                              //   item.status === "Pending"
                              //     ? "rgba(239, 154, 154, 0.7)"
                              //     : // : item.status === "Running"
                              //     // ? "rgba(255, 235, 59, 0.6)"
                              //     item.status === "Completed"
                              //     ? "rgba(0, 137, 123, 0.8)"
                              //     : "rgba(255, 235, 59, 0.6)"
                            }}
                          >
                            <span style={{ color: "black" }}>
                              Completed:{" "}
                              <span style={{ fontSize: "15px", color:"green" }}>
                                {item.counts.completed}{" "}
                              </span>
                            </span>
                            |
                            <span style={{ color: "black" }}>
                              {" "}
                              Pending:{" "}
                              <span style={{ fontSize: "15px", color:"red" }}>
                                {item.counts.pending}
                              </span>
                            </span>{" "}
                            |
                            {item.counts.time > 0 ? (
                              <span style={{ color: "blue", fontSize: "15px" }}>
                                {" "}
                                On Going
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  </div>
                ))
            ) : (
              <h4
                className="text-center mb-0"
                style={{ marginLeft: "0%", color: "rgba(0, 137, 123, 0.3)" }}
              >
                No Record
              </h4>
            )}
          </>
        )}
      </div>
    </>
  );
}
