/* eslint-disable */
import React, { useEffect, useState } from "react";
import Chat from "./components/Chat/Chat";
import socket from "./socket.io";

const App = () => {
  const [usernameAlreadySelected, setUsernameAlreadySelected] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        setUsernameAlreadySelected(false);
      }
    });

    return () => {
      socket.off("connect_error");
    };
  }, []);

  const submit = () => {
    setUsernameAlreadySelected(true);
    socket.auth = { username };
    socket.connect();
  };

  return (
    <div className="App">
      {usernameAlreadySelected ? (
        <>
          <Chat />
        </>
      ) : (
        <>
          <h1>Enter username</h1>
          <input type="text" onChange={(e) => setUsername(e.target.value)} />
          <button type="button" onClick={submit}>
            Submit
          </button>
        </>
      )}
    </div>
  );
};

export default App;
