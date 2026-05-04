import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [showLogout, setShowLogout] = useState(false);
  const [visitors, setVisitors] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [preRegs, setPreRegs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const [v, e, p] = await Promise.all([
        api.get("/get/visitors/details", { headers }),
        api.get("/get/employees/details", { headers }),
        api.get("/get/preregister/details", { headers }),
      ]);

      setVisitors(v.data);
      setEmployees(e.data);
      setPreRegs(p.data);
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => window.location.pathname === path;

  // ✅ FILTER FUNCTION (no filtering if empty search)
  const filterData = (data) => {
    if (!search.trim()) return data;

    return data.filter((item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.mobile_no?.includes(search) ||
      item.email?.toLowerCase().includes(search.toLowerCase())
    );
  };

  const filteredVisitors = filterData(visitors);
  const filteredEmployees = filterData(employees);
  const filteredPreRegs = filterData(preRegs);

  // ✅ HIGHLIGHT FUNCTION (fixes spacing bug)
  const highlightText = (text) => {
    if (!search.trim()) return text;

    const regex = new RegExp(`(${search})`, "gi");

    return text.split(regex).map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <mark key={index} className="bg-yellow-300 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Combine all search results
  const allResults = [
    ...filteredVisitors,
    ...filteredEmployees,
    ...filteredPreRegs,
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

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
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-8">

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Dashboard
        </h1>

        {/* 🔍 SEARCH INPUT */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search visitors, employees, prereg..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border rounded-lg shadow-sm"
          />
        </div>

        {/* 📊 COUNTS */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h2>Total Visitors</h2>
            <p className="text-3xl font-bold text-indigo-600">
              {filteredVisitors.length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h2>Total Employees</h2>
            <p className="text-3xl font-bold text-indigo-600">
              {filteredEmployees.length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h2>Total PreRegistrations</h2>
            <p className="text-3xl font-bold text-indigo-600">
              {filteredPreRegs.length}
            </p>
          </div>
        </div>

        {/* 🔍 RESULTS (only show when user types) */}
        {search.trim() !== "" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Search Results</h2>

            {allResults.length === 0 ? (
              <p>No results found</p>
            ) : (
              allResults.map((item, index) => (
                <div key={index} className="border-b py-3">
                  <p><b>{highlightText(item.name)}</b></p>
                  <p>{highlightText(item.mobile_no)}</p>
                  <p>{highlightText(item.email)}</p>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}