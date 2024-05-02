import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import JoditEditor from "jodit-react";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
// import moment from "moment";
import parse from "html-react-parser";
import Swal from "sweetalert2";

export default function Algofolkshome() {
  const [listname, setListname] = useState([]);
  const [task, setTask] = useState("");
  const [name, setName] = useState(null);
  // const [assign, setAssign] = useState("");
  const [time, setTime] = useState("1 hour");
  const [alltask, setAllTask] = useState([]);
  const [taskId, setTaskId] = useState("");
  const [project, setProject] = useState("");
  const [listproject, setListProject] = useState([]);
  const [loading, setLoading] = useState(true);

  const closeButtonRef4 = useRef();
  const closeButtonRef5 = useRef();
  const editor = useRef(null);

  useEffect(() => {
    // getListname();
    // getListProject();
    // getUpdate();
    // getAllTaskNotId();
  }, []);

  const idnull = () => {
    setTask("");
  };

  const getAllTaskNotId = async () => {
    // setLoading(true);
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/alltasknotempid`,
        {
          method: "get",
        }
      );
      result = await result.json();

      setAllTask(result);
    } catch (error) {
      toast.error("Failed Data Loading");
    } finally {
      setLoading(false);
    }
  };

  const deletetask = async (id) => {
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
          Swal.fire("Deleted!", "Your Task has been deleted.", "success");
          getAllTaskNotId();
        }
      }
    });
  };

  return (
    <>
      {/* <div className="allemployee">
        <div className=" wid-100 mx-3">
          <div
            className="d-flex align-items-center justify-content-between bg-white py-2"
            style={{ position: "sticky", top: "0", zIndex: "999" }}
          >
            <h4 className="mb-0">All Archive Task</h4>

          <table className="wid-100">
            <thead>
              <tr>
                <th className="text-start wid-60">Task</th>
                
                <th className="text-center wid-5">Modify</th>
              </tr>
            </thead>
            {loading ? ( 
              <div className="loader-container">
                <ClipLoader size={35} color={"#36D7B7"} loading={loading} />
              </div>
            ) : (
              <tbody>
                {alltask.length > 0 ? (
                  alltask.map((item, index) => (
                    <>
                      <tr
                        key={item._id}
                        style={{
                          backgroundColor:
                            item.status === "Pending"
                              ? "rgba(239, 154, 154, 0.7)"
                              : item.status === "Running"
                              ? "rgba(255, 235, 59, 0.6)"
                              : item.status === "Completed"
                              ? "rgba(0, 137, 123, 0.8)"
                              : "rgba(239, 154, 154, 0.7)",
                        }}
                      >
                        <td className="text-start lh-sm pb-0 pt-3">
                          {parse(item.task)}
                        </td>
                        
                        <td>
                          <Link onClick={() => deletetask(item._id)}>
                            <i className="bi bi-trash3-fill"></i>
                          </Link>
                        </td>
                      </tr>
                    </>
                  ))
                ) : (
                  <h4
                    className="text-center mb-0"
                    style={{
                      marginLeft: "7%",
                      color: "rgba(0, 137, 123, 0.3)",
                    }}
                  >
                    No Record
                  </h4>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        class="m-0"
      /> */}
    </>
  );
}
