import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import "quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import "../styles/petition.css";
import {
  useSignPetitionMutation,
  useGetAllSignatoriesQuery
} from "../redux rtk/apiSlice";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Petition() {
  let title = localStorage.getItem("title");
  const [addSignature, { error: addSignatureError }] =
    useSignPetitionMutation();
  const { data: signatories, error: signatoriesError } =
    useGetAllSignatoriesQuery(title);
  const [textArea, setTextArea] = useState(null);

  useEffect(() => {
    const element = document.getElementById("editor");
    setTextArea(element);
  }, []);

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
          theme: "light"
        });

        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Unable to sign", {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light"
        });
      });
  };

  let socket;
  // const textArea = document.getElementById("editor");
  function connectWebSocket() {
    socket = new WebSocket(
      `ws://localhost:3033/ws?document=${title}&Latitude=50&Longitude=80`
    );

    socket.onopen = function () {
      console.log("WebSocket connection established.");
    };

    socket.onmessage = function (event) {
      console.log("Received message:", event.data);
      if (textArea) {
        textArea.value = event.data;
      }
    };

    socket.onerror = function (error) {
      console.error("WebSocket error:", error);
    };
    socket.onclose = function () {
      console.log("WebSocket connection closed. Reconnecting...");
      setTimeout(connectWebSocket, 200); // Attempt to reconnect after 2 seconds
    };
  }

  connectWebSocket();

  textArea?.addEventListener("input", function (event) {
    const text = event.target.value;
    console.log("About to send:", text);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(text);
    } else {
      console.warn("WebSocket not in OPEN state. Unable to send data.");
      connectWebSocket();
    }
    // socket.send(text);
  });

  return (
    <div>
      <ToastContainer />

      <Navbar />
      <div className="petiton-container">
        <div className="petition-text-box">
          <textarea id="editor" cols="80" rows="20"></textarea>
        </div>
        <div className="sign-petion">
          <span>Do you want to sign the petition ?</span>
          <button onClick={handleSign}>Yes</button>
        </div>
        <div className="signed-petion-list">
          <p>The Following Students Have Signed :- </p>
          <ul>
            {signatories?.map((item, index) => {
              return (
                <li>
                  {item.FirstName} {item.LastName} , {item.Email}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
