import { createBrowserRouter } from "react-router-dom";
import ProtectedUserRoute from "./components/ProtectedUserRoute";
import Setup2FAuth from "./pages/Setup2FAuth";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Error from "./pages/Error";
import RegisterPage from "./pages/RegisterPage";
import Layout from "./components/Layout";
import VerifyPage from "./pages/VerifyPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
        errorElement: <Error />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
        errorElement: <Error />,
      },
      {
        path: "/setup-2fa",
        element: <Setup2FAuth />,
        errorElement: <Error />,
      },
      {
        path: "/verify",
        element: <VerifyPage />,
        errorElement: <Error />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
        errorElement: <Error />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
        errorElement: <Error />,
      },
      {
        element: <ProtectedUserRoute />,
        children: [
          {
            path: "/",
            element: <HomePage />,
            errorElement: <Error />,
          },

        ],
      },
    ],
  },
]);

export default router;