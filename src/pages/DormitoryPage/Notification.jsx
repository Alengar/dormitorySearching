import React from "react";
import styles from "./Notification.module.scss";

const Notification = ({ message, onClose }) => {
  return (
    <div className={styles.notification}>
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Notification;
