import React, { useState } from "react";
import { verifyOtp, verifyLoginOtp } from "../services/api.otp.js";
import PropTypes from "prop-types";

const OtpVerificationForm = ({ email, isLoginOtp = false }) => {
	const [otp, setOtp] = useState(new Array(6).fill(""));
	const [message, setMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleOtpChange = (element, index) => {
		if (isNaN(element.value)) return;
		setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
		if (element.nextSibling && element.value) {
			element.nextSibling.focus();
		}
	};

	const handleOtpVerify = async (e) => {
		e.preventDefault();
		const otpValue = otp.join("");
		if (otpValue.length !== 6) {
			setErrorMessage("Please enter a valid 6-digit OTP");
			return;
		}

		setIsLoading(true);
		try {
			const apiCall = isLoginOtp ? verifyLoginOtp : verifyOtp;
			const response = await apiCall({ email, otp: otpValue });

			setMessage("OTP verified successfully!");
			setErrorMessage("");

			// TODO: Navigate or handle success
		} catch (err) {
			setErrorMessage(err.response?.data?.error || "OTP verification failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleOtpVerify}>
			<div style={{ display: "flex", gap: "0.5rem" }}>
				{otp.map((data, index) => (
					<input
						key={index}
						type="text"
						maxLength="1"
						value={data}
						onChange={(e) => handleOtpChange(e.target, index)}
						onFocus={(e) => e.target.select()}
						disabled={isLoading}
						required
						style={{ width: "2rem", textAlign: "center", fontSize: "1.25rem" }}
					/>
				))}
			</div>
			{message && <p style={{ color: "green" }}>{message}</p>}
			{errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
			<button type="submit" disabled={isLoading}>
				{isLoading ? "VERIFYING..." : "VERIFY OTP"}
			</button>
		</form>
	);
};

OtpVerificationForm.propTypes = {
	email: PropTypes.string.isRequired,
	isLoginOtp: PropTypes.bool,
};

export default OtpVerificationForm;
