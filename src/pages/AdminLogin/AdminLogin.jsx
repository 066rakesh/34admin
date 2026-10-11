import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuEye, LuEyeOff, LuUtensilsCrossed } from "react-icons/lu";
import styles from "./AdminLogin.module.css";
import { adminLogin } from "../../services/adminService";

export const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      return setError("Enter a valid email and password.");
    }

    try {
      setLoading(true);
      const res = await adminLogin({ email, password });
      localStorage.setItem("adminToken", res.data.token);
      navigate("/");
    } catch (err) {
      console.error("Admin login failed", err);
      setError(error.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <LuUtensilsCrossed size={24} />
          </div>
          <h3 className={styles.title}>34 Admin</h3>
          <p className={styles.subtitle}>Sign in to manage your cafe</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            placeholder="admin@34cafe.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <label className={styles.label}>Password</label>
          <div className={styles.passwordRow}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {!showPassword ? <LuEyeOff size={17} /> : <LuEye size={17} />}
            </button>
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <button type="submit" className={styles.signInBtn} disabled={loading}>
            {loading ? (
              <>
                <span className={styles.spinner} />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className={styles.footerNote}>
          Restricted access &middot; Authorized personnel only
        </p>
      </div>
    </div>
  );
};
