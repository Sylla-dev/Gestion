import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, } from "react-router-dom";

import {
  FaTachometerAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaSchool,
  FaCalendarAlt,
  FaBook,
  FaClipboardList,
  FaSignOutAlt,
  FaCalendar,
  FaDiscourse,
} from "react-icons/fa";

export default function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      setUser(JSON.parse(localUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
    setOpen(false);
  };

  // Menu par défaut (admin)
  const adminMenu = [
    { path: "/", label: "Tableau de bord", icon: <FaTachometerAlt /> },
    { path: "/admin/eleves", label: "Élèves", icon: <FaUserGraduate /> },
    { path: "/admin/teachers", label: "Enseignants", icon: <FaChalkboardTeacher /> },
    { path: "/admin/classes", label: "Classes", icon: <FaSchool /> },
    { path: "/admin/emplois", label: "Emplois du temps", icon: <FaCalendarAlt /> },
    { path: "/admin/matieres", label: "Matières", icon: <FaBook /> },
    { path: "/admin/notes", label: "Notes", icon: <FaClipboardList /> },
    { path: "/admin/pages", label: "Liste d'emplois", icon: <FaCalendar /> },
    { path: "/teachers/cours", label: "Liste des cours", icon: <FaDiscourse /> },
  ];

  // Menu enseignants
  const enseignantMenu = [
    { path: "/dashboard", label: "Tableau de bord", icon: <FaTachometerAlt /> },
    { path: "/teachers/cours", label: "Mes cours", icon: <FaBook /> },
    { path: "/teachers/notes", label: "Notes", icon: <FaClipboardList /> },
  ];

  // Menu élèves
  const eleveMenu = [
    { path: "/dashboard", label: "Tableau de bord", icon: <FaTachometerAlt /> },
    { path: `/admin/bulletin/${user?.id}`, label: "Mon bulletin", icon: <FaBook /> },
  ];

  // Choix menu selon rôle
  let menu = adminMenu;
  if (user?.role === "enseignant") {
    menu = enseignantMenu;
  } else if (user?.role === "etudiant") {
    menu = eleveMenu;
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        aria-label="Sidebar navigation"
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-base-200 border-r border-gray-300 transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:inset-auto`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-300 bg-base-100 text-primary font-extrabold text-2xl">
          Dashboard
        </div>

        {/* Menu */}
        <nav className="flex flex-col px-4 py-6 space-y-2" role="menu" aria-label="Main menu">
          {menu.map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={path}
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                 ${
                   isActive
                     ? "bg-primary text-primary-content font-semibold"
                     : "text-base-content hover:bg-primary hover:text-primary-content"
                 }`
              }
              role="menuitem"
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-3 px-3 py-2 rounded-md text-error hover:bg-error hover:text-error-content transition-colors focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-1"
            role="menuitem"
            aria-label="Se déconnecter"
          >
            <FaSignOutAlt size={18} />
            <span>Déconnexion</span>
          </button>
        </nav>
      </aside>

    </div>
  );
}
