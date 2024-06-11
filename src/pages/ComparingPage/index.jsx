import { useState, useEffect } from "react";
import axiosInstance from "../../services/axios";
import ComparisonTable from "./components/ComparisonTable";
import Pagination from "./components/Pagination";
import "./ComparingPage.scss";

const ComparingPage = () => {
  const [dormitories, setDormitories] = useState([]);
  const [dormList, setDormList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const dormsPerPage = 6;

  useEffect(() => {
    const fetchDormitories = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/dorm");
        setDormitories(response.data);
      } catch (error) {
        setError("Error fetching dormitories. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDormitories();
  }, []);

  const manageDormList = (id) => {
    setDormList((prevList) =>
      prevList.includes(id)
        ? prevList.filter((item) => item !== id)
        : prevList.length < 2
        ? [...prevList, id]
        : prevList
    );
  };

  const firstSelectedDorm = dormitories.find((item) => item._id === dormList[0]);
  const secondSelectedDorm = dormitories.find((item) => item._id === dormList[1]);

  const indexOfLastDorm = currentPage * dormsPerPage;
  const indexOfFirstDorm = indexOfLastDorm - dormsPerPage;
  const currentDorms = dormitories.slice(indexOfFirstDorm, indexOfLastDorm);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  const comparisonData = [
    {
      attribute: "Location",
      firstValue: firstSelectedDorm?.location || "N/A",
      secondValue: secondSelectedDorm?.location || "N/A"
    },
    {
      attribute: "City",
      firstValue: firstSelectedDorm?.city || "N/A",
      secondValue: secondSelectedDorm?.city || "N/A"
    },
    {
      attribute: "Price",
      firstValue: `${firstSelectedDorm?.price || "N/A"} ₸`,
      secondValue: `${secondSelectedDorm?.price || "N/A"} ₸`
    },
    {
      attribute: "Description",
      firstValue: firstSelectedDorm?.description || "N/A",
      secondValue: secondSelectedDorm?.description || "N/A"
    },
    {
      attribute: "Capacity",
      firstValue: firstSelectedDorm?.capacity || "N/A",
      secondValue: secondSelectedDorm?.capacity || "N/A"
    },
    {
      attribute: "Size",
      firstValue: `${firstSelectedDorm?.size || "N/A"} sq.m`,
      secondValue: `${secondSelectedDorm?.size || "N/A"} sq.m`
    },
    {
      attribute: "Work Email",
      firstValue: firstSelectedDorm?.workEmail || "N/A",
      secondValue: secondSelectedDorm?.workEmail || "N/A"
    },
    {
      attribute: "Phone Number",
      firstValue: firstSelectedDorm?.phoneNumber || "N/A",
      secondValue: secondSelectedDorm?.phoneNumber || "N/A"
    },
    {
      attribute: "Extras",
      firstValue: firstSelectedDorm?.extras.join(", ") || "N/A",
      secondValue: secondSelectedDorm?.extras.join(", ") || "N/A"
    },
    {
      attribute: "WiFi",
      firstValue: firstSelectedDorm?.amenties?.hasWiFi ? "Yes" : "No",
      secondValue: secondSelectedDorm?.amenties?.hasWiFi ? "Yes" : "No"
    },
    {
      attribute: "Meal",
      firstValue: firstSelectedDorm?.amenties?.hasMeal ? "Yes" : "No",
      secondValue: secondSelectedDorm?.amenties?.hasMeal ? "Yes" : "No"
    },
    {
      attribute: "Television",
      firstValue: firstSelectedDorm?.amenties?.hasTelevision ? "Yes" : "No",
      secondValue: secondSelectedDorm?.amenties?.hasTelevision ? "Yes" : "No"
    },
    {
      attribute: "Washer",
      firstValue: firstSelectedDorm?.amenties?.hasWasher ? "Yes" : "No",
      secondValue: secondSelectedDorm?.amenties?.hasWasher ? "Yes" : "No"
    },
    {
      attribute: "Balcony",
      firstValue: firstSelectedDorm?.amenties?.hasBalcony ? "Yes" : "No",
      secondValue: secondSelectedDorm?.amenties?.hasBalcony ? "Yes" : "No"
    },
    {
      attribute: "Cleaner",
      firstValue: firstSelectedDorm?.amenties?.hasCleaner ? "Yes" : "No",
      secondValue: secondSelectedDorm?.amenties?.hasCleaner ? "Yes" : "No"
    },
    {
      attribute: "Radio",
      firstValue: firstSelectedDorm?.amenties?.hasRadio ? "Yes" : "No",
      secondValue: secondSelectedDorm?.amenties?.hasRadio ? "Yes" : "No"
    },
    {
      attribute: "Lift",
      firstValue: firstSelectedDorm?.amenties?.hasLift ? "Yes" : "No",
      secondValue: secondSelectedDorm?.amenties?.hasLift ? "Yes" : "No"
    },
    {
      attribute: "Daily Cleaner",
      firstValue: firstSelectedDorm?.amenties?.hasDailyCleaner ? "Yes" : "No",
      secondValue: secondSelectedDorm?.amenties?.hasDailyCleaner ? "Yes" : "No"
    },
    {
      attribute: "Rating",
      firstValue: firstSelectedDorm?.overallRate || "N/A",
      secondValue: secondSelectedDorm?.overallRate || "N/A"
    }
  ];

  return (
    <>
      <div className="comparing">
        <h2>Dormitories List</h2>
        <div className="comparing-grid">
          {currentDorms.map((item) => (
            <div key={item._id} className="comparing-item">
              <div className="comparing-item-part">
                <img src={item.previewImageUrl} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.location}</p>
                </div>
              </div>
              <div className="comparing-item-part">
                <input
                  type="checkbox"
                  disabled={!dormList.includes(item._id) && dormList.length >= 2}
                  checked={dormList.includes(item._id)}
                  onChange={() => manageDormList(item._id)}
                />
              </div>
            </div>
          ))}
        </div>
        <Pagination
          dormsPerPage={dormsPerPage}
          totalDorms={dormitories.length}
          paginate={paginate}
        />
      </div>
      <div className="comparing-results">
        <h2>Comparison</h2>
        {dormList.length === 2 ? (
          <ComparisonTable data={comparisonData} />
        ) : (
          <p>Please select 2 dormitories to compare.</p>
        )}
      </div>
    </>
  );
};

export default ComparingPage;
