// import React, { useState, useEffect } from "react";

// const ProgressBar = ({ tasks }) => {
//   const [taskProgress, setTaskProgress] = useState([]);

//   useEffect(() => {
    
//     const interval = setInterval(() => {
//       const now = new Date().getTime();
//       const updatedProgress = tasks.map(task => {
//         const startTime = new Date(task.date).getTime();
//         const elapsedTime = now - startTime;
//         const calculatedProgress = (elapsedTime / task.duration) * 100;
//         return {
//           ...task,
//           progress: calculatedProgress > 100 ? 100 : calculatedProgress
//         };
//       });
//       setTaskProgress(updatedProgress);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [tasks]);

//   return (
//     <div>
//       {taskProgress.map((task, index) => (
//         <div key={index}>
//           <div className="progress">
//             <div
//               className="progress-bar"
//               role="progressbar"
//               style={{ width: `${task.progress}%`, backgroundColor: "green", height: "0.6vw"
//              }}
//               aria-valuenow={task.progress}
//               aria-valuemin="0"
//               aria-valuemax="100"
//             >
//               {task.name}
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

const ProgressBar = ({ totalTime }) => {
  const [progress, setProgress] = useState(0);
  const [starttime, setStartTime] = useState(0);
  // const [empdetails, setEmpdetails] = useState([]);

  const params = useParams();

  const getEmpdetails = async () => {
    try {
      let result = await fetch(
        `${process.env.REACT_APP_API_KEY}/empdetails/${params.id}`,
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

    if (totalTime > 0) {
      const interval = setInterval(() => {
        // const starttimes = new Date().getTime();
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - starttime;
        const calculatedProgress = (elapsedTime / totalTime) * 100;

        const progressPercentage = Math.min(calculatedProgress, 100);
        setProgress(progressPercentage);

        if (progressPercentage >= 100) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [starttime, totalTime]);

  return (
    <div>
      <div>
        <div
          style={{
            width: `${progress}%`,
            backgroundColor: "green",
            height: "0.5vw",
            borderRadius: "10px",
            marginTop: "7px",
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

