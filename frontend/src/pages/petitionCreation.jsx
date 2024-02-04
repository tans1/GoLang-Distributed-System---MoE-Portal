import React, { useState } from "react";
import "../styles/petitionCreation.css";
import { useCreatePetitionMutation } from "../redux rtk/apiSlice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
        toast.error('Failed to create', {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          
        });
      });

  };
  return (
    <>
    <ToastContainer />
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
