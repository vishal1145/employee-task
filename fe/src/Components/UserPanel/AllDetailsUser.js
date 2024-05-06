import React from 'react'
import UserDetails from '../Pages/UserDetails';

export default function Alldetails() {
      const emprole = JSON.parse(localStorage.getItem("user")).role;
    return (
      <>
        <div className="main">
          {emprole === "admin" || emprole === "Team Lead" || emprole === "Human Resource" ? (
           (null)
          ) : (
            <UserDetails />
          )}
        </div>
      </>
    );
}