import React, { useEffect } from "react";

function CollaborativeTextEditor({ title }) {
    useEffect(() => {
        let socket;

        function connectWebSocket() {
            
            socket = new WebSocket(`ws://localhost:8080/ws?document=${title}&Latitude=10&Longitude=20`);

            socket.onopen = function () {
                console.log("WebSocket connection established.");
            };

            socket.onmessage = function (event) {
                console.log("Received message:", event.data);
                textArea.value = event.data;
            };

            socket.onerror = function (error) {
                console.error("WebSocket error:", error);
            };

            socket.onclose = function () {
                console.log("WebSocket connection closed. Reconnecting...");
                setTimeout(connectWebSocket, 20); // Attempt to reconnect after 2 seconds
            };
        }

        connectWebSocket();

        const textArea = document.getElementById("editor");

        const handleTextAreaInput = (event) => {
            const text = event.target.value;
            console.log("About to send:", text);
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(text);
          } else {
              console.error("WebSocket connection is not open.");
          }
            // socket.send(text);
        };

        textArea.addEventListener("input", handleTextAreaInput);

        // Cleanup function
        return () => {
            socket.close();
            textArea.removeEventListener("input", handleTextAreaInput);
        };
    }, [title]);

    return (
        <div>
            <textarea id="editor" cols="80" rows="20"></textarea>
        </div>
    );
}

export default CollaborativeTextEditor;
