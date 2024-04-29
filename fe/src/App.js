import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Components for different routes
import Navbar from "./Components/Pages/Navbar";
// import Empnamemenu from "./Components/Pages/Empnamemenu";
import Home from "./Components/Layouts/Home";
import Loginpage from "./Components/Pages/Loginpage";
import ResetPasswordPage from "./Components/Pages/ResetPage";
import PrivateComponent from "./Components/Pages/PrivateComponent";
import Alldetails from "./Components/Layouts/Alldetails";
import Allemployee from "./Components/Pages/Allemployee";
import Empprofile from "./Components/Pages/Empprofile";
import Userdashboard from "./Components/Layouts/Userdashboard";
// import Empdashmenu from "./Components/Pages/Empdashmenu";
import Updateprofile from "./Components/Pages/Updateprofile";
import PageNotFound from "./Components/Pages/PageNotFound";
import Projects from "./Components/Pages/Projects";



function App() {
  return (
    <Router>
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
                <Userdashboard /> <Navbar />
              </>
            }
          />

          <Route
            path="/allemployee"
            element={
              <> <Allemployee /> <Navbar /></>
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
          {/* <Route
            path="/alldetails"
            element={
              <>
                <Alldetails /> <Navbar />{" "}
              </>
            }
          /> */}
          <Route
            path="/alldetails/:id"
            element={
              <>
                <Alldetails /> <Navbar />
              </>
            }
          />
          {/* <Route path="/empnamemenu" element={<Empnamemenu />} /> */}
          {/* <Route path="/empdashmenu" element={<Empdashmenu />} /> */}
          <Route
            path="/updateprofile/:id"
            element={
              <>
                <Updateprofile /> <Navbar />
              </>
            }
          />
          <Route
            path="/projects"
            element={
              <> <Projects /> <Navbar /> </>
            }
          />
        </Route>
        <Route path="/loginpage" element={<Loginpage />} />
        <Route path="/resetpassword" element={<ResetPasswordPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
