import { useLocation, useNavigate } from "react-router-dom";
import VerifyModal from "../components/VerifyModal";
import { useSession } from "../contexts/SessionContext";




const VerifyPage = () => {
	const { login } = useSession();
	const location = useLocation();
	const navigate = useNavigate();
	const { email, method, sessionId } = location.state || {};

	const handleClose = () => navigate(-1);
	const handleVerify = (data) => {
		if (data.accessToken && data.refreshToken && data.user) {
			login(data.accessToken, data.refreshToken, data.sessionId, data.user);
			navigate("/");
		}
	};

	if (!email || !method || !sessionId) {
		return <div>Error: Missing verification data</div>;
	}


	return (
		<VerifyModal
			handleClose={handleClose}
			email={email}
			method={method}
			onVerify={handleVerify}
			sessionId={sessionId}
		/>
	);
};

export default VerifyPage;