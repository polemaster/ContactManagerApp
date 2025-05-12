import React from "react";
import { useAuth } from "../contexts/AuthContext";
import NavBarLink from "./NavBarLink";

const NavBar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow flex justify-between items-center">
      <NavBarLink path="/" text="ContactApp" />

      <div className="flex items-center h-full">
        {user ? (
          <>
            <span className="mr-4">Logged in as: {user}</span>
            <button
              onClick={logout}
              className="mr-4 px-3 py-1 bg-red-500 text-lg text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavBarLink path="/login" text="Login" />
            <NavBarLink path="/register" text="Register" />
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
