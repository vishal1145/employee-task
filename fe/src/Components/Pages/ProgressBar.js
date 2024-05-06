// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

// const ProgressBar = ({employeeId}) => {
//   const [taskProgress, setTaskProgress] = useState([]);
//   const [empdeatils, setEmpdetails] = useState([]);

//   const params=useParams();

//   const getEmpdetails = async () => {
//     try {
//       let result = await fetch(
//         `${process.env.REACT_APP_API_KEY}/empdetails/${employeeId}`,
//         {
//           method: "get",
//         }
//       );

//       result = await result.json();
//       setEmpdetails(result);
//     } catch (error) {
//       console.log("Error loading");
//     }
//   };

//   useEffect(() => {
//     getEmpdetails();

//     // const interval = setInterval(() => {
//     //   const now = new Date().getTime();
//     //   const updatedProgress = tasks.map(task => {
//     //     const startTime = new Date(task.date).getTime();
//     //     const elapsedTime = now - startTime;
//     //     const calculatedProgress = (elapsedTime / task.duration) * 100;
//     //     return {
//     //       ...task,
//     //       progress: calculatedProgress > 100 ? 100 : calculatedProgress
//     //     };
//     //   });
//     //   setTaskProgress(updatedProgress);
//     // }, 1000);

//     // return () => clearInterval(interval);
//   }, [employeeId]);

//   return (
//     <div>
//       {empdeatils.map((item, index) => (
//         <div key={index}>
//           <div className="progress mt-2" style={{height:"0.6vw"}}>
//             <div
//               className="progress-bar"
//               role="progressbar"
//               style={{ width: `${item.progress}%`, backgroundColor: "green", height: "0.6vw"
//              }}
//               aria-valuenow={item.progress}
//               aria-valuemin="0"
//               aria-valuemax="100"
//             >
//               {/* {item.task} */}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ProgressBar;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProgressBar = ({ totalTimes, hourTime, empId }) => {
  const [progress, setProgress] = useState(0);
  const [starttime, setStartTime] = useState(0);
  const [progressColor, setProgressColor] = useState("orange");
  // const [empdetails, setEmpdetails] = useState([]);

  const params = useParams();

  const getEmpdetails = async () => {
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/empdetails/${empId}`,
        {
          method: "get",
        }
      );

      result = await result.json();
      const date = new Date(result[0].date);
      const timeStamp = date.getTime();
      setStartTime(timeStamp);
    } catch (error) {
      console.log("Error loading");
    }
  };

  useEffect(() => {
    getEmpdetails();
    const interval = setInterval(() => {
      // const starttimes = new Date().getTime();
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - starttime;
      const calculatedProgress = (elapsedTime / totalTimes) * 100;

      const progressPercentage = Math.min(calculatedProgress, 100);
      setProgress(progressPercentage);

      if (progressPercentage >= 50) {
        setProgressColor("green");
      } 
      if (progressPercentage >= 80) {
        setProgressColor("red");
      }

      if (progressPercentage >= 100) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [starttime, totalTimes]);

  return (
    <div className="wid-100 d-flex align-items-center">
      <div className="progress wid-95" style={{ borderRadius: "10px", height: "0.5vw", marginTop: "7px" }}>
        {totalTimes > 0 ? (
          <div className="progress-bar" role="progressbar" style={{ width: `${progress}%`, borderRadius: "10px", backgroundColor: progressColor }} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"></div>

        ) : (
          null
        )}
      </div>
      <span
        className="mb-0 ps-1 wid-5"
        style={{ fontSize: "10px", marginTop: "7px", color: "black" }}
      >
        {hourTime}
      </span>
    </div>
    // <div style={{backgroundColor:"white", width:"100%", height: "0.5vw", borderRadius: "10px", marginTop: "7px"}}>
    //   {totalTimes > 0 ? (
    //     <div className="d-flex align-items-center">
    //       <div
    //         style={{
    //           width: `${progress}%`,
    //           backgroundColor: "green",
    //           height: "0.5vw",
    //           borderRadius: "10px",
    //           marginTop: "7px",
    //         }}
    //       />
    //       <div className="d-flex align-items-center">
    //         <span
    //           className="mb-0 ps-1 "
    //           style={{ fontSize: "10px", marginTop: "7px" }}
    //         >
    //           {hourTime}
    //         </span>
    //       </div>
    //     </div>
    //   ) : (
    //     <span style={{ fontSize: "10px", marginTop: "7px" }}>{hourTime}</span>
    //   )}
    // </div>
  );
};

export default ProgressBar;
