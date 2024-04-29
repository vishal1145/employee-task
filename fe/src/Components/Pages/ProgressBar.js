import React, { useState, useEffect } from "react";

const ProgressBar = ({ totalTime }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate progress based on elapsed time
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - startTime;
      const calculatedProgress = (elapsedTime / totalTime) * 100;

      setProgress(calculatedProgress);

      // Clear interval when progress reaches 100%
      if (calculatedProgress >= 100) {
        clearInterval(interval);
      }
    }, 1000); // Update progress every second

    const startTime = new Date().getTime(); // Record start time

    return () => clearInterval(interval); // Cleanup
  }, [totalTime]); // Re-run effect when totalTime changes

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
