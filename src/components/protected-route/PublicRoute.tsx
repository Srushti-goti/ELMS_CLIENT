import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute: React.FC<{
  element: React.ReactNode;
}> = ({ element }) => {
  const isLoggedIn = localStorage.getItem("token");
  return (
    <React.Fragment>
      {!isLoggedIn ? <>{element}</> : <Navigate to="/home" />}
    </React.Fragment>
  );
};

export default PublicRoute;
