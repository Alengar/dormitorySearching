import { BsFacebook } from "react-icons/bs";
import { AiFillTwitterCircle } from "react-icons/ai";
import { FaTiktok } from "react-icons/fa";
import { AiFillYoutube } from "react-icons/ai";
import { FaPinterest } from "react-icons/fa";
import "./footer.scss"; // Ensure you have the SCSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="sectionContainer container">
        <div className="gridOne">
          <p>Your ultimate platform for finding the perfect dormitory.</p>
          <div className="socialIcon flex">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook">
              <BsFacebook className="icon" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter">
              <AiFillTwitterCircle className="icon" />
            </a>
            <a
              href="https://www.tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok">
              <FaTiktok className="icon" />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube">
              <AiFillYoutube className="icon" />
            </a>
            <a
              href="https://www.pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pinterest">
              <FaPinterest className="icon" />
            </a>
          </div>
        </div>

        <div className="footerLinks">
          <span className="linkTitle">Information</span>
          <ul>
            <li>
              <a href="#">Explore</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
          </ul>
        </div>

        <div className="footerLinks">
          <span className="linkTitle">Quick Guide</span>
          <ul>
            <li>
              <a href="#">FAQs</a>
            </li>
            <li>
              <a href="#">Features</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
