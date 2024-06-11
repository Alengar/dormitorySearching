import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import axiosInstance from "@services/axios";
import Loader from "@components/Loader";
import { DORMITORIES_PAGE_ROUTE } from "@utils/consts";
import { CSSTransition } from "react-transition-group";
import styles from "./DormitoriesPage.module.scss";

const DormitorySortingCheckbox = ({ label, checked, onChange }) => (
  <div className="dormitory-sorting-checkbox">
    <input type="checkbox" checked={checked} onChange={onChange} id={label} />
    <label htmlFor={label}>{label}</label>
  </div>
);

DormitorySortingCheckbox.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};

const DormitorySorting = ({
  hasTelevision,
  setHasTelevision,
  hasWiFi,
  setHasWiFi,
  hasWasher,
  setHasWasher,
  hasBalcony,
  setHasBalcony,
  hasCleaner,
  setHasCleaner,
  hasRadio,
  setHasRadio,
  hasLift,
  setHasLift,
  hasDailyCleaner,
  setHasDailyCleaner
}) => (
  <CSSTransition in={true} appear={true} timeout={400} classNames="dormitorySorting">
    <div className={styles.dormitorySorting}>
      <DormitorySortingCheckbox
        label="Has Television"
        checked={hasTelevision}
        onChange={() => setHasTelevision(!hasTelevision)}
      />
      <DormitorySortingCheckbox
        label="Has Wi-Fi"
        checked={hasWiFi}
        onChange={() => setHasWiFi(!hasWiFi)}
      />
      <DormitorySortingCheckbox
        label="Has Washer"
        checked={hasWasher}
        onChange={() => setHasWasher(!hasWasher)}
      />
      <DormitorySortingCheckbox
        label="Has Balcony"
        checked={hasBalcony}
        onChange={() => setHasBalcony(!hasBalcony)}
      />
      <DormitorySortingCheckbox
        label="Has Cleaner"
        checked={hasCleaner}
        onChange={() => setHasCleaner(!hasCleaner)}
      />
      <DormitorySortingCheckbox
        label="Has Radio"
        checked={hasRadio}
        onChange={() => setHasRadio(!hasRadio)}
      />
      <DormitorySortingCheckbox
        label="Has Lift"
        checked={hasLift}
        onChange={() => setHasLift(!hasLift)}
      />
      <DormitorySortingCheckbox
        label="Has Daily Cleaner"
        checked={hasDailyCleaner}
        onChange={() => setHasDailyCleaner(!hasDailyCleaner)}
      />
    </div>
  </CSSTransition>
);

DormitorySorting.propTypes = {
  hasTelevision: PropTypes.bool.isRequired,
  setHasTelevision: PropTypes.func.isRequired,
  hasWiFi: PropTypes.bool.isRequired,
  setHasWiFi: PropTypes.func.isRequired,
  hasWasher: PropTypes.bool.isRequired,
  setHasWasher: PropTypes.func.isRequired,
  hasBalcony: PropTypes.bool.isRequired,
  setHasBalcony: PropTypes.func.isRequired,
  hasCleaner: PropTypes.bool.isRequired,
  setHasCleaner: PropTypes.func.isRequired,
  hasRadio: PropTypes.bool.isRequired,
  setHasRadio: PropTypes.func.isRequired,
  hasLift: PropTypes.bool.isRequired,
  setHasLift: PropTypes.func.isRequired,
  hasDailyCleaner: PropTypes.bool.isRequired,
  setHasDailyCleaner: PropTypes.func.isRequired
};

export default function DormitoriesPage() {
  const [dormitories, setDormitories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTelevision, setHasTelevision] = useState(false);
  const [hasWiFi, setHasWiFi] = useState(false);
  const [hasWasher, setHasWasher] = useState(false);
  const [hasBalcony, setHasBalcony] = useState(false);
  const [hasCleaner, setHasCleaner] = useState(false);
  const [hasRadio, setHasRadio] = useState(false);
  const [hasLift, setHasLift] = useState(false);
  const [hasDailyCleaner, setHasDailyCleaner] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("price");
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' for ascending, 'desc' for descending
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    async function fetchDormitories() {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/dorm");
        setDormitories(res.data);
      } catch (error) {
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDormitories();
  }, []);

  const filteredDormitories = dormitories.filter((dorm) => {
    if (hasTelevision && dorm.amenties && !dorm.amenties.hasTelevision) return false;
    if (hasWiFi && dorm.amenties && !dorm.amenties.hasWiFi) return false;
    if (hasWasher && dorm.amenties && !dorm.amenties.hasWasher) return false;
    if (hasBalcony && dorm.amenties && !dorm.amenties.hasBalcony) return false;
    if (hasCleaner && dorm.amenties && !dorm.amenties.hasCleaner) return false;
    if (hasRadio && dorm.amenties && !dorm.amenties.hasRadio) return false;
    if (hasLift && dorm.amenties && !dorm.amenties.hasLift) return false;
    if (hasDailyCleaner && dorm.amenties && !dorm.amenties.hasDailyCleaner) return false;
    if (searchQuery && !dorm.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedDormitories = filteredDormitories.sort((a, b) => {
    const aField = a[sortField];
    const bField = b[sortField];

    if (typeof aField === "string" && typeof bField === "string") {
      return sortOrder === "asc" ? aField.localeCompare(bField) : bField.localeCompare(aField);
    }

    if (typeof aField === "number" && typeof bField === "number") {
      return sortOrder === "asc" ? aField - bField : bField - aField;
    }

    return 0;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDormitories = sortedDormitories.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(sortedDormitories.length / itemsPerPage);

  console.log(dormitories);
  return (
    <div>
      <h1 className={styles.title}>Dormitories and Hostels</h1>
      <div className={styles.container}>
        <div>
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <DormitorySorting
            hasTelevision={hasTelevision}
            setHasTelevision={setHasTelevision}
            hasWiFi={hasWiFi}
            setHasWiFi={setHasWiFi}
            hasWasher={hasWasher}
            setHasWasher={setHasWasher}
            hasBalcony={hasBalcony}
            setHasBalcony={setHasBalcony}
            hasCleaner={hasCleaner}
            setHasCleaner={setHasCleaner}
            hasRadio={hasRadio}
            setHasRadio={setHasRadio}
            hasLift={hasLift}
            setHasLift={setHasLift}
            hasDailyCleaner={hasDailyCleaner}
            setHasDailyCleaner={setHasDailyCleaner}
          />
          <div className={styles.sorting}>
            <label>Sort by: </label>
            <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
              <option value="price">Price</option>
              <option value="capacity">Capacity</option>
              <option value="size">Size</option>
              <option value="name">Name</option>
            </select>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        {isLoading ? (
          <Loader isRed={true} />
        ) : (
          <div>
            <div className={styles.grid}>
              {currentDormitories.map((dorm) => (
                <div className={styles.item} key={dorm._id}>
                  <div className={styles.img}>
                    <img src={dorm.previewImageUrl} alt={dorm.name} />
                  </div>
                  <div className={styles.block}>
                    <h2>{dorm.name}</h2>
                    <p>
                      {dorm.description.length > 150
                        ? `${dorm.description.substring(0, 150)}...`
                        : dorm.description}
                    </p>
                    <div className={styles.info}>
                      <p className={styles.info__item}>Price: {dorm.price} ₸</p>
                      <p className={styles.info__item}>City: {dorm.city}</p>
                    </div>
                    <p className={styles.overallRate}>
                      Overall rate: {dorm.overallRate ? dorm.overallRate.toFixed(2) : "N/A"}
                    </p>
                    <Link to={DORMITORIES_PAGE_ROUTE + "/" + dorm.slug} className={styles.btn}>
                      More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.pagination}>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={currentPage === index + 1 ? styles.active : ""}>
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
