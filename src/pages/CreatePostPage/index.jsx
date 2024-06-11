import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import styles from "./CreatePostPage.module.scss";
import axiosInstance from "@services/axios";
import { BLOG_PAGE_ROUTE } from "@utils/consts";
import Loader from "@components/Loader";
import imageCompression from "browser-image-compression";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

export default function CreatePostPage() {
  const navigateTo = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!title) newErrors.title = "Title is required";
    if (!content) newErrors.content = "Content is required";
    if (!file) newErrors.file = "Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        };
        const compressedFile = await imageCompression(file, options);
        setFile(compressedFile);
      } catch (error) {
        setErrors({ file: "Image compression failed. Please try again." });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("image", file);
      formData.append("tags", JSON.stringify(tags));

      await axiosInstance.post("/post", formData, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      navigateTo(BLOG_PAGE_ROUTE);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePreview = () => setShowPreview(!showPreview);

  useEffect(() => {
    const autoSave = setInterval(() => {
      if (title || content || file) {
        localStorage.setItem("draftPost", JSON.stringify({ title, content, file }));
      }
    }, 30000);

    return () => clearInterval(autoSave);
  }, [title, content, file]);

  useEffect(() => {
    const draft = JSON.parse(localStorage.getItem("draftPost"));
    if (draft) {
      setTitle(draft.title || "");
      setContent(draft.content || "");
      setFile(draft.file || null);
    }
  }, []);

  return (
    <div className={styles.container}>
      <button type="button" className={styles.btn} onClick={togglePreview}>
        {showPreview ? "Edit" : "Preview"}
      </button>
      {showPreview ? (
        <div className={styles.previewContainer}>
          <h2>{title}</h2>
          <div dangerouslySetInnerHTML={{ __html: content }} />
          {file && (
            <img src={URL.createObjectURL(file)} alt="Image Preview" className={styles.preview} />
          )}
          <div className={styles.tagsPreview}>
            {tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.block}>
            <label htmlFor="title" className={styles.label}>
              Title
            </label>
            <input
              type="text"
              id="title"
              className={classNames(styles.input, { [styles.error]: errors.title })}
              placeholder="Enter title..."
              onChange={(e) => setTitle(e.target.value)}
              aria-describedby={errors.title ? "title-error" : null}
            />
            {errors.title && (
              <p id="title-error" className={styles.errorText}>
                {errors.title}
              </p>
            )}
          </div>
          <div className={styles.block}>
            <label htmlFor="content" className={styles.label}>
              Content
            </label>
            <ReactQuill
              value={content}
              onChange={setContent}
              className={classNames({ [styles.error]: errors.content })}
              aria-describedby={errors.content ? "content-error" : null}
            />
            {errors.content && (
              <p id="content-error" className={styles.errorText}>
                {errors.content}
              </p>
            )}
          </div>
          <div className={styles.block}>
            <label htmlFor="file" className={styles.label}>
              Image
            </label>
            <input
              type="file"
              id="file"
              className={styles.file}
              onChange={handleFileChange}
              aria-describedby={errors.file ? "file-error" : null}
            />
            <label htmlFor="file" className={styles.btn}>
              Upload Image
            </label>
            {errors.file && (
              <p id="file-error" className={styles.errorText}>
                {errors.file}
              </p>
            )}
            {file && (
              <img src={URL.createObjectURL(file)} alt="Image Preview" className={styles.preview} />
            )}
          </div>
          <div className={styles.block}>
            <label htmlFor="tags" className={styles.label}>
              Tags
            </label>
            <TagsInput value={tags} onChange={setTags} inputProps={{ placeholder: "Add a tag" }} />
          </div>
          {errors.submit && <p className={styles.errorText}>{errors.submit}</p>}
          <div>
            <button type="submit" className={styles.btn} disabled={isLoading}>
              {isLoading ? <Loader /> : <p className={styles.btnText}>Create</p>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
