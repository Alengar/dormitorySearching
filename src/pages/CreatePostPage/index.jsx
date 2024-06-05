import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import styles from "./CreatePostPage.module.scss";
import axiosInstance from "@services/axios";
import { BLOG_PAGE_ROUTE } from "@utils/consts";
import Loader from "@components/Loader";

export default function CreatePostPage() {
  const navigateTo = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  async function addPost(e) {
    e.preventDefault();
    try {
      if (!title || !content || !file) {
        alert("Fill all fields!");
        return;
      }

      setIsLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("image", file);
      await axiosInstance.post("/post", formData, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      navigateTo(BLOG_PAGE_ROUTE);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={addPost}>
        <div className={styles.block}>
          <p className={styles.label}>Title</p>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter title..."
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.block}>
          <p className={styles.label}>Content</p>
          <textarea
            type="text"
            className={classNames(styles.input, styles.textarea)}
            placeholder="Enter content..."
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className={styles.block}>
          <p className={styles.label}>Image</p>
          <input
            type="file"
            id="file"
            className={styles.file}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label htmlFor="file" className={styles.btn}>
            Upload Image
          </label>
          {file && (
            <img src={URL.createObjectURL(file)} alt="Image Preview" className={styles.preview} />
          )}
        </div>
        <div>
          <button type="submit" className={styles.btn}>
            {isLoading ? <Loader /> : <p>Create</p>}
          </button>
        </div>
      </form>
    </div>
  );
}
