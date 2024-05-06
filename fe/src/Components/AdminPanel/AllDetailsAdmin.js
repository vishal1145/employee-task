import React from 'react'
import EmpDetails from '../Pages/EmpDetails';
import PageNotFound from '../Pages/PageNotFound';

export default function Alldetails() {
      const emprole = JSON.parse(localStorage.getItem("user")).role;
    return (
      <>
        <div className="main">
          {emprole === "admin" ||
          emprole === "Team Lead" ||
          emprole === "Human Resource" ? (
            <>
              <EmpDetails />
            </>
          ) : (
            <div className="mx-auto">
              <PageNotFound />
            </div>
          )}
        </div>
      </>
    );
}