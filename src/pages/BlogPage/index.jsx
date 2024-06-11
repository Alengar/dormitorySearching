import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useAuth from "@hooks/useAuth";
import { BLOG_PAGE_ROUTE, CREATE_POST_PAGE_ROUTE } from "@utils/consts";
import styles from "./BlogPage.module.scss";
import { useEffect, useState } from "react";
import Loader from "@components/Loader";
import axiosInstance from "@services/axios";
import Pagination from "./components/Pagination";
import DOMPurify from "dompurify";

// Utility function to truncate text to a specified number of words
function truncateText(text, wordLimit) {
  const words = text.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return text;
}

export default function BlogPage() {
  const { isAuth } = useAuth();
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

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

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const onPageChange = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <Loader isFullPage={true} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>Welcome to the Blog</h1>
        <p>Stay updated with the latest news and stories.</p>
        {isAuth && (user.role === "user" || user.role === "manager") && (
          <Link to={CREATE_POST_PAGE_ROUTE} className={styles.createPostButton}>
            Create Post
          </Link>
        )}
      </div>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className={styles.grid}>
        {currentPosts.map((post) => (
          <div className={styles.item} key={post._id}>
            <img src={post.imageUrl} alt={post.title} className={styles.image} />
            <div className={styles.content}>
              <h3>{post.title}</h3>
              <p
                className={styles.excerpt}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(truncateText(post.content, 30))
                }}
              />
              <div className={styles.tags}>
                {(post.tags || []).map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <Link to={BLOG_PAGE_ROUTE + "/" + post._id} className={styles.moreLink}>
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Your Blog. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className={styles.socialLinks}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </div>
      </footer>
    </div>
  );
}
