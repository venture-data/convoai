import React, { useState } from "react";
import * as XLSX from "xlsx";
import whisperAi from "../assets/whisper_ai.png";
import phoneIcon from "../assets/phone_call.jpg";
import axios from "axios";
import PhoneInput, { Value } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Papa from "papaparse";

function AIDial() {
  const [isCalling, setIsCalling] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [fromNumber, setFromNumber] = useState("");

  const handleCallClick = async () => {
    if (!phoneNumber || !fromNumber) {
      setPopupMessage(
        !phoneNumber
          ? "Please enter a valid phone number."
          : "Please select a Caller ID."
      );
      setShowPopup(true);
      return;
    }

    setIsCalling(true);
    const utterance = new SpeechSynthesisUtterance("Calling");
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);

    const formData = new FormData();
    formData.append("call_to", phoneNumber);
    formData.append("from_number", fromNumber);
    try {
      const response = await axios.post(
        "https://call-maker-api-547752509861.asia-south1.run.app/single-call",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      window.speechSynthesis.speak(
        new SpeechSynthesisUtterance(response?.data?.message)
      );
    } catch (error) {
      console.error("Error:", error);
      setPopupMessage("Failed to make the call. Please try again.");
      setShowPopup(true);
    }

    setIsCalling(false);
    setPhoneNumber("");
  };

  const handleFileUpload = async (e: any) => {
    setIsCalling(true);

    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      try {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: async (result: any) => {
            const phoneNumbers = result.data
              .map((row: any) => row.phone_number)
              .filter(Boolean);

            const response = await axios.post(
              "https://call-maker-api-547752509861.asia-south1.run.app/bulk-call",
              { phone_numbers:phoneNumbers,from_number:fromNumber },
              { headers: { "Content-Type": "application/json" } }
            );

            window.speechSynthesis.speak(
              new SpeechSynthesisUtterance(response?.data?.message)
            );
          },
        });
      } catch (error) {
        console.error("Error uploading file:", error);
        setPopupMessage("Failed to upload file. Please try again.");
        setShowPopup(true);
      }
    } else {
      setPopupMessage("Please upload a valid CSV file.");
      setShowPopup(true);
    }

    setIsCalling(false);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col justify-between min-h-screen bg-gradient-to-b from-[#081B33] to-[#2c3e50] text-white px-8 py-8">
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-black rounded-lg p-6 max-w-sm w-full shadow-lg">
            <p className="text-center mb-4">{popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="w-full py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-md transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <header className="flex justify-end items-center mb-8">
        <label
          htmlFor="bulkUpload"
          className="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold py-2 px-6 rounded-full text-sm shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer"
        >
          Bulk Upload
        </label>
        <input
          id="bulkUpload"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileUpload}
        />
      </header>

      <main className="flex flex-col mb-10 justify-center items-center flex-grow gap-8">
        <img
          src={whisperAi}
          alt="Whisper AI"
          className="h-32 w-32 object-contain animate-slow-bounce"
        />
        <div className="w-full max-w-md space-y-4">
          <PhoneInput
            international
            defaultCountry="US"
            value={phoneNumber}
            onChange={(value: Value) => setPhoneNumber(value)}
            className="w-full bg-gray-800 text-black text-lg py-4 px-8 rounded-lg placeholder-gray-400 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
      <div className="flex flex-col w-full max-w-md">
  <label
    htmlFor="fromNumber"
    className="block mb-2 text-gray-300 font-semibold"
  >
    Select Caller ID
  </label>
  <div className="relative">
    <select
      id="fromNumber"
      value={fromNumber}
      onChange={(e) => setFromNumber(e.target.value)}
      className="block w-full bg-gray-800 text-white text-lg py-4 px-4 md:px-6 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all truncate"
    >
      <option value="" disabled>
        Choose a number
      </option>
      <option value="+17753177891">+1 775-317-7891</option>
      <option value="+15512967933">+1 551-296-7933</option>
    </select>
  </div>
</div>

          <div className="flex justify-center mt-8">
            <button
              onClick={handleCallClick}
              disabled={isCalling}
              className={`relative flex items-center justify-center w-16 h-16 rounded-full shadow-lg bg-gradient-to-br from-green-500 to-blue-500 hover:scale-110 transform transition-all ${
                isCalling ? "animate-slow-ping" : "hover:animate-pulse"
              }`}
            >
              <img
                src={phoneIcon}
                alt="Phone Icon"
                className="w-8 h-8 object-contain"
              />
            </button>
          </div>
        </div>
      </main>

      <footer className="text-center">
        <p className="text-gray-300 text-sm">Powered by Venture Data AI</p>
      </footer>

      <style>{`
        @keyframes slow-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes slow-ping {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
        .animate-slow-bounce {
          animation: slow-bounce 2s infinite ease-in-out;
        }
        .animate-slow-ping {
          animation: slow-ping 2s infinite;
        }
      `}</style>
    </div>
  );
}

export default AIDial;
