import React from "react";
import Navbar from "../components/navbar";
import "quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import "../styles/petition.css";
export default function Petition() {
  var modules = {
    toolbar: [
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      // [{ list: "ordered" }, { list: "bullet" }],
      // ["link", "image"],
      // [
      //   { list: "ordered" },
      //   { list: "bullet" },
      //   { indent: "-1" },
      //   { indent: "+1" },
      //   { align: [] }
      // ],
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
  var dummyData = [
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
    { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
    { firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com' },
    { firstName: 'Alice', lastName: 'Williams', email: 'alice.williams@example.com' },
];
  var formats = [
    "header",
    "height",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    // "list",
    "color",
    // "bullet",
    // "indent",
    // "link",
    // "image",
    // "align",
    "size"
  ];

  const handleProcedureContentChange = (content) => {
    var div = document.createElement("div");
    div.innerHTML = content;
    var textPart = div.textContent || div.innerText;

    console.log(textPart);
  };
  
  // const textArea = document.querySelector(".ql-editor p")
  // textArea.textContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure consequuntur similique praesentium, eos necessitatibus excepturi omnis modi sed dolor ducimus!";
  return (
    <div>
      <Navbar />
      <div className="petiton-container">
        <div className="petition-text-box">
          <ReactQuill
            theme="snow"
            modules={modules}
            formats={formats}
            placeholder="write your content ...."
            onChange={handleProcedureContentChange}
            style={{ height: "100%" }}></ReactQuill>
        </div>
        <div className="sign-petion">
          <span>Do you want to sign the petition ?</span> 
          <button>Yes</button>
        </div>
        <div className="signed-petion-list">
          <p>The Following Students Have Signed :- </p>
          <ul>
            {
              dummyData.map((item, index) => {
                return <li>{item.firstName} {item.lastName} , {item.email}</li>
              })
            }
          </ul>
        </div>
      </div>
    </div>
  );
}
