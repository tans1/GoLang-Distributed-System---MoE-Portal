import React, { useState } from "react";
import Navbar from "../components/navbar";
import "../styles/resultDisplay.css";
import Lottie from "lottie-react";
import clap from "../clap.json";
import celebration1 from "../celebration1.json";
import celebration3 from "../celebration3.json";
import wine from "../wine.json";
import { useLazyGetResultQuery } from "../redux rtk/apiSlice";

export default function ResultDisplay() {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [getResult, { data, isLoading, error, isSuccess }] =
    useLazyGetResultQuery();
    
  const handleSubmit = () => {
    getResult(registrationNumber);
  };
  console.log("the data is ", data, isLoading, error)
  return (
    <div>
      <Navbar />
      {isSuccess ? (
        <div className="display-container">
          <div className="celebration-one">
            <Lottie animationData={wine} loop={true} className="lottie-wine" />
            <Lottie
              animationData={celebration3}
              loop={true}
              className="lottie-celebration3"
            />
          </div>
          <div className="result-card">
            <div className="profile-pic">
              <img src="man.jpg" alt="" />
            </div>
            <div className="result">
              {data &&
                Object.entries(data.Data).map(([key, value]) => (
                  <div className="single-result-container" key={key}>
                    <div className="result-key">{key}</div>
                    <div className="result-value">{value}</div>
                  </div>
                ))}
            </div>
          </div>
          <div className="celebration-two">
            <Lottie animationData={clap} loop={true} className="lottie-clap" />

            <Lottie
              animationData={celebration1}
              loop={true}
              className="lottie-celebration1"
            />
          </div>
        </div>
      ) : (
        <div className="result-id-container">
          <div className="id-container">
            <div>
              <label htmlFor="registrationNumber" className="form-label">
                Registration Number
              </label>
              <input
                type="text"
                name="registrationNumber"
                className="form-input"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
              />
              <button className="form-submit" onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
