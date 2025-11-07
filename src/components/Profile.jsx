import React from 'react';
import '../styles/profile.css';

export default function Profile({ user }) {
  return (
    <>
      <h2 className="profile-page-title">My Profile</h2>

      <div className="profile-page-grid">

        {/* LEFT USER CARD */}
        <div className="profile-page-user-card">
          <div className="profile-page-avatar">{user.initials}</div>

          <h3 className="profile-page-username">{user.name}</h3>
          <p className="profile-page-member-since">
            Member since {new Date(user.memberSince).toLocaleDateString()}
          </p>

          <button className="profile-page-btn-primary">
            <i className="fas fa-edit"></i> Edit Profile
          </button>

          <button className="profile-page-btn-secondary">
            <i className="fas fa-key"></i> Change Password
          </button>
        </div>

        {/* RIGHT FORM CARD */}
        <div className="profile-page-card">
          <h3 className="profile-page-section-title">Personal Information</h3>

          <div className="profile-page-form">
            <div>
              <label className="profile-page-label">Full Name</label>
              <input className="profile-page-input" defaultValue={user.name} />
            </div>

            <div>
              <label className="profile-page-label">Email Address</label>
              <input className="profile-page-input" defaultValue={user.email} />
            </div>

            <div>
              <label className="profile-page-label">Phone Number</label>
              <input className="profile-page-input" defaultValue={user.phone} />
            </div>

            <div>
              <label className="profile-page-label">Address</label>
              <textarea className="profile-page-input" rows={3} placeholder="Enter your address" />
            </div>

            <button className="profile-page-btn-primary save-btn">
              <i className="fas fa-save"></i> Save Changes
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
