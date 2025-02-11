import React, { useState } from "react";
import * as XLSX from "xlsx";
import whisperAi from "../assets/convoai.png";
import { motion } from "framer-motion";
import phoneIcon from "../assets/phone_call.jpg";
import axios from "axios";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { FaPhoneAlt } from "react-icons/fa";
import Papa from "papaparse";
import convoi_bg from "../assets/office.webp";

function AIDial() {
  const [isCalling, setIsCalling] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [fromNumber, setFromNumber] = useState("");
  const [language, setLanguage] = useState("en");

  const handleCallClick = async () => {
    setIsCalling(true);
    if (!phoneNumber) {
      setPopupMessage(
        !phoneNumber
          ? "Please enter a valid phone number."
          : "Please select a Caller ID."
      );
      setShowPopup(true);
      return;
    }

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
    setPopupMessage("Processing your file...");
    setShowPopup(true);

    const file = e.target.files[0];
    if (!file) {
      setPopupMessage("No file selected. Please upload a valid file.");
      setShowPopup(true);
      setIsCalling(false);
      return;
    }

    let phoneNumbers: string[] = [];

    try {
      if (file.type === "text/csv") {
        await new Promise((resolve) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result: any) => {
              phoneNumbers = result.data.map((row: any) => row.phone_number).filter(Boolean);
              resolve(null);
            },
          });
        });
      } else if (file.type.includes("spreadsheet")) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        phoneNumbers = jsonData.map((row: any) => String(row.phone_number)).filter(Boolean);
      } else {
        setPopupMessage("Invalid file format. Please upload a CSV or XLSX file.");
        setShowPopup(true);
        setIsCalling(false);
        return;
      }

      // ✅ Convert numbers to correct format
      phoneNumbers = phoneNumbers.map((num: string) => (num.startsWith("92") ? num : "92" + num));
      const validNumbers = phoneNumbers.filter((num: string) => /^\d{12}$/.test(num));

      if (!fromNumber) {
        setPopupMessage("Please select a Caller ID.");
        setShowPopup(true);
        setIsCalling(false);
        return;
      }

      const response = await axios.post(
        "https://call-maker-api-547752509861.asia-south1.run.app/bulk-call",
        { phone_numbers: validNumbers, from_number: fromNumber },
        { headers: { "Content-Type": "application/json" } }
      );

      setPopupMessage("Calls successfully initiated.");
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(response?.data?.message));
    } catch (error) {
      console.error("Error:", error);
      setPopupMessage("Failed to process the file. Please try again.");
      setShowPopup(true);
    }

    setIsCalling(false);
    e.target.value = "";
  };


  return (
    <motion.div
      className="flex flex-col justify-between min-h-screen text-[#00A3A3] px-8 py-8 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.65)), url(${convoi_bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {showPopup && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
        >
          <motion.div
            className="bg-white text-white rounded-xl p-6 max-w-md w-full shadow-xl"
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", duration: 0.7, bounce: 0.2 }}
          >
            <p className="text-center mb-6 text-lg font-medium text-black">{popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="w-full py-3 bg-[#00A3A3] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              OK
            </button>
          </motion.div>
        </motion.div>
      )}

      <motion.header
        className="flex justify-between items-center mb-10 relative z-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div></div>

        <label
          htmlFor="bulkUpload"
          className="bg-[#00A3A3] text-white font-semibold py-2 px-6 rounded-full text-sm shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer"
        >
          📤 Bulk Upload
        </label>
        <input id="bulkUpload" type="file" accept=".csv, .xlsx" className="hidden" onChange={handleFileUpload} />
      </motion.header>

      <motion.main
        className="flex flex-col justify-center items-center flex-grow gap-1 -mt-16 relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <img
          src={whisperAi}
          alt="Whisper AI"
          className="h-[12rem] w-80 object-contain animate-slow-bounce relative z-10"
        />

        <div className="w-full max-w-md space-y-6 bg-[#012121]/80 p-8 rounded-xl border border-[#00A3A3]/20 backdrop-blur-lg shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">
            Make a Call
          </h2>

          <div className="space-y-6">
            <div className="form-group">
              <label className="block text-white font-medium mb-2">
                📱 Phone Number
              </label>
              <PhoneInput
                country={'pk'}
                value={phoneNumber}
                onChange={(value) => setPhoneNumber(value)}
                inputStyle={{
                  width: '100%',
                  background: '#012121',
                  color: '#00A3A3',
                  border: '1px solid #00A3A3',
                  borderRadius: '0.5rem',
                  height: '48px'
                }}
                dropdownStyle={{
                  background: '#012121',
                  color: '#00A3A3',
                }}
                buttonStyle={{
                  background: '#012121',
                  borderRadius: '0.5rem 0 0 0.5rem',
                  border: '1px solid #00A3A3',
                  borderRight: 'none'
                }}
              />
            </div>
            <div className="form-group">
              <label className="block text-white font-medium mb-2">
                🌐 Language
              </label>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#012121] text-[#00A3A3] py-3 px-4 rounded-lg border border-[#00A3A3] focus:outline-none focus:ring-2 focus:ring-[#00A3A3] appearance-none transition-all"
                >
                  <option value="en">English</option>
                  <option value="ur">Urdu</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">⬇️</div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={handleCallClick}
                disabled={isCalling}
                className={`bg-[#00A3A3] text-white font-bold py-3 px-8 md:py-4 md:px-10 rounded-lg text-base md:text-xl 
            hover:bg-[#008080] hover:shadow-[0_0_15px_rgba(0,163,163,0.5)] 
            hover:scale-105 transition-all duration-300 
            active:scale-95 active:shadow-inner
            border-2 border-transparent hover:border-[#00A3A3] ${isCalling ? "animate-pulse" : "hover:scale-110 hover:shadow-xl"
                  }`}
              >
                <FaPhoneAlt className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </motion.main>

      <motion.footer
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="text-center mt-8 text-white relative z-10"
      >
        <p className="text-gray-400 text-sm">Powered by Venture Data AI</p>
      </motion.footer>
    </motion.div>
  );
}

export default AIDial;
