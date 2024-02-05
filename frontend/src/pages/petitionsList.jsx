import React from "react";
import "../styles/petitionsList.css";
import Navbar from "../components/navbar";
import { useGetAllPetitionsQuery } from "../redux rtk/apiSlice";

export default function PetitionsList() {
  const {
    data: petitions,
    error: petitionsError,
    isSuccess
  } = useGetAllPetitionsQuery();

  const handleCardClick = (title) => {
    localStorage.setItem("title", title);
    window.location.href = "/petition";
  };
  return (
    <>
      <Navbar />
      <div className="petionsList-container">
        <div className="petionsList">
          {isSuccess && petitions.length === 0 && (
            <div className="noPetitonContainer">
              There is no Petition Create at least one
            </div>
          )}
          {petitions?.map((petition, index) => {
            return (
              <div
                className="petion-card"
                onClick={() => handleCardClick(petition.Title)}>
                <div className="petion-card-header">
                  <img src="paper.png" alt="" />
                </div>
                <div className="petion-card-body">
                  <p>{petition.Title}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="button-container">
          <button
            onClick={() => {
              window.location.href = "/create-petition";
            }}>
            Create
          </button>
        </div>
      </div>
    </>
  );
}
