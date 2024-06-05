import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useAuth from "@hooks/useAuth";
import { BLOG_PAGE_ROUTE, CREATE_POST_PAGE_ROUTE } from "@utils/consts";
import styles from "./BlogPage.module.scss";
import { useEffect, useState } from "react";
import Loader from "@components/Loader";
import axiosInstance from "@services/axios";

export default function BlogPage() {
  const { isAuth } = useAuth();
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/post");
        setPosts(res.data);
      } catch (error) {
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (isLoading) {
    return <Loader isFullPage={true} />;
  }

  return (
    <div>
      <div className={styles.header}>
        <h2>Blog Page</h2>
        {isAuth && (user.role === "user" || user.role === "manager") && (
          <Link to={CREATE_POST_PAGE_ROUTE}>Create Post</Link>
        )}
      </div>
      <div className={styles.grid}>
        {posts.map((post) => (
          <div className={styles.item} key={post._id}>
            <img src={post.imageUrl} alt={post.title} className={styles.image} />
            <div className={styles.content}>
              <p>{post.title}</p>
              <p>
                Author: {post.userId.firstName} {post.userId.lastName}
              </p>
              <Link to={BLOG_PAGE_ROUTE + "/" + post._id}>More</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
