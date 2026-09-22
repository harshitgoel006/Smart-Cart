import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/AuthProvider";
import { SimpleAccountPage } from "./SimpleAccountPage";
export function AccountPage() {
  const { user, logout, loading } = useAuth();
  const [message, setMessage] = useState("");
  if (loading)
    return (
      <main className="section empty-page">
        <h1>Loading account...</h1>
      </main>
    );
  if (!user)
    return (
      <SimpleAccountPage
        title="Your account"
        text="Sign in to manage your profile, addresses and orders."
        link="/login"
        linkText="Sign in"
      />
    );
  const handleLogout = async () => {
    await logout();
    setMessage("You have been signed out.");
  };
  return (
    <main className="account-page section">
      <span className="eyebrow">Your SmartCart</span>
      <h1>Hello, {user.fullname || user.username || "there"}.</h1>
      <p>{user.email}</p>
      <div className="account-actions">
        <Link className="primary-button" to="/cart">
          View bag <span>↗</span>
        </Link>
        <button className="ghost-dark-button" onClick={handleLogout}>
          Sign out
        </button>
      </div>
      {message && <div className="inline-message">{message}</div>}
    </main>
  );
}
