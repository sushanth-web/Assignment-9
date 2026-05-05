import { Link, useNavigate, Outlet } from "react-router-dom";
import { useState } from "react";

export default function Layout() {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => window.location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* Sidebar */}
      <div className="w-64 bg-indigo-600 text-white flex flex-col justify-between">
        <div>
          <div className="p-6 text-2xl font-bold text-center border-b border-indigo-500">
            Admin Panel
          </div>

          <nav className="mt-6">
            {[
              ["/dashboard", "Dashboard"],
              ["/visitors", "Visitors"],
              ["/employees", "Employees"],
              ["/preregister", "Pre-Registrations"],
              ["/checkinout", "Check In / Out"],
            ].map(([path, label]) => (
              <Link
                key={path}
                to={path}
                className={`block py-3 px-6 ${
                  isActive(path)
                    ? "bg-indigo-500 font-semibold"
                    : "hover:bg-indigo-500"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-indigo-500">
          <button
            onClick={() => setShowLogout(true)}
            className="w-full bg-red-500 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>

      {/* Logout Modal */}
      {showLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-80">
            <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowLogout(false)}>Cancel</button>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}