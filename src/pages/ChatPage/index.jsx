import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "@services/axios";
import Loader from "@components/Loader";
import styles from "./ChatPage.module.scss";
import classNames from "classnames";
import { Link } from "react-router-dom";

export default function ChatPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [activeChatMessages, setActiveChatMessages] = useState(null);
  const [activeChatId, setActiveChatId] = useState("");
  const [activeChatIsLoading, setActiveChatIsLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [messageIsLoading, setMessageIsLoading] = useState(false);

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    async function fetchChats() {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get(`/chat/user/${user._id}`, {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });
        setChats(res.data);
      } catch (error) {
        alert(error.message);
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
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });
        setActiveChat(res.data);
        setActiveChatMessages(res.data.messages);
      } catch (error) {
        alert(error.message);
      } finally {
        setActiveChatIsLoading(false);
      }
    }
    if (activeChatId) {
      fetchChat();
    }
  }, [activeChatId]);

  async function addMessage(e) {
    e.preventDefault();
    try {
      setMessageIsLoading(true);
      const formData = new FormData();
      formData.append("message", message);
      if (file) {
        formData.append("file", file);
      }
      const res = await axiosInstance.post(`/chat/${activeChatId}`, formData, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      setActiveChatMessages(res.data.messages);
      setMessage("");
      setFile(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setMessageIsLoading(false);
    }
  }

  if (isLoading) {
    return <Loader isFullPage={true} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.dorms}>
        {chats.map((item) => (
          <div key={item._id} className={styles.dorm} onClick={() => setActiveChatId(item._id)}>
            <h4>{item.dormId.name}</h4>
            <p>
              {item.messages.find((message) => message.message === item.lastMessage).isManager
                ? "Manager: "
                : "User: "}
              {item.lastMessage}
            </p>
          </div>
        ))}
      </div>
      {activeChatId && (
        <div className={styles.chat}>
          {activeChatIsLoading ? (
            <div className={styles.loader}>
              <Loader isRed={true} />
            </div>
          ) : (
            activeChat && (
              <div className={styles.wrapper}>
                <div className={styles.header}>
                  <h2>{activeChat.dormId.name}</h2>
                </div>
                <div className={styles.body}>
                  <div className={styles.messages}>
                    {activeChatMessages.map((item) => (
                      <div
                        key={item._id}
                        className={classNames(styles["message-wrapper"], {
                          [styles["message-wrapper__active"]]: item.isManager
                        })}>
                        <div
                          className={classNames(styles.message, {
                            [styles["message__active"]]: item.isManager
                          })}>
                          <p>{item.message}</p>
                          {item.fileUrl && (
                            <Link to={item.fileUrl} target="_blank">
                              File
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <form className={styles.form} onSubmit={addMessage}>
                  <textarea
                    placeholder="Enter a message..."
                    className={styles.textarea}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}></textarea>
                  <label htmlFor="file-upload" className={styles.label}>
                    Attach File
                    <input
                      id="file-upload"
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </label>
                  <button type="submit">{messageIsLoading ? <Loader /> : "Send"}</button>
                </form>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
