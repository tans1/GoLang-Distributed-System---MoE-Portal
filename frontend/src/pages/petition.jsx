import React, { useEffect } from "react";
import Navbar from "../components/navbar";
import {
  useSignPetitionMutation,
  useGetAllSignatoriesQuery,
} from "../redux rtk/apiSlice";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CollaborativeTextEditor from "./CollaborativeTextEditor";
import "../styles/petition.css"

export default function Petition() {
  let title = localStorage.getItem("title");
  const [addSignature, { error: addSignatureError }] =
    useSignPetitionMutation();
  const { data: signatories, error: signatoriesError } =
    useGetAllSignatoriesQuery(title);

  const handleSign = () => {
    let token = localStorage.getItem("token");
    let decodedToken = jwtDecode(token);
    addSignature({ PetitionName: title, UserId: decodedToken.user_id })
      .unwrap()
      .then((res) => {
        toast.success("Signed successfully", {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((error) => {
        // console.log(error);
        toast.error("Unable to sign", {
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
  console.log(signatories)

  return (
    <div >
      <ToastContainer />

      <Navbar />
      <div className="petition-container">
        <h1>{title} Petition</h1>
      <CollaborativeTextEditor title={title} />
        <div className="sign-petition">
          <span>Do you want to sign the petition?</span>
          <button onClick={handleSign} className="sign-petition-button">Yes</button>
        </div>
        <div className="signed-petition-list">
          <p>The following students have signed this petition:- </p>
          <ul>
            {signatories?.map((item, index) => (
              <li key={index}>
                {item.Email}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
