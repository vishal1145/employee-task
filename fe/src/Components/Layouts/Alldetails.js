import React from 'react'

import Empnamemenu from '../Pages/Empnamemenu';
import Empdetails from '../Pages/Empdetails';

export default function Alldetails() {
      const emprole = JSON.parse(localStorage.getItem("user")).role;
    return (
      <>
        <div className="main">
          {emprole === "admin" || emprole === "Team Lead" || emprole === "Human Resource" ? (
            <>
              <Empnamemenu />
              <Empdetails />{" "}
            </>
          ) : (
            <Empdetails />
          )}
        </div>
      </>
    );
}