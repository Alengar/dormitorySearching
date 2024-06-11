import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuth from "@hooks/useAuth";
import {
  ADMIN_USERS_PAGE_ROUTE,
  BLOG_PAGE_ROUTE,
  CHAT_PAGE_ROUTE,
  COMPARING_PAGE_ROUTE,
  DORMITORIES_PAGE_ROUTE,
  HOME_PAGE_ROUTE,
  LOGIN_PAGE_ROUTE,
  MANAGER_CHAT_PAGE_ROUTE,
  MY_ACCOUNT_PAGE_ROUTE
} from "@utils/consts";
import styles from "./Navbar.module.scss";
import logo from "@assets/logo_dorm.png";

export default function Navbar() {
  const { isAuth } = useAuth();
  const user = useSelector((state) => state.user.user);
  const location = useLocation();

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <img src={logo} alt="Logo" className={styles.logoImage} />
        </div>
        <div className={styles.list}>
          <Link
            to={HOME_PAGE_ROUTE}
            className={`${styles.link} ${
              location.pathname === HOME_PAGE_ROUTE ? styles.active : ""
            }`}>
            Home
          </Link>
          <Link
            to={DORMITORIES_PAGE_ROUTE}
            className={`${styles.link} ${
              location.pathname === DORMITORIES_PAGE_ROUTE ? styles.active : ""
            }`}>
            Dormitories
          </Link>
          <Link
            to={COMPARING_PAGE_ROUTE}
            className={`${styles.link} ${
              location.pathname === COMPARING_PAGE_ROUTE ? styles.active : ""
            }`}>
            Comparing
          </Link>
          {isAuth && (
            <Link
              to={user.role === "manager" ? MANAGER_CHAT_PAGE_ROUTE : CHAT_PAGE_ROUTE}
              className={`${styles.link} ${
                location.pathname ===
                (user.role === "manager" ? MANAGER_CHAT_PAGE_ROUTE : CHAT_PAGE_ROUTE)
                  ? styles.active
                  : ""
              }`}>
              Chat
            </Link>
          )}
          <Link
            to={BLOG_PAGE_ROUTE}
            className={`${styles.link} ${
              location.pathname === BLOG_PAGE_ROUTE ? styles.active : ""
            }`}>
            Blog
          </Link>
        </div>
        <div className={styles.auth}>
          <Link
            to={
              isAuth
                ? user.role === "admin"
                  ? ADMIN_USERS_PAGE_ROUTE
                  : MY_ACCOUNT_PAGE_ROUTE
                : LOGIN_PAGE_ROUTE
            }
            className={styles.btn}>
            {isAuth ? (user.role === "admin" ? "Admin Panel" : "My account") : "Login"}
          </Link>
        </div>
      </nav>
    </header>
  );
}
