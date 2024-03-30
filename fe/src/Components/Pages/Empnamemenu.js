import React, { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { ClipLoader } from 'react-spinners';

export default function Empnamemenu() {
  const [listname, setListname] = React.useState([]);
  const [loading, setLoading] = React.useState(true); // Add loading state

  const params = useParams();

  useEffect(() => {
    getListname();
  }, []);

  const getListname = async () => {
    try {
      let result = await fetch(`${process.env.REACT_APP_API_KEY}/listname`);
      result = await result.json();
      setListname(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  return (
    <>
      <div
        className="menu wid-30 border-end ms-0"
        style={{ height: "92vh", justifyContent: "start" }}
      >
        <div className=" px-2">
          <form action="px-2">
            <input
              className="mt-3 p-1 px-2 wid-100"
              type="text"
              placeholder="Search here"
            />
          </form>
        </div>
        {loading ? ( // Display loader if loading state is true
          <div className="loader-container">
            <ClipLoader
              size={35}
              color={"#36D7B7"}
              loading={loading}
            />
          </div>
        ) : (
          <>
           {listname.length > 0 ? (
              listname
                .filter(item => item.role !== 'admin') // Filter out admins
                .map((item, index) => (
                <div className="pe-0 allemp" key={index}>
                <NavLink 
                  to={"/alldetails/" + item._id} 
                  className="navlink-custom"
                  activeClassName="active-link" // Add activeClassName for active state
                >
                  <div className="menudiv">
                    <div className="menuimg">
                      {item.profileimage === "" || item.profileimage == null ? (
                        <img className="profimage" src={"/empimg.jpg"} alt="Photo" />
                      ) : (
                        <img className="profimage" src={item.profileimage} alt="Photo" />
                      )}
                    </div>
                    <div className="menuname">{item.name}</div>
                  </div>
                </NavLink>
              </div>
              
              ))
            ) : (
              <h6>Record not found..</h6>
            )}
          </>
        )}
      </div>
    </>
  );
}
