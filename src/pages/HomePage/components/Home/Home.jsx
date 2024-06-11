import { useEffect } from "react";
import video from "../../../../assets/expo.mp4";
import Aos from "aos";
import "aos/dist/aos.css";
import "../.././home.scss"; // Import the SCSS file
const Home = () => {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <div className="home flex container">
      <div className="mainText">
        <h1 data-aos="fade-up" data-aos-duration="2500">
          Dream, Connect, Reside:
        </h1>
        <h1 data-aos="fade-up" data-aos-duration="2500">
          Your Home Away from Home.
        </h1>
      </div>
      <div className="homeImages flex">
        <div className="videoDiv">
          <video
            src={video}
            autoPlay
            muted
            loop
            className="video"
            aria-label="Promotional video"></video>
        </div>
      </div>
    </div>
  );
};

export default Home;
