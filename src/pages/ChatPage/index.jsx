import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "@services/axios";
import Loader from "@components/Loader";
import styles from "./ChatPage.module.scss";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { AiOutlinePaperClip } from "react-icons/ai";
import { calculateUnseenMessages } from "@utils/utils";

export default function ChatPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [activeChatMessages, setActiveChatMessages] = useState([]);
  const [activeChatId, setActiveChatId] = useState("");
  const [activeChatIsLoading, setActiveChatIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [messageIsLoading, setMessageIsLoading] = useState(false);
  const [error, setError] = useState("");

  const user = useSelector((state) => state.user.user);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function fetchChats() {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get(`/chat/user/${user._id}`, {
          headers: { Authorization: localStorage.getItem("token") }
        });
        setChats(res.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchChats();
  }, [user._id]);

  useEffect(() => {
    async function fetchChat() {
      try {
        setActiveChatIsLoading(true);
        const res = await axiosInstance.get(`/chat/${activeChatId}`, {
          headers: { Authorization: localStorage.getItem("token") }
        });
        setActiveChat(res.data);
        setActiveChatMessages(res.data.messages);
      } catch (error) {
        setError(error.message);
      } finally {
        setActiveChatIsLoading(false);
      }
    }
    if (activeChatId) {
      fetchChat();
    }
  }, [activeChatId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChatMessages]);

  async function addMessage(e) {
    e.preventDefault();
    try {
      setMessageIsLoading(true);
      const formData = new FormData();
      formData.append("message", message);
      if (file) formData.append("file", file);

      const res = await axiosInstance.post(`/chat/${activeChatId}`, formData, {
        headers: { Authorization: localStorage.getItem("token") }
      });
      setActiveChatMessages(res.data.messages);
      setMessage("");
      setFile(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setMessageIsLoading(false);
    }
  }

  function handleKeyPress(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addMessage(e);
    }
  }

  if (isLoading) {
    return <Loader isFullPage={true} />;
  }

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const groupedMessages = activeChatMessages.reduce((acc, message) => {
    const date = formatDate(message.createdAt);
    if (!acc[date]) acc[date] = [];
    acc[date].push(message);
    return acc;
  }, {});

  function handleChatItemClick(chatId) {
    setActiveChatId(chatId);
    setChats((prevChats) =>
      prevChats.map((chat) => (chat._id === chatId ? { ...chat, messagesSeen: true } : chat))
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.chats}>
        {chats.map((item) => (
          <div
            key={item._id}
            className={classNames(styles.chatItem, {
              [styles.activeChatItem]: item._id === activeChatId
            })}
            onClick={() => handleChatItemClick(item._id)}>
            <div className={styles.details}>
              <div>
                <h4>{item.dormId.name}</h4>
                <p>{item.lastMessage}</p>
              </div>
              {!item.messagesSeen && calculateUnseenMessages(item.messages, true) > 0 && (
                <span>{calculateUnseenMessages(item.messages, true)}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      {activeChatId && (
        <div className={styles.chat}>
          {activeChatIsLoading ? (
            <Loader isRed={true} />
          ) : (
            activeChat && (
              <div className={styles.wrapper}>
                <div className={styles.header}>{activeChat.dormId.name}</div>
                <div className={styles.body}>
                  <div className={styles.messages}>
                    {Object.keys(groupedMessages).map((date) => (
                      <div key={date}>
                        <div className={styles.dateGroup}>{date}</div>
                        {groupedMessages[date].map((item) => (
                          <div
                            key={item._id}
                            className={classNames(styles.messageWrapper, {
                              [styles.managerMessage]: item.isManager,
                              [styles.userMessage]: !item.isManager
                            })}>
                            <div className={styles.message}>
                              <p>{item.message}</p>
                              {item.fileUrl && (
                                <Link to={item.fileUrl} target="_blank" className={styles.fileLink}>
                                  {item.fileName || "File"}
                                </Link>
                              )}
                              <span className={styles.timestamp}>
                                {new Date(item.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                <form className={styles.form} onSubmit={addMessage}>
                  <div className={styles.textareaContainer}>
                    <label className={styles.attachIcon}>
                      <AiOutlinePaperClip size={24} />
                      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                    </label>
                    <textarea
                      placeholder="Enter a message..."
                      className={styles.textarea}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}></textarea>
                  </div>
                  {file && <p className={styles.attachedFile}>Attached file: {file.name}</p>}
                  <button type="submit" disabled={messageIsLoading}>
                    {messageIsLoading ? <Loader /> : "Send"}
                  </button>
                </form>
                {error && <p className={styles.error}>{error}</p>}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
