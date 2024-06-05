import { useParams } from "react-router-dom";
import styles from "./PostPage.module.scss";
import { useEffect, useState } from "react";
import Loader from "@components/Loader";
import axiosInstance from "@services/axios";

export default function PostPage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState({});

  useEffect(() => {
    async function fetchPost() {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/post/" + id);
        setPost(res.data);
      } catch (error) {
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPost();
  }, []);

  if (isLoading) {
    return <Loader isFullPage={true} />;
  }

  return (
    <div className={styles.container}>
      {post && (
        <>
          <img src={post.imageUrl} alt={post.title} className={styles.image} />
          <p className={styles.title}>{post.title}</p>
          {post.userId && (
            <p>
              Author: {post.userId.firstName} {post.userId.lastName}
            </p>
          )}
        </>
      )}
    </div>
  );
}
