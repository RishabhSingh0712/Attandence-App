import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const location = useLocation();

  //logout process

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "") {
      const storedUserInfoString = localStorage.getItem("user_info");
      const storedUserInfo = JSON.parse(storedUserInfoString);
      setIsLoggedIn(true);
      setUserInfo(storedUserInfo);
    } else {
      setUserInfo();
      setIsLoggedIn(false);
    }
  }, [location]);

  // Function to handle logout

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_info");
    localStorage.removeItem("attendance_data");

    setIsLoggedIn(false);
  };

  return (
    <header className="shadow sticky z-50 top-0">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link to="/" className="flex items-center sm:w-60 w-36">
            <img
              src="https://mizzlecodes.com/wp-content/uploads/2022/06/logo-sq-rctngl-clr-nblu-20.png"
              className="mr-7 h-8 "
              alt="Logo"
            />
          </Link>
          <div className="flex items-center lg:order-2 ">
            {isLoggedIn ? (
              <NavLink
                onClick={handleLogout}
                className="text-white bg-blue-500 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none "
              >
                Logout
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                className="text-white bg-blue-500 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
              >
                Login
              </NavLink>
            )}
            {isLoggedIn ? (
              <NavLink
                to="/"
                className="block py-2 pr-4 pl-3 duration-200
                 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0"
              >
                {userInfo.name.toUpperCase()}
              </NavLink>
            ) : (
              <div></div>
            )}
          </div>

          <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <NavLink
                  to="/"
                  className="block py-2 pr-4 pl-3 duration-200
                 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0"
                >
                  
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
