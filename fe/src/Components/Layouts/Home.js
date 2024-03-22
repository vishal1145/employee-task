import React from 'react'
// import { Link } from 'react-router-dom';
import Allemployee from '../Pages/Allemployee';
// import Algofolkshome from '../Pages/Algofolkshome';
import Userdashboard from '../Layouts/Userdashboard';
// import Algofolkshome from '../Pages/Algofolkshome';

export default function Home() {
    const emprole = JSON.parse(localStorage.getItem('user')).role;
    return (
      <>
        <div className="main">
          {emprole === "admin" ? <Allemployee /> : <Userdashboard />}
        </div>
      </>
    );
}