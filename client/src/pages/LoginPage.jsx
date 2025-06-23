import LoginForm from "../components/LoginForm";
import { motion } from "framer-motion";
import { useSession } from "../contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import TextHeader from "../components/TextHeader";
import { IoMdLogIn } from "react-icons/io";

const LoginPage = () => {
  const { login, accessToken } = useSession();
  const navigate = useNavigate();

  const handleLoginSuccess = (data) => {
    // This stores tokens and user info in context and localStorage
    login(data.accessToken, data.refreshToken, data.sessionId, data.user);

    if (data.user.isVerified) {
      navigate("/");
    } else {
      navigate("/setup-2fa", {
        state: {
          email: data.user.email,
          method: data.method,
          sessionId: data.sessionId,
          accessToken: data.accessToken // <-- pass accessToken here too!
        }
      });
    }
  };

  return (
    <div className="max-w-[350px] sm:max-w-[500px] min-h-[100vh] flex items-center justify-end mx-auto">
      <motion.div
        className="flex-1 flex flex-col justify-center items-center"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", duration: 1 }}
      >
        <div className="shadow-2xl w-full rounded-md border-2 border-slate-50 bg-gradient-to-b from-blue-300/30 via-white to-gray-100 bg-opacity-70 m-2 py-5">
          <TextHeader
            title="Login to your Account"
            subtitle="Welcome back, Please enter your credentials to access your account"
            icon={IoMdLogIn}
            variant="blue-500"
          />
          <div className="p-3">
            <LoginForm onSuccess={handleLoginSuccess} accessToken={accessToken} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;


// import LoginForm from "../components/LoginForm";
// import { motion } from "framer-motion";
// import { useSession } from "../contexts/SessionContext";
// import { useNavigate } from "react-router-dom";
// import { IoMdLogIn } from "react-icons/io";

// const LoginPage = () => {
//   const { login, accessToken } = useSession();
//   const navigate = useNavigate();

//   const handleLoginSuccess = (data) => {
//     login(data.accessToken, data.refreshToken, data.sessionId, data.user);

//     if (data.user.isVerified) {
//       navigate("/");
//     } else {
//       navigate("/setup-2fa", {
//         state: {
//           email: data.user.email,
//           method: data.method,
//           sessionId: data.sessionId,
//           accessToken: data.accessToken
//         }
//       });
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-[#f9fafc] to-[#e9eff5] overflow-hidden">

//       {/* Background Grid */}
//       <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(0,0,0,0.02)_1px,_transparent_1px),linear-gradient(180deg,_rgba(0,0,0,0.02)_1px,_transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

//       {/* Ambient Blurs */}
//       <div className="absolute top-[-10%] left-[-15%] w-[400px] h-[400px] bg-blue-300 opacity-25 rounded-full filter blur-[180px]"></div>
//       <div className="absolute bottom-[-10%] right-[-15%] w-[500px] h-[500px] bg-orange-300 opacity-20 rounded-full filter blur-[200px]"></div>

//       {/* Main Card */}
//       <motion.div
//         className="relative z-10 w-full max-w-lg bg-white/60 backdrop-blur-2xl border border-white/20 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-12 space-y-10 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.01] hover:shadow-[0_30px_60px_rgba(0,0,0,0.25)]"
//         initial={{ opacity: 0, scale: 0.96, y: 40 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         transition={{ type: "spring", stiffness: 80, damping: 14 }}
//       >
//         {/* Logo + Heading */}
//         <div className="flex flex-col items-center space-y-4">
//           <motion.div
//             initial={{ rotateY: 0 }}
//             animate={{ rotateY: 360 }}
//             transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
//           >
//             <IoMdLogIn size={56} className="text-orange-500 drop-shadow-xl" />
//           </motion.div>
//           <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
//             Finance Portal Login
//           </h2>
//           <p className="text-base text-gray-500 text-center max-w-sm">
//             Sign in to securely access your dashboard, portfolios & reports.
//           </p>
//         </div>

//         {/* Login Form */}
//         <LoginForm onSuccess={handleLoginSuccess} accessToken={accessToken} />

//         {/* Footer */}
//         <p className="text-center text-xs text-gray-400 pt-8">
//           © {new Date().getFullYear()} OrangeBlue Finance Corp. All rights reserved.
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export default LoginPage;

