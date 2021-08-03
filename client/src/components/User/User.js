/* eslint-disable */
import React from "react";
import "./User.css";
const User = ({ user, selected, select }) => {
  const status = () => {
    return user.connected ? "online" : "offline";
  };
  return (
    <div className="user" onClick={() => select(user)}>
      <div className={`description ${selected ? "selected" : ""}`}>
        <div className="name">{user.username}</div>
        <div className="status">{status()}</div>
        {user.hasNewMessages ? <div className="new-messages">!</div> : null}
      </div>
    </div>
  );
};

export default User;
