import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api.otp";

const ResetPasswordPage = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const userId = searchParams.get("id");
	const token = searchParams.get("token");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setMessage("");
		if (newPassword !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}
		setLoading(true);
		try {
			const res = await resetPassword({ userId, token, newPassword });
			setMessage(res.data.message || "Password reset successfully.");
			setTimeout(() => navigate("/login"), 2000);
		} catch (err) {
			setError(err.response?.data?.error || "Something went wrong.");
		} finally {
			setLoading(false);
		}
	};

	if (!userId || !token) {
		return <div className="text-center mt-20 text-red-500">Invalid or missing reset link.</div>;
	}

	return (
		<div className="max-w-md mx-auto min-h-screen flex flex-col justify-center items-center">
			<form onSubmit={handleSubmit} className="w-full bg-white p-8 rounded shadow-md flex flex-col gap-4">
				<h2 className="text-2xl font-bold mb-2 text-center">Reset Password</h2>
				<input
					type="password"
					className="border p-2 rounded w-full"
					placeholder="New password"
					value={newPassword}
					onChange={e => setNewPassword(e.target.value)}
					required
				/>
				<input
					type="password"
					className="border p-2 rounded w-full"
					placeholder="Confirm new password"
					value={confirmPassword}
					onChange={e => setConfirmPassword(e.target.value)}
					required
				/>
				<button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600" disabled={loading}>
					{loading ? "Resetting..." : "Reset Password"}
				</button>
				{message && <p className="text-green-600 text-center">{message}</p>}
				{error && <p className="text-red-500 text-center">{error}</p>}
			</form>
		</div>
	);
};

export default ResetPasswordPage; 