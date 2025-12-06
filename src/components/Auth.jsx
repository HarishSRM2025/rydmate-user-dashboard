import { useState } from "react";
import '../styles/RydMateAuth.css';


export default function RydMateAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "rider",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log("Login:", { email: formData.email, password: formData.password });
      alert("Login successful!");
    } else {
      console.log("Signup:", formData);
      alert("Signup successful!");
    }
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
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`auth-tab ${!isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(false)}
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
              />
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>

            {!isLogin && (
              <>
                <div className="auth-input-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                  />
                </div>

              </>
            )}

            {isLogin && (
              <div className="auth-forgot">
                <a href="#">Forgot password?</a>
              </div>
            )}

            <button type="submit" className="auth-submit">
              {isLogin ? "Login" : "Create Account"}
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
            <button className="auth-switch" style={{color:'red'}} onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
