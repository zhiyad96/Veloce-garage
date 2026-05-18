import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Authcontext } from "../Context/Authcontext";




export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(Authcontext);

  if (loading) return <div>Loading...</div>;

  if (user?.role==="admin") return <Navigate to="/dashboard" replace />; 
  if (!user) return <Navigate to="/login" replace />;    

  return children; 
};


export const PublicUserRoute = ({ children }) => {
  const { user, loading } = useContext(Authcontext);

  if (loading) return <div>Loading...</div>;

  if (user?.role === "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};


export const PublicNoAdmin = ({ children }) => {
  const { user, loading } = useContext(Authcontext);

  if (loading) return <div>Loading...</div>;

  if (user?.role === "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};


export const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(Authcontext);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;  
  }

  return children;
};