import { Link } from "react-router-dom";
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
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <img src={logo} alt="Logo" className={styles.logoImage} />
        </div>
        <div>
          <div className={styles.list}>
            <Link to={HOME_PAGE_ROUTE} className={styles.link}>
              Home
            </Link>
            <Link to={DORMITORIES_PAGE_ROUTE} className={styles.link}>
              Dormitories
            </Link>
            <Link to={COMPARING_PAGE_ROUTE} className={styles.link}>
              Comparing
            </Link>
            {isAuth && (
              <Link
                to={user.role === "manager" ? MANAGER_CHAT_PAGE_ROUTE : CHAT_PAGE_ROUTE}
                className={styles.link}>
                Chat
              </Link>
            )}
            <Link to={BLOG_PAGE_ROUTE} className={styles.link}>
              Blog
            </Link>
          </div>
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
