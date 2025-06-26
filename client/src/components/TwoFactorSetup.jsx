import React from "react";
import { useState } from "react";
import { HiOutlineQrcode } from "react-icons/hi";
import { TbCopy } from "react-icons/tb";
import TextHeader from "../components/TextHeader";

// eslint-disable-next-line react/prop-types
const TwoFactorSetup = ({ qrImageUrl, secret, onContinue, onConfirm, loading }) => {
  // const [isConfirmed, setIsConfirmed] = useState(false);

  const copyClipboard = async () => {
    await navigator.clipboard.writeText(secret || "");
  };

  // const handleConfirm = () => {
  //   setIsConfirmed(true);
  //   if (onConfirm) onConfirm(); // This will update isSetupConfirmed in parent
  // };

  return (
    <section className="w-[320px] sm:w-[400px] lg:w-[500px] relative py-5">
      <div className="text-black">
        <TextHeader
          title="Turn on 2-Step Verification"
          subtitle="Open authenticator app and choose to scan QR code"
          icon={HiOutlineQrcode}
          variant="blue-500"
        />

        <div className="p-3">
          <div className="flex justify-center">
            {loading ? (
              <div className="mb-4 w-[230px] h-[200px] p-10 border rounded-md bg-slate-100"></div>
            ) : qrImageUrl ? (
              <img
                src={qrImageUrl}
                alt="Scan this QR code with your authenticator app"
                className="mb-4 w-[50%] border rounded-md"
              />
            ) : (
              <p className="text-red-500">Failed to load QR code</p>
            )}
          </div>
          <div className="flex items-center mt-3 mb-3">
            <div className="border-t border-1 border-gray-200 flex-grow"></div>
            <p className="text-gray-600 text-sm font-light px-2">
              OR enter the code manually
            </p>
            <div className="border-t border-1 border-gray-200 flex-grow"></div>
          </div>
          <div className="mb-6 flex items-center justify-center gap-2">
            <input
              readOnly
              value={secret || ""}
              className="w-[250px] md:w-[300px] lg:w-[350px] font-mono block rounded-lg bg-slate-50 p-2 border-2 border-gray-200"
            />
            <div
              className="bg-slate-50 p-2.5 text-gray-700 border-2 border-gray-200 rounded-md hover:text-gray-500 cursor-pointer"
              onClick={copyClipboard}
            >
              <TbCopy />
            </div>
          </div>
          <button
            className="w-full p-2 mt-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300"
            onClick={onContinue}
            disabled={!qrImageUrl || loading}
          >
            Continue to Verification
          </button>
        </div>
      </div>
    </section>
  );
};

export default TwoFactorSetup;
