import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import "quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import "../styles/petition.css";
import {
  useSignPetitionMutation,
  useGetAllSignatoriesQuery
} from "../redux rtk/apiSlice";

export default function Petition() {
  let title = localStorage.getItem("title");
  const [addSignature, { error: addSignatureError }] =
    useSignPetitionMutation();
  const { data: signatories, error: signatoriesError } =
    useGetAllSignatoriesQuery(title);
  var modules = {
    toolbar: [
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        {
          color: [
            "#000000",
            "#e60000",
            "#ff9900",
            "#ffff00",
            "#008a00",
            "#0066cc",
            "#9933ff",
            "#ffffff",
            "#facccc",
            "#ffebcc",
            "#ffffcc",
            "#cce8cc",
            "#cce0f5",
            "#ebd6ff",
            "#bbbbbb",
            "#f06666",
            "#ffc266",
            "#ffff66",
            "#66b966",
            "#66a3e0",
            "#c285ff",
            "#888888",
            "#a10000",
            "#b26b00",
            "#b2b200",
            "#006100",
            "#0047b2",
            "#6b24b2",
            "#444444",
            "#5c0000",
            "#663d00",
            "#666600",
            "#003700",
            "#002966",
            "#3d1466",
            "custom-color"
          ]
        }
      ]
    ]
  };

  console.log(signatories)
  var formats = [
    "header",
    "height",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "color",
    "size"
  ];

  const socket = new WebSocket(
    `ws://10.5.227.67:8080/ws?document=${title}&Latitude=50&Longitude=80`
  );

  const textArea = document.getElementById("editor")
  socket.onmessage = function (event) {
    textArea.value = event.data;



    // const textArea = document.querySelector(".ql-editor p");
    // textArea.textContent = event.data;
    // var div = document.createElement("div");
    // div.innerHTML = event.data;
    // var textPart = div.textContent || div.innerText;
    // textArea.textContent = textPart.split('').reverse().join('');
  };
  textArea.addEventListener("input", function (event) {
    const text = event.target.value;
    const insertedText = textArea.value
    console.log(insertedText,"About to send")
    socket.send(insertedText);            
});
  const handleProcedureContentChange = (content) => {
    console.log(content);
    var div = document.createElement("div");
    div.innerHTML = content;
    var textPart = div.textContent || div.innerText;
    socket.send(textPart);
  };

  const handleSign = () => {
    addSignature({ PetitionName: title, UserId: 1 })
      .unwrap()
      .then((res) => {
        console.log("signed");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <Navbar />
      <div className="petiton-container">
        <div className="petition-text-box">
          {/* <ReactQuill
            theme="snow"
            modules={modules}
            formats={formats}
            placeholder="write your content ...."
            onChange={handleProcedureContentChange}
            style={{ height: "100%" }}></ReactQuill> */}
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
