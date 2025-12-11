import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/RydMateAuth.css";


export default function RydMateAuth() {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone:"",
    password: "",
    confirmPassword: "",
    userType: "customer",
  });

  const tabAuth = (e) =>{
    setIsLogin(!isLogin)
    setFormData({
      name: "",
      email: "",
      phone:"",
      password: "",
      confirmPassword: "",
      userType: "customer",
    })

  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // LOGIN
      if (isLogin) {
        const res = await axios.post(`${apiUrl}/api/user/signin`, {
          email: formData.email,
          password: formData.password,
        });

        // Save full response object
        localStorage.setItem("RydmateUserData", JSON.stringify(res.data));
        setFormData({
          name: "",
          email: "",
          phone:"",
          password: "",
          confirmPassword: "",
          userType: "customer",
        })
        // Redirect to user overview
        navigate("/user/overview");

        return;
      }

      // SIGNUP
      if (formData.password !== formData.confirmPassword) {
        setMessage("Passwords do not match!");
        setLoading(false);
        return;
      }

      await axios.post(`${apiUrl}/api/user/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
      });

      setMessage("Signup successful! Please login.");
      setIsLogin(true);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Something went wrong, try again!"
      );
    }

    setLoading(false);
    setFormData({
      name: "",
      email: "",
      phone:"",
      password: "",
      confirmPassword: "",
      userType: "customer",
    })
  };

  return (
    <div className="auth-container">
      <div className="container">
        <div className="auth-wrapper">
          <div className="auth-header">
            <h1 className="auth-logo">RydMate</h1>
            <p className="auth-tagline">Your trusted ride-sharing companion</p>
          </div>

          <div className="auth-card">
            <div className="auth-tabs">
              <button
                className={`auth-tab ${isLogin ? "active" : ""}`}
                onClick={tabAuth}
              >
                Login
              </button>
              <button
                className={`auth-tab ${!isLogin ? "active" : ""}`}
                onClick={tabAuth}
              >
                Sign Up
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="auth-input-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              <div className="auth-input-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              {!isLogin && (
                <div className="auth-input-group">
                  <label>Phone Number (What'sapp)</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number (What'sapp)"
                    required
                  />
                </div>
              )}
              <div className="auth-input-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              {!isLogin && (
                <div className="auth-input-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                  />
                </div>
              )}

              {message && (
                <p style={{ color: "red", marginBottom: "10px" }}>{message}</p>
              )}

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "Login"
                  : "Create Account"}
              </button>

              {!isLogin && (
                <p className="auth-terms">
                  By signing up, you agree to our{" "}
                  <a href="#">Terms of Service</a> and{" "}
                  <a href="#">Privacy Policy</a>
                </p>
              )}
            </form>
          </div>

          <div className="auth-footer">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                className="auth-switch"
                style={{ color: "red" }}
                onClick={tabAuth}
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
