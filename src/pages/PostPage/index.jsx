import { useParams, Link } from "react-router-dom";
import styles from "./PostPage.module.scss";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "@components/Loader";
import axiosInstance from "@services/axios";
import { FaThumbsUp } from "react-icons/fa"; // Importing the like icon
import DOMPurify from "dompurify";

export default function PostPage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    async function fetchPost() {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/post/" + id);
        const fetchedPost = res.data;

        // Check if the post has a createdAt date, if not, generate and store one locally
        let createdAt = fetchedPost.createdAt || localStorage.getItem(`post-createdAt-${id}`);
        if (!createdAt) {
          createdAt = new Date().toISOString();
          localStorage.setItem(`post-createdAt-${id}`, createdAt);
        }
        fetchedPost.createdAt = createdAt;

        setPost(fetchedPost);

        const storedLikes = localStorage.getItem(`post-likes-${id}`);
        setLikes(storedLikes ? parseInt(storedLikes) : fetchedPost.likes || 0);

        const storedComments = JSON.parse(localStorage.getItem(`post-comments-${id}`)) || [];
        const updatedComments = storedComments.length ? storedComments : fetchedPost.comments || [];

        // Ensure all comments have a createdAt date
        updatedComments.forEach((comment) => {
          if (!comment.createdAt) {
            comment.createdAt = new Date().toISOString();
          }
        });

        setComments(updatedComments);
      } catch (error) {
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const newCommentObj = {
      _id: Date.now().toString(),
      text: newComment,
      userId: {
        firstName: user.firstName,
        lastName: user.lastName
      }, // Using actual user data
      createdAt: new Date().toISOString()
    };
    const updatedComments = [...comments, newCommentObj];
    setComments(updatedComments);
    localStorage.setItem(`post-comments-${id}`, JSON.stringify(updatedComments));
    setNewComment("");
  };

  const handleLike = () => {
    const newLikes = likes + 1;
    setLikes(newLikes);
    localStorage.setItem(`post-likes-${id}`, newLikes);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available"; // Return a default message if dateString is not provided or is null/undefined
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date"; // Return a default message if the date is invalid
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return <Loader isFullPage={true} />;
  }

  return (
    <div className={styles.container}>
      <Link to="/blog" className={styles.backLink}>
        Back to Blog
      </Link>
      {post && (
        <>
          <img src={post.imageUrl} alt={post.title} className={styles.image} />
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.date}>Published on: {formatDate(post.createdAt)}</p>
          {post.userId && (
            <div className={styles.author}>
              <p>
                Author:{" "}
                <Link to={`/profile/${post.userId._id}`}>
                  {post.userId.firstName} {post.userId.lastName}
                </Link>
              </p>
            </div>
          )}
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />
          <div className={styles.tags}>
            {(post.tags || []).map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
          <div className={styles.interactions}>
            <button onClick={handleLike} className={styles.likeButton}>
              <FaThumbsUp className={styles.likeIcon} /> Like ({likes})
            </button>
            <div className={styles.shareButtons}>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer">
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${post.title}`}
                target="_blank"
                rel="noopener noreferrer">
                Twitter
              </a>
            </div>
          </div>
          <div className={styles.commentsSection}>
            <h2>Comments</h2>
            <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Leave a comment"
                className={styles.commentInput}
              />
              <button type="submit" className={styles.commentButton}>
                Submit
              </button>
            </form>
            <div className={styles.commentsList}>
              {comments.map((comment) => (
                <div key={comment._id} className={styles.comment}>
                  <div className={styles.commentHeader}>
                    <div className={styles.commentInfo}>
                      <span className={styles.commentAuthor}>
                        {comment.userId.firstName} {comment.userId.lastName}
                      </span>
                      <span className={styles.commentDate}>{formatDate(comment.createdAt)}</span>
                    </div>
                  </div>
                  <p className={styles.commentText}>{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
