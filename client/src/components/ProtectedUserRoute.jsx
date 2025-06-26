import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSession } from "../contexts/SessionContext";

const ProtectedUserRoute = () => {
  const { isLogin, isVerified, loading } = useSession();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not logged in at all
  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }

  // For fully protected routes, also check if user is verified (completed MFA)
  // If you want to allow unverified users to access some routes, remove this check
  if (!isVerified) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content
  return <Outlet />;
};

export default ProtectedUserRoute;

// import { Navigate, Outlet } from "react-router-dom";
// import { useSession } from "../contexts/SessionContext";

// const ProtectedUserRoute = () => {
//   const { isLogin, loading } = useSession();

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center text-center h-full w-full bg-gray-100">
//         <div className="flex items-center justify-center text-sm text-gray-600">
//           Loading...
//         </div>
//       </div>
//     );
//   }

//   return <div>{isLogin ? <Outlet /> : <Navigate to={"/login"} />}</div>;
// };

// export default ProtectedUserRoute;


