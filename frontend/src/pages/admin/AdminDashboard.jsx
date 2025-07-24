import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { api } from "../../services/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaLayerGroup,
} from "react-icons/fa";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    eleves: 0,
    enseignants: 0,
    matieres: 0,
    classes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/dashboard/stats");
        setStats(res.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const data = [
    { name: "Élèves", total: stats.eleves, color: "#3b82f6" },
    { name: "Enseignants", total: stats.enseignants, color: "#10b981" },
    { name: "Matières", total: stats.matieres, color: "#facc15" },
    { name: "Classes", total: stats.classes, color: "#ef4444" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-4 text-lg font-semibold">Chargement des statistiques...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-xl mx-auto mt-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
          />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">
          Tableau de bord – Admin
        </h1>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Élèves" icon={<FaUserGraduate size={32} />} value={stats.eleves} bg="bg-blue-500" />
          <StatCard title="Enseignants" icon={<FaChalkboardTeacher size={32} />} value={stats.enseignants} bg="bg-green-500" />
          <StatCard title="Matières" icon={<FaBook size={32} />} value={stats.matieres} bg="bg-yellow-400" />
          <StatCard title="Classes" icon={<FaLayerGroup size={32} />} value={stats.classes} bg="bg-red-500" />
        </div>

        {/* GRAPHIQUE */}
        <div className="mt-8 card bg-base-100 shadow-md p-4 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Statistiques visuelles</h2>
          <div className="w-full h-[320px] min-w-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {data.map((entry) => (
                  <Bar key={entry.name} dataKey="total" fill={entry.color} name={entry.name} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PLACE FOR SUBROUTES */}
        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bg }) {
  return (
    <div className={`card ${bg} text-white shadow-md`}>
      <div className="card-body flex items-center gap-4">
        <div className="text-white">{icon}</div>
        <div>
          <h3 className="card-title text-base">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
