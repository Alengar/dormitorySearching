import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FaStar,
  FaTv,
  FaWifi,
  FaBath,
  FaBroom,
  FaBuilding,
  FaArrowLeft,
  FaArrowRight,
  FaTimes
} from "react-icons/fa";
import axiosInstance from "@services/axios";
import Loader from "@components/Loader";
import styles from "./DormitoryPage.module.scss";
import useAuth from "@hooks/useAuth";
import { FaRadio } from "react-icons/fa6";
import { useSelector } from "react-redux";
import Notification from "./Notification";

export default function DormitoryPage() {
  const { isAuth } = useAuth();
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [dorm, setDorm] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [room, setRoom] = useState(0);
  const [location, setLocation] = useState(0);
  const [building, setBuilding] = useState(0);
  const [bathroom, setBathroom] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const [sortOption, setSortOption] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterOption, setFilterOption] = useState("all");

  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsLoading, setModalIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const user = useSelector((state) => state.user.user);

  async function createChat(e) {
    e.preventDefault();
    try {
      setModalIsLoading(true);
      const formData = new FormData();
      formData.append("message", message);
      if (file) {
        formData.append("file", file);
      }
      console.log({ message, file });
      await axiosInstance.post(`/chat/create/${dorm._id}`, formData, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      setNotification("Success!");
      setModalIsOpen(false);
    } catch (error) {
      setNotification(error.message);
    } finally {
      setModalIsLoading(false);
    }
  }

  useEffect(() => {
    const fetchDorm = async () => {
      try {
        setIsLoading(true);
        const dormRes = await axiosInstance.get(`/dorm/${slug}`);
        console.log(dormRes.data); // Log the fetched dorm data
        setDorm(dormRes.data);
        setReviews(dormRes.data.reviews);
        const chatRes = await axiosInstance.get(`/chat/user/${user._id}`, {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });
        console.log(chatRes);
        setChats(chatRes.data);
      } catch (error) {
        setNotification(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDorm();

    const handleScroll = () => {
      const galleryHeight = document.querySelector(`.${styles.imageGallery}`).offsetHeight;
      setIsFixed(window.scrollY > galleryHeight);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [slug, user._id]);

  const addReview = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const reviewData = { comment, rate: { room, location, building, bathroom } };
      await axiosInstance.post(`/review/${dorm._id}`, reviewData, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      const res = await axiosInstance.get(`/dorm/${slug}`);
      setDorm(res.data);
      setReviews(res.data.reviews);
    } catch (error) {
      setNotification(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setCurrentImageIndex(0);
    setLightboxOpen(false);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? dorm.imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === dorm.imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const getSortedAndFilteredReviews = () => {
    let filteredReviews = [...reviews];

    if (filterOption !== "all") {
      filteredReviews = filteredReviews.filter(
        (review) => review.rate.room >= parseInt(filterOption)
      );
    }

    switch (sortOption) {
      case "rating":
        filteredReviews.sort((a, b) => {
          const aAvg = (a.rate.room + a.rate.location + a.rate.building + a.rate.bathroom) / 4;
          const bAvg = (b.rate.room + b.rate.location + b.rate.building + b.rate.bathroom) / 4;
          return bAvg - aAvg;
        });
        break;
      case "date":
      default:
        filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
    }

    if (sortOrder === "asc") {
      filteredReviews.reverse();
    }

    return filteredReviews;
  };

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Return empty string if dateString is not provided or is null/undefined
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Return empty string if the date is invalid
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return <Loader isRed={true} />;
  }

  const amenitiesIcons = {
    hasTelevision: <FaTv />,
    hasWiFi: <FaWifi />,
    hasWasher: <FaBath />,
    hasBalcony: <FaBroom />,
    hasCleaner: <FaBroom />,
    hasRadio: <FaRadio />,
    hasLift: <FaBuilding />,
    hasDailyCleaner: <FaBroom />
  };

  function openModal() {
    setModalIsOpen(true);
  }
  function closeModal(e) {
    if (e.target.className.includes("shadow")) {
      setModalIsOpen(false);
    }
  }

  return (
    <div className={styles.dormitoryPage}>
      {dorm && (
        <>
          {modalIsOpen && (
            <div className={styles.shadow} onClick={closeModal}>
              <div className={styles.modal}>
                <div className={styles["modal-header"]}>Start a Chat</div>
                <form onSubmit={createChat}>
                  <textarea
                    type="text"
                    placeholder="Enter message..."
                    onChange={(e) => setMessage(e.target.value)}
                    className={styles["modal-textarea"]}
                  />
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className={styles["modal-file-input"]}
                  />
                  <button type="submit" className={styles["modal-btn"]}>
                    {modalIsLoading ? <Loader /> : "Send"}
                  </button>
                </form>
              </div>
            </div>
          )}
          {notification && (
            <Notification message={notification} onClose={() => setNotification(null)} />
          )}
          <div className={styles.imageGallery}>
            <img
              src={dorm?.previewImageUrl}
              alt={dorm?.name}
              className={styles.mainImage}
              onClick={() => openLightbox(0)}
            />
            <div className={styles.imageThumbnails}>
              {dorm?.imageUrls.slice(0, 4).map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${dorm?.name} ${index + 1}`}
                  onClick={() => openLightbox(index)}
                />
              ))}
              {dorm?.imageUrls.length > 4 && (
                <div className={styles.morePhotos}>+{dorm.imageUrls.length - 4} More Photos</div>
              )}
            </div>
          </div>

          <div className={styles.details}>
            <div className={styles.leftColumn}>
              <div className={styles.header}>
                <h2>{dorm.name}</h2>
                <div className={styles.headerInfo}>
                  <span>{dorm.location}</span>
                  <span>{dorm.city}</span>
                </div>
              </div>

              <div className={styles.extras}>
                <h3>Extras</h3>
                <div className={styles.extrasList}>
                  {dorm.extras.map((extra, index) => (
                    <p key={index}>{extra}</p>
                  ))}
                </div>
              </div>

              <div className={styles.amenities}>
                <h3>Amenities</h3>
                <div className={styles.amenitiesList}>
                  {Object.entries(dorm.amenties || {}).map(
                    ([key, value], index) =>
                      value && (
                        <div key={index} className={styles.amenity}>
                          {amenitiesIcons[key]} <span>{key.replace(/([A-Z])/g, " $1").trim()}</span>
                        </div>
                      )
                  )}
                </div>
              </div>

              <div className={styles.description}>
                <h3>Description</h3>
                <p>{dorm.description}</p>
              </div>

              <div className={styles.reviews}>
                <h3>Reviews</h3>
                <div className={styles.reviewControls}>
                  <label>
                    Sort by:
                    <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                      <option value="date">Date</option>
                      <option value="rating">Rating</option>
                    </select>
                  </label>
                  <label>
                    Order:
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </label>
                  <label>
                    Filter by rating:
                    <select value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
                      <option value="all">All</option>
                      <option value="4">4 stars & up</option>
                      <option value="3">3 stars & up</option>
                      <option value="2">2 stars & up</option>
                      <option value="1">1 star & up</option>
                    </select>
                  </label>
                </div>
                {isAuth ? (
                  <form onSubmit={addReview} className={styles.reviewForm}>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Leave your comment here..."
                      className={styles.reviewTextarea}
                    />
                    <div className={styles.rates}>
                      <div className={styles.rateCategory}>
                        <p>Room</p>
                        <div className={styles.stars}>
                          {[...Array(5)].map((star, index) => (
                            <FaStar
                              key={index}
                              className={room > index ? styles.active : ""}
                              onClick={() => setRoom(index + 1)}
                            />
                          ))}
                        </div>
                      </div>
                      <div className={styles.rateCategory}>
                        <p>Location</p>
                        <div className={styles.stars}>
                          {[...Array(5)].map((star, index) => (
                            <FaStar
                              key={index}
                              className={location > index ? styles.active : ""}
                              onClick={() => setLocation(index + 1)}
                            />
                          ))}
                        </div>
                      </div>
                      <div className={styles.rateCategory}>
                        <p>Building</p>
                        <div className={styles.stars}>
                          {[...Array(5)].map((star, index) => (
                            <FaStar
                              key={index}
                              className={building > index ? styles.active : ""}
                              onClick={() => setBuilding(index + 1)}
                            />
                          ))}
                        </div>
                      </div>
                      <div className={styles.rateCategory}>
                        <p>Bathroom</p>
                        <div className={styles.stars}>
                          {[...Array(5)].map((star, index) => (
                            <FaStar
                              key={index}
                              className={bathroom > index ? styles.active : ""}
                              onClick={() => setBathroom(index + 1)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <button type="submit" className={styles.btn}>
                      Submit
                    </button>
                  </form>
                ) : (
                  <p>Please log in to leave a review.</p>
                )}
                <div className={styles.reviewList}>
                  {getSortedAndFilteredReviews().map((review, index) => {
                    const averageRate =
                      (review.rate.room +
                        review.rate.location +
                        review.rate.building +
                        review.rate.bathroom) /
                      4;

                    return (
                      <div key={index} className={styles.review}>
                        <h4>{`${review.userId.firstName} ${review.userId.lastName}`}</h4>
                        <p>{review.comment}</p>
                        <div className={styles.reviewDetails}>
                          <span className={styles.reviewDate}>{formatDate(review.date)}</span>
                          <span className={styles.reviewAverageRate}>
                            Average rate: {averageRate.toFixed(1)}
                          </span>
                        </div>
                        <div className={styles.reviewRatings}>
                          <div className={styles.rating}>
                            <FaStar />
                            <span>Room: {review.rate.room}/5</span>
                          </div>
                          <div className={styles.rating}>
                            <FaStar />
                            <span>Location: {review.rate.location}/5</span>
                          </div>
                          <div className={styles.rating}>
                            <FaStar />
                            <span>Building: {review.rate.building}/5</span>
                          </div>
                          <div className={styles.rating}>
                            <FaStar />
                            <span>Bathroom: {review.rate.bathroom}/5</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className={`${styles.rightColumn} ${isFixed ? styles.fixed : ""}`}>
              <div className={styles.price}>
                <span className={styles.priceValue}>{dorm.price} ₸</span> per month
              </div>
              <div className={styles.info}>
                <p>
                  <span>Size:</span> {dorm.size} sq.m
                </p>
                <p>
                  <span>Capacity:</span> {dorm.capacity} people
                </p>
                <p>
                  <span>Location:</span> {dorm.location}
                </p>
              </div>
              {chats.find((item) => item.dormId === dorm._id) ? (
                <p>You already have a chat</p>
              ) : (
                <button className={styles.chatButton} onClick={openModal}>
                  Chat
                </button>
              )}
              <div className={styles.contactInfo}>
                <p>
                  <span>Email:</span> {dorm.workEmail}
                </p>
                <p>
                  <span>Phone:</span> {dorm.phoneNumber}
                </p>
              </div>
            </div>
          </div>

          {lightboxOpen && (
            <div className={styles.lightbox}>
              <button onClick={handlePrevImage} className={styles.prevButton}>
                <FaArrowLeft />
              </button>
              <img
                src={dorm.imageUrls[currentImageIndex]}
                alt="Lightbox"
                className={styles.lightboxImage}
              />
              <button onClick={handleNextImage} className={styles.nextButton}>
                <FaArrowRight />
              </button>
              <button onClick={closeLightbox} className={styles.closeButton}>
                <FaTimes />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
