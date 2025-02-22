import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function EmergencyDetailsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  const [sosActivated, setSosActivated] = useState(false);
  const [sosLoading, setSosLoading] = useState(false);
  const [sosMessage, setSosMessage] = useState("");
  const { id } = useParams();
  const lat = 18.4575775;
  const lon = 73.850721;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://emergencyqr.vercel.app/api/auth/me/${id}`
        );
        if (!response.ok) {
          throw new Error(
            "Failed to load your emergency information. Please try again."
          );
        }
        const data = await response.json();

        setTimeout(() => {
          setUserData(data);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError(
          "Failed to load your emergency information. Please try again."
        );
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    try {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            // lat = latitude;
            // lon = longitude;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

            console.log(lat);
            console.log(lon);
          },
          (error) => {
            console.error("Error getting location:", error.message);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    } catch (err) {
      console.error("Error getting location:", err.message);
    }
  }, []);

  const handleSOS = async () => {
    setSosLoading(true);
    setSosMessage("");

    try {
      const sos = await fetch(
        "https://emergencyqr.vercel.app/api/sos/trigger",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: userData._id,
            location: {
              lat: lat,
              long: lon,
            },
          }),
        }
      );
      const sosData = await sos.json();
      console.log(sosData);
      setTimeout(() => {
        setSosActivated(true);
        setSosMessage(
          "Emergency contacts have been notified of your situation"
        );
        setSosLoading(false);

        // Reset SOS state after 10 seconds
        setTimeout(() => {
          setSosActivated(false);
          setSosMessage("");
        }, 10000);
      }, 2000);
    } catch (err) {
      setSosMessage(
        "Failed to send emergency alerts. Please try again or call emergency services directly."
      );
      setSosLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <svg
              className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Loading your medical information...
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Please wait a moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        {/* SOS Button - Fixed at the top for easy access */}
        <div className="sticky top-4 z-10 mb-6 flex justify-center">
          <button
            onClick={handleSOS}
            disabled={sosLoading || sosActivated}
            className={`px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
              sosActivated
                ? "bg-green-600 text-white ring-green-500 ring-offset-green-200"
                : "bg-red-600 text-white hover:bg-red-700 ring-red-500 ring-offset-red-200"
            } ${sosLoading ? "opacity-80" : ""}`}
          >
            {sosLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending Alerts...
              </span>
            ) : sosActivated ? (
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                SOS Activated
              </span>
            ) : (
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                SOS Emergency
              </span>
            )}
          </button>
        </div>

        {/* SOS Message */}
        {sosMessage && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              sosActivated
                ? "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500"
                : "bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500"
            }`}
          >
            <div className="flex items-center">
              <svg
                className={`w-5 h-5 mr-3 ${
                  sosActivated
                    ? "text-green-500 dark:text-green-400"
                    : "text-red-500 dark:text-red-400"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                {sosActivated ? (
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
              <p
                className={`${
                  sosActivated
                    ? "text-green-700 dark:text-green-300"
                    : "text-red-700 dark:text-red-300"
                } text-sm font-medium`}
              >
                {sosMessage}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 dark:text-red-400 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                {error}
              </p>
            </div>
          </div>
        )}

        {userData && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden mb-6">
            <div className="p-6">
              {/* Header Section */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Emergency Medical Information
                </h1>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Personal Information */}
                <div className="md:col-span-1 space-y-6">
                  {/* QR Code */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center">
                    <div className="bg-white p-3 rounded-lg shadow-md mb-3">
                      <img
                        src={userData.qrCode}
                        alt="Emergency QR Code"
                        className="w-full h-auto"
                      />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      Scan this code to access emergency information
                    </p>
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={() => {
                          /* Download logic */
                        }}
                        className="flex items-center py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(userData.qrCodeUrl);
                        }}
                        className="flex items-center py-1 px-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white text-sm rounded-lg transition-colors"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                        Copy
                      </button>
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                      Personal Info
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Name
                        </p>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {userData.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Blood Type
                        </p>
                        <div className="flex items-center">
                          <span className="inline-flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-bold rounded-full h-7 w-7 mr-2">
                            {userData.bloodType}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Column - Medical Information */}
                <div className="md:col-span-1 space-y-6">
                  {/* Medical Info */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                      Medical Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Medical Conditions
                        </p>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {userData.medicalHistory || "None"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Emergency Contacts */}
                <div className="md:col-span-1 space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                      Emergency Contacts
                    </h3>
                    <div className="space-y-4">
                      {userData.emergencyContacts &&
                      userData.emergencyContacts.length > 0 ? (
                        userData.emergencyContacts.map((contact, index) => (
                          <div
                            key={index}
                            className="bg-white dark:bg-gray-600 p-3 rounded-lg shadow-sm"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-800 dark:text-white">
                                  {contact.name}
                                </p>
                                {contact.relationship && (
                                  <p className="text-sm text-gray-500 dark:text-gray-300">
                                    {contact.relationship}
                                  </p>
                                )}
                              </div>
                              <a
                                href={`tel:${contact.phone}`}
                                className="flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full h-8 w-8"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                  />
                                </svg>
                              </a>
                            </div>
                            <a
                              href={`tel:${contact.phone}`}
                              className="mt-2 text-sm text-gray-600 dark:text-gray-300 flex items-center hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                              {contact.phone}
                            </a>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">
                          No emergency contacts added.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Get Help */}
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-3">
                      Get Help Now
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                      In case of emergency, press the SOS button at the top of
                      the page or call emergency services directly:
                    </p>
                    <a
                      href="tel:911"
                      className="flex items-center justify-center py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors w-full"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      Call Emergency Services
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This information is intended for emergency purposes only.
          </p>
          <a
            href="#"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
