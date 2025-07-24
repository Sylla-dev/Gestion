import React, { useEffect, useRef, useState } from "react";
import { FaBars, FaUserCircle, FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Navbar({ setSidebarOpen }) {
  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) setUser(JSON.parse(localUser));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100 shadow px-4 sm:px-6 md:px-8">
      {/* Left - Sidebar toggle on mobile */}
      <div className="flex-1">
        <button
          className="btn btn-ghost md:hidden"
          aria-label="Ouvrir le menu latéral"
          onClick={() => setSidebarOpen(true)}
        >
          <FaBars size={20} />
        </button>
        <span className="text-xl font-semibold hidden sm:inline">Tableau de bord</span>
      </div>

      {/* Right - User menu */}
      <div className="flex-none" ref={menuRef}>
        <div className="dropdown dropdown-end">
          <button
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar flex items-center gap-2"
            onClick={() => setOpenMenu(!openMenu)}
            aria-haspopup="true"
            aria-expanded={openMenu}
          >
            <FaUserCircle className="text-primary text-2xl" />
            <span className="hidden sm:inline font-medium">{user?.role?.toUpperCase() || "Utilisateur"}</span>
            <FaChevronDown className={`transition-transform duration-300 ${openMenu ? "rotate-180" : ""}`} />
          </button>

          {openMenu && (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-56"
            >
              <li className="text-sm px-2 py-2 border-b border-base-300">
                <div className="flex flex-col">
                  <span className="font-bold truncate">{user?.email || "Email non défini"}</span>
                  <span className="text-xs text-gray-500">Rôle : {user?.role || "N/A"}</span>
                </div>
              </li>
              <li>
                <a
                  onClick={handleLogout}
                  className="text-error hover:bg-error hover:text-error-content"
                >
                  <FaSignOutAlt />
                  Se déconnecter
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
