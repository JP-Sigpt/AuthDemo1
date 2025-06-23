import { useState } from "react";
import { forgotPassword } from "../services/api.otp";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setMessage("");
		try {
			const res = await forgotPassword(email);
			setMessage(res.data.message || "If an account with that email exists, a password reset link has been sent.");
		} catch (err) {
			setError(err.response?.data?.error || "Something went wrong.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto min-h-screen flex flex-col justify-center items-center">
			<form onSubmit={handleSubmit} className="w-full bg-white p-8 rounded shadow-md flex flex-col gap-4">
				<h2 className="text-2xl font-bold mb-2 text-center">Forgot Password</h2>
				<p className="text-gray-600 text-center mb-4">Enter your email to receive a password reset link.</p>
				<input
					type="email"
					className="border p-2 rounded w-full"
					placeholder="Email address"
					value={email}
					onChange={e => setEmail(e.target.value)}
					required
				/>
				<button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600" disabled={loading}>
					{loading ? "Sending..." : "Send Reset Link"}
				</button>
				{message && <p className="text-green-600 text-center">{message}</p>}
				{error && <p className="text-red-500 text-center">{error}</p>}
			</form>
		</div>
	);
};

export default ForgotPasswordPage; 