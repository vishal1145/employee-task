import React, { useState, useEffect } from "react";
import { NavLink, Link, useParams, useNavigate } from "react-router-dom";

export default function Empdetails() {
  var authData = localStorage.getItem("user");

  const [empdeatils, setEmpdetails] = useState("");
  const [status, setStatus] = useState("");

  const params = useParams();
  const navigate = useNavigate();

  const getEmpdetails = async () => {
    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/empdetails/${params.id}`,
      {
        method: "get",
      }
    );

    result = await result.json();
    setEmpdetails(result);
  };

  useEffect(() => {
    getEmpdetails();
    // getUpdate();
  });

  // const searchuser = async (event) => {
  //   let key = event.target.value;
  //   if (key) {
  //     let result = await fetch(
  //       `http://localhost:5000/empdetailssearch/${key}`,
  //       {
  //         headers: {
  //           // authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
  //         },
  //       }
  //     );
  //     result = await result.json();
  //     if (result) {
  //       setEmpdetails(result);
  //     }
  //   } else {
  //     getEmpdetails();
  //   }
  // };

  const deletetask = async (id) => {
    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/deletetask/${id}`,
      {
        method: "Delete",
        headers: {
          // authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        },
      }
    );
    result = await result.json();
    if (result) {
      alert("Task deleted Successfully");
      getEmpdetails();
    }
  };

  const addstatus = async (id) => {
    let result = await fetch(
      `${process.env.REACT_APP_API_KEY}/addstatus/${id}`,
      {
        method: "put",
        body: JSON.stringify({ status }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    result = await result.json();
    if (result) {
      // setEmpdetails(result);
      getEmpdetails();
    }
  };

  // const getUpdate = async () => {
  //   let result = await fetch(
  //     `http://localhost:5000/taskautofill/${params.id}`,
  //     {
  //       method: "get",
  //       //   headers: {
  //       //     // authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
  //       //   },
  //     }
  //   );

  //   result = await result.json();
  //   setStatus(result.status);
  // };

  return (
    <>
      <div className="empdeatils wid-80">
        <div className="headsec">
          <h5 className="">Task</h5>
          {JSON.parse(authData).role === "admin" ? (
            <div
              className="addtaskbtn"
              // style={{ position: "fixed", top: "10%", right: "1.5%" }}
            >
              <NavLink className="btn" to={"/adddetails/" + params.id}>
                Add Task
              </NavLink>
            </div>
          ) : null}
        </div>
        <table className="wid-100">
          <thead>
            <tr>
              {/* <th className="wid-5">S.N</th> */}
              <th className="wid-50 text-start">Task</th>
              <th className="wid-10 text-start">Estimate</th>
              <th className="wid-10 text-start">Status</th>
              {JSON.parse(authData).role === "admin" ? (
                <th className="wid-10">Modify</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {empdeatils.length > 0
              ? empdeatils.map((item, index) => (
                  <tr>
                    <td className="text-start">{item.task}</td>
                    <td className="text-start">{item.time}</td>
                    <td className="text-start">
                      <NavLink
                        className="text-decoration-none"
                        onClick={() => addstatus(item._id)}
                        onChange={(e) => setStatus(e.target.value)}
                        value={status}
                      >
                        <select
                          class="form-select choosestatus"
                          // aria-label="Default select example"
                          // value={status}

                          // onChange={(e) => setStatus(e.target.value)}
                        >
                          {/* <option selected>{item.status}</option> */}
                          <option value="Running">Running</option>
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </NavLink>
                    </td>
                    {JSON.parse(authData).role === "admin" ? (
                      <td className="modifysec">
                        <Link to={"/updatetask/" + item._id}>
                          <i class="bi bi-pencil-square"></i>
                        </Link>
                        <Link onClick={() => deletetask(item._id)}>
                          <i class="bi bi-trash3-fill"></i>
                        </Link>
                      </td>
                    ) : null}
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
