import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<{
  element: React.ReactNode;
}> = ({ element }) => {
  const isLoggedIn = localStorage.getItem("token");
  return (
    <React.Fragment>
      {isLoggedIn ? <>{element}</> : <Navigate to="/" replace />}
    </React.Fragment>
  );
};

export default ProtectedRoute;
