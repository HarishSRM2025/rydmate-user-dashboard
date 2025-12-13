import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/profile.css";

export default function Profile() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const stored = JSON.parse(localStorage.getItem("RydmateUserData"));
  const userId = stored.user.id;

  const [user, setUser] = useState(null);
  const [activeForm, setActiveForm] = useState("profile"); // profile | password

  // profile fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // password fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* -------- GET USER -------- */
  useEffect(() => {
    if (!userId) return;

    axios.get(`${apiUrl}/api/user/getuser/${userId}`)
      .then(res => {
        setUser(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
        setPhone(res.data.phone);
      })
      .catch(err => console.error(err));
  }, [userId]);

  /* -------- UPDATE PROFILE -------- */
  const handleProfileUpdate = async () => {
    try {
      await axios.put(`${apiUrl}/api/user/update/${userId}`, {
        name, email, phone
      });
      alert("Profile updated successfully");
    } catch {
      alert("Profile update failed");
    }
  };

  /* -------- CHANGE PASSWORD -------- */
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    try {
      await axios.put(`${apiUrl}/api/user/change-password/${userId}`, {
        oldPassword,
        newPassword
      });
      alert("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      alert("Old password incorrect");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <h2 className="profile-page-title">My Profile</h2>

      <div className="profile-page-grid">

        {/* LEFT USER CARD */}
        <div className="profile-page-user-card">
          <div className="profile-page-avatar">
            {user.name.slice(0, 2).toUpperCase()}
          </div>

          <h3 className="profile-page-username">{user.name}</h3>

          <button
            className="profile-page-btn-primary"
            onClick={() => setActiveForm("profile")}
          >
            Update Profile
          </button>

          <button
            className="profile-page-btn-secondary"
            onClick={() => setActiveForm("password")}
          >
            Change Password
          </button>
        </div>

        {/* RIGHT CARD */}
        <div className="profile-page-card">

          {/* -------- PROFILE FORM -------- */}
          {activeForm === "profile" && (
            <>
              <h3 className="profile-page-section-title">Personal Information</h3>

              <div className="profile-page-form">
                <div>
                  <label className="profile-page-label">Full Name</label>
                  <input
                    className="profile-page-input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="profile-page-label">Email Address</label>
                  <input
                    className="profile-page-input"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="profile-page-label">Phone Number</label>
                  <input
                    className="profile-page-input"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>

                <button
                  className="profile-page-btn-primary save-btn"
                  onClick={handleProfileUpdate}
                >
                  Save Changes
                </button>
              </div>
            </>
          )}

          {/* -------- PASSWORD FORM -------- */}
          {activeForm === "password" && (
            <>
              <h3 className="profile-page-section-title">Change Password</h3>

              <div className="profile-page-form">
                <div>
                  <label className="profile-page-label">Old Password</label>
                  <input
                    type="password"
                    className="profile-page-input"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label className="profile-page-label">New Password</label>
                  <input
                    type="password"
                    className="profile-page-input"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label className="profile-page-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="profile-page-input"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button
                  className="profile-page-btn-secondary"
                  onClick={handlePasswordChange}
                >
                  Update Password
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}
