/* eslint-disable */
import React, { useEffect } from "react";
import socket from "../../socket.io";
import "./Chat.css";
import MessagePanel from "../Message-panel/Message-panel";
import User from "../User/User";

const Chat = () => {
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [users, setUsers] = React.useState([]);

  const onMessage = (content) => {
    if (selectedUser) {
      socket.emit("private message", {
        content,
        to: selectedUser.userID,
      });
      selectedUser.messages.push({
        content,
        fromSelf: true,
      });
    }
  };

  const onSelectUser = (user) => {
    console.log(user);
    setSelectedUser(user);
    user.hasNewMessages = false;
  };

  useEffect(() => {
    socket.on("connect", () => {
      users.forEach((user) => {
        if (user.self) {
          user.connected = true;
        }
      });
    });

    socket.on("disconnect", () => {
      users.forEach((user) => {
        if (user.self) {
          user.connected = false;
        }
      });
    });

    const initReactiveProperties = (user) => {
      user.connected = true;
      user.messages = [];
      user.hasNewMessages = false;
    };

    socket.on("users", (userss) => {
      userss.forEach((user) => {
        user.self = user.userID === socket.id;
        initReactiveProperties(user);
      });
      // put the current user first, and sort by username

      const newArr = users.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
      setUsers(newArr);
    });

    socket.on("user connected", (user) => {
      initReactiveProperties(user);
      setUsers((users) => [...users, user]);
    });

    socket.on("user disconnected", (id) => {
      setUsers((users) =>
        users.map((user) => {
          if (user.userID === id) {
            user.connected = false;
          }
          return user;
        })
      );
    });

    socket.on("private message", ({ content, from }) => {
      setUsers((u) => {
        const newArr = u;
        newArr.map((user) => {
          if (user.userID === from) {
            user.messages.push({
              content,
              fromSelf: false,
            });
          }
          if (user === selectedUser) {
            user.hasNewMessages = true;
          }
          return user;
        });
        return [...newArr];
      });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("users");
      socket.off("user connected");
      socket.off("user disconnected");
      socket.off("private message");
    };
  }, [socket]);

  console.log(users);
  return (
    <div>
      <div className="leftSection">
        {users.map((user) => {
          return (
            <User
              key={user.userID}
              user={user}
              select={() => onSelectUser(user)}
              selected={user === selectedUser}
            />
          );
        })}
      </div>
      <MessagePanel user={selectedUser} inputFun={onMessage} />
    </div>
  );
};

export default Chat;
