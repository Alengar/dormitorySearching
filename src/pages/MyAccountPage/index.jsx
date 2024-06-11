import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaCameraRotate } from "react-icons/fa6";
import { logout, updateUser } from "@redux/slices/userSlice";
import { HOME_PAGE_ROUTE } from "@utils/consts";
import defaultProfilePicture from "@assets/profile.png";
import "./MyAccountPage.scss";
import { useState, useEffect } from "react";
import axiosInstance from "@services/axios";

export default function MyAccountPage() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const [file, setFile] = useState(null);
  const [editableUser, setEditableUser] = useState(user);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditableUser(user);
  }, [user]);

  async function handlePreviewImage(e) {
    setFile(e.target.files[0]);
    try {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      const { data } = await axiosInstance.patch("/user/picture", formData, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      dispatch({ type: "user/updateProfilePicture", payload: data.profilePictureUrl });
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  async function handleSave() {
    try {
      const { data } = await axiosInstance.patch("/user", editableUser, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      console.log(data);
      dispatch(updateUser(data));
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  function logOut() {
    localStorage.removeItem("token");
    dispatch(logout());
    navigateTo(HOME_PAGE_ROUTE);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setEditableUser({ ...editableUser, [name]: value });
  }

  return (
    <div className="account-page">
      <div className="account-header">
        <div className="profile-picture">
          <img
            src={
              file
                ? URL.createObjectURL(file)
                : user.profilePictureUrl
                ? user.profilePictureUrl
                : defaultProfilePicture
            }
            alt="Profile"
          />
          <input type="file" id="image" className="input-file" onChange={handlePreviewImage} />
          <label htmlFor="image">
            <FaCameraRotate />
          </label>
        </div>
        <h2>
          {editableUser.firstName} {editableUser.lastName}
        </h2>
      </div>
      <div className="account-details">
        {isEditing ? (
          <>
            <label>
              <strong>First Name:</strong>
              <input
                type="text"
                name="firstName"
                value={editableUser.firstName}
                onChange={handleChange}
              />
            </label>
            <label>
              <strong>Last Name:</strong>
              <input
                type="text"
                name="lastName"
                value={editableUser.lastName}
                onChange={handleChange}
              />
            </label>
            <label>
              <strong>Email:</strong>
              <input type="text" name="email" value={editableUser.email} onChange={handleChange} />
            </label>
            <label>
              <strong>University Name:</strong>
              <input
                type="text"
                name="universityName"
                value={editableUser.universityName}
                onChange={handleChange}
              />
            </label>
            <label>
              <strong>Year:</strong>
              <input type="number" name="year" value={editableUser.year} onChange={handleChange} />
            </label>
            <label>
              <strong>Date of Birth:</strong>
              <input
                type="date"
                name="dateOfBirth"
                value={
                  editableUser.dateOfBirth
                    ? new Date(editableUser.dateOfBirth).toISOString().substring(0, 10)
                    : ""
                }
                onChange={handleChange}
              />
            </label>
            <label>
              <strong>Location:</strong>
              <input
                type="text"
                name="location"
                value={editableUser.location}
                onChange={handleChange}
              />
            </label>
          </>
        ) : (
          <>
            <p>
              <strong>First Name:</strong> {user.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {user.lastName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>University Name:</strong> {user.universityName}
            </p>
            <p>
              <strong>Year:</strong> {user.year}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : ""}
            </p>
            <p>
              <strong>Location:</strong> {user.location}
            </p>
            <p>
              <strong>Account Created:</strong> {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </>
        )}
      </div>
      {isEditing ? (
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
      ) : (
        <button className="edit-button" onClick={() => setIsEditing(true)}>
          Edit
        </button>
      )}
      <button className="logout-button" onClick={logOut}>
        Log Out
      </button>
    </div>
  );
}
