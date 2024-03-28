import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Components for different routes
import Navbar from "./Components/Pages/Navbar";
// import Footer from "./Components/Pages/Footer";
import Adddetails from "./Components/Pages/Addtask";
import Empnamemenu from "./Components/Pages/Empnamemenu";
import Empdetails from "./Components/Pages/Empdetails";
import Addemp from "./Components/Pages/Addemp";
import Home from "./Components/Layouts/Home";
import Loginpage from "./Components/Pages/Loginpage";
import ResetPasswordPage from "./Components/Pages/ResetPage"
import PrivateComponent from "./Components/Pages/PrivateComponent";
import Alldetails from "./Components/Layouts/Alldetails";
import Allemployee from "./Components/Pages/Allemployee";
import Empprofile from "./Components/Pages/Empprofile";
import Updatetask from "./Components/Pages/Updatetask";
import Userdashboard from "./Components/Layouts/Userdashboard";
import Empdashmenu from "./Components/Pages/Empdashmenu";
import Updateprofile from "./Components/Pages/Updateprofile";
// import Algofolkshome from "./Components/Pages/Algofolkshome";
import Pagenotfound from "./Components/Pages/Pagenotfound";

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route element={<PrivateComponent />}>
          <Route
            path="/"
            element={
              <>
                <Home /> <Navbar />{" "}
              </>
            }
          />
          <Route
            path="/:id"
            element={
              <>
                <Userdashboard /> <Navbar />{" "}
              </>
            }
          />
          {/* <Route
            path="/userdashboard"
            element={
              <>
                <Userdashboard /> {" "}
              </>
            }
          /> */}
          <Route
            path="/allemployee"
            element={
              <>
                <Allemployee />
              </>
            }
          />
          <Route
            path="/empprofile/:id"
            element={
              <>
                <Empprofile /> <Navbar />
              </>
            }
          />
          <Route
            path="/alldetails"
            element={
              <>
                <Alldetails /> <Navbar />{" "}
              </>
            }
          />
          <Route
            path="/alldetails/:id"
            element={
              <>
                <Alldetails /> <Navbar />
              </>
            }
          />
          <Route path="/empnamemenu" element={<Empnamemenu />} />
          <Route path="/empdashmenu" element={<Empdashmenu />} />
          <Route path="/empdetails/:id" element={<Empdetails />} />
          <Route
            path="/adddetails/:id"
            element={
              <>
                <Adddetails /> <Navbar />
              </>
            }
          />
          <Route
            path="/addemp"
            element={
              <>
                <Addemp /> <Navbar />
              </>
            }
          />
          <Route
            path="/updatetask/:id"
            element={
              <>
                <Updatetask /> <Navbar />
              </>
            }
          />
          {/* <Route
            path="/Userdashboard/:id"
            element={
              <>
                <Userdashboard /> <Navbar />
              </>
            }
          /> */}
          <Route
            path="/updateprofile/:id"
            element={
              <>
                <Updateprofile /> <Navbar />
              </>
            }
          />
          <Route path="*" element={<Pagenotfound />} />
        </Route>

        <Route path="/loginpage" element={<Loginpage />} />
        <Route path="/resetpassword" element={<ResetPasswordPage />} />

      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
