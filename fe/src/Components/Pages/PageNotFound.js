import React from 'react'

export default function Pagenotfound() {
  return (
    <div className="pnf d-flex align-items-center justify-content-center">
      <div className="text-center">
        <img
          className=""
          src="/algofolks-logo.png"
          alt=""
          style={{ width: "80%" }}
        />
        <h1
          className="display-1 text-center"
          style={{ marginTop: "-90px", color: "#24b7a7", fontWeight: "bold" }}
        >
          algofolks
        </h1>
        <h1 style={{ marginTop: "20px", color: "red", fontWeight: "bold" }}>
          Page Not Found 404 Error
        </h1>
        <div className="mt-4">
            <span className="borde px-3" style={{fontSize:"30px", borderRadius:"10px", border:"1px solid blue"}}>Back to Home</span>
          
        </div>
      </div>
    </div>
  );
}
