import React, { useState } from "react";
import "../styles/petitionCreation.css";
import { useCreatePetitionMutation } from "../redux rtk/apiSlice";


export default function PetitionCreation() {
  const [title, setTitle] = useState("");
  const [addPetition, { error: addPetitionError }] =
    useCreatePetitionMutation();
  const handleSubmit = async () => {
    const data = {
      Title: title,
      OwnerId: 1
    };

    await addPetition(data)
      .unwrap()
      .then((res) => {
        localStorage.setItem("title", title);
        window.location.href = "/petition";
      })
      .catch((error) => {
        console.log(error);
      });

  };
  return (
    <>
      <div className="body-container">
        <div className="petioncreation-container">
          <label className="form-label" htmlFor="title">
            Title
          </label>
          <input
            className="form-input"
            type="text"
            placeholder="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button className="form-submit" onClick={handleSubmit}>
            Create
          </button>
        </div>
      </div>
    </>
  );
}
