// src/pages/StoreDashboard.jsx
import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../auth/AuthContext";

const Star = ({ filled, size = "text-xl" }) => (
  <span className={`${filled ? "text-yellow-400" : "text-gray-300"} ${size}`}>
    ★
  </span>
);

const RatingsTable = ({ ratings }) => {
  const [sortConfig, setSortConfig] = useState({
    key: "userEmail",
    direction: "asc",
  });

  const sortedRatings = [...ratings].sort((a, b) => {
    let valueA, valueB;

    switch (sortConfig.key) {
      case "rating":
        valueA = a.rating;
        valueB = b.rating;
        break;
      case "date":
        valueA = new Date(a.createdAt);
        valueB = new Date(b.createdAt);
        break;
      default: 
        valueA = a.userEmail.toLowerCase();
        valueB = b.userEmail.toLowerCase();
    }

    if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getArrow = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th
              onClick={() => requestSort("userEmail")}
              className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer"
            >
              User Email {getArrow("userEmail")}
            </th>
            <th
              onClick={() => requestSort("rating")}
              className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer"
            >
              Rating {getArrow("rating")}
            </th>
            <th
              onClick={() => requestSort("date")}
              className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer"
            >
              Date {getArrow("date")}
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Comment
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedRatings.map((rating, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-800">
                {rating.userEmail}
              </td>
              <td className="px-6 py-4 text-sm text-yellow-600 font-bold">
                {rating.rating} ★
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(rating.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 italic">
                {rating.comment || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// -Main Store Dashboard -
const StoreDashboard = () => {
  const { auth, logout } = useAuth();
  const [storeData, setStoreData] = useState({
    ratings: [],
    averageRating: 0,
    totalRatings: 0,
  });
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/store/ratings");

      setStoreData({
        ratings: res.data.ratings || [],
        averageRating: parseFloat(res.data.averageRating) || 0,
        totalRatings: res.data.totalRatings || 0,
      });
    } catch (err) {
      console.error("Error fetching store data:", err);
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password))
      return "Must contain at least one uppercase letter";
    if (
      !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    )
      return "Must contain at least one special character";
    return "";
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    const error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      return;
    }

    setUpdating(true);
    try {
      await API.put("/store/update-password", { newPassword: password });
      alert("Password updated successfully");
      setPassword("");
      setPasswordError("");
    } catch (err) {
      console.error("Password update error:", err);
      alert("Failed to update password");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome, {auth?.user?.name || "Store Owner"}!
              </h1>
              <p className="text-gray-600 flex items-center">
                <span className="mr-2">📊</span>
                Manage your store ratings and profile
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Store Manager</p>
              <p className="font-semibold text-purple-600">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white rounded-2xl shadow-md p-2 mb-6">
          <button
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
              activeTab === "overview"
                ? "bg-purple-100 text-purple-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            📈 Overview
          </button>
          <button
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
              activeTab === "ratings"
                ? "bg-purple-100 text-purple-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("ratings")}
          >
            ⭐ Ratings
          </button>
          <button
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
              activeTab === "settings"
                ? "bg-purple-100 text-purple-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            ⚙️ Settings
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Average Rating Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Average Rating
                </h3>
                <span className="p-2 bg-purple-100 rounded-lg">⭐</span>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} filled={storeData.averageRating >= star} />
                  ))}
                </div>
                <p className="text-4xl font-bold text-gray-800 mb-2">
                  {storeData.averageRating.toFixed(1)}
                </p>
                <p className="text-gray-500">out of 5 stars</p>
              </div>
            </div>

            {/* Total Ratings Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Ratings
                </h3>
                <span className="p-2 bg-purple-100 rounded-lg">📊</span>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-800 mb-2">
                  {storeData.totalRatings}
                </p>
                <p className="text-gray-500">customer ratings</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Activity
              </h3>
              {storeData.ratings.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">😴</div>
                  <p className="text-gray-500">No ratings received yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {storeData.ratings.slice(0, 3).map((rating, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{rating.userEmail}</p>
                        <p className="text-sm text-gray-500">
                          User ID: {rating.userId}
                        </p>
                      </div>
                      <span className="text-yellow-500 font-bold text-xl">
                        {rating.rating} ★
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ratings Tab with Sorting */}
        {activeTab === "ratings" && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">All Ratings</h2>
            {storeData.ratings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No ratings yet
                </h3>
                <p className="text-gray-500">
                  Your store hasn't received any ratings yet.
                </p>
              </div>
            ) : (
              <RatingsTable ratings={storeData.ratings} />
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Account Settings
            </h2>
            <form onSubmit={handlePasswordUpdate} className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <span className="mr-2">🔒</span>
                  Update Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                    passwordError
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-purple-500"
                  }`}
                  placeholder="Enter new password"
                  required
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="mr-1">❌</span>
                    {passwordError}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-2">
                  8-16 characters with at least one uppercase letter and one
                  special character
                </p>
              </div>
              <button
                type="submit"
                disabled={updating || !password}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                  updating || !password
                    ? "bg-gray-400 cursor-not-allowed text-gray-600"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-2xl"
                }`}
              >
                {updating ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating...
                  </span>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Logout Button */}
        <div className="text-center">
          <button
            onClick={logout}
            className="inline-flex items-center text-gray-600 hover:text-red-600 transition-colors py-2 px-4 rounded-lg hover:bg-red-50"
          >
            <span className="mr-2">🚪</span>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard;
