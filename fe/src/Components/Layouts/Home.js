import React from 'react'
// import { Link } from 'react-router-dom';
// import Allemployee from '../Pages/Allemployee';
import Algofolkshome from '../Pages/Algofolkshome';
// import Userdashboard from '../Layouts/Userdashboard';
import UserDetails from "../Pages/UserDetails";

export default function Home() {
    const emprole = JSON.parse(localStorage.getItem('user')).role;
    return (
      <>
        <div className="main">
          {emprole === "admin" ||
          emprole === "Team Lead" ||
          emprole === "Human Resource" ? (
            <Algofolkshome />
          ) : (
            <UserDetails />
          )}
        </div>
      </>
    );
}