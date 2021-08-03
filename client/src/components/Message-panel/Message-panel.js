/* eslint-disable */
import React from "react";
import "./Message-panel.css";

const MessagePanel = ({ user, inputFun }) => {
  const [input, setInput] = React.useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    inputFun(input);
    setInput("");
  };

  const displaySender = (message, index) => {
    return (
      index === 0 ||
      user.messages[index - 1].fromSelf !== user.messages[index].fromSelf
    );
  };

  const isValid = () => {
    return input.length > 0;
  };

  return (
    <div className="rightPanel">
      <div className="header"></div>
      {user ? (
        <>
          <ul className="messages">
            {user.messages.map((message) => (
              <li key={message} className="message">
                {message.content}
              </li>
            ))}
          </ul>
          <form onSubmit={onSubmit}>
            <textarea
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={onSubmit} disabled={!isValid()}>
              Send
            </button>
          </form>
        </>
      ) : null}
    </div>
  );
};

export default MessagePanel;
