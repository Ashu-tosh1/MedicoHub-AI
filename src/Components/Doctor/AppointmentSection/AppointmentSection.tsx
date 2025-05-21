/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Clock, Search } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

import { appointment } from "@/lib/mockData";
import SidebarContent from "../DoctorSidebar/DoctorSidebar";

const Appointments = () => {
    const { user } = useUser();
    const [filter, setFilter] = useState("upcoming");
    const [searchTerm, setSearchTerm] = useState("");
    const [appointments, setAppointments] = useState<appointment[]>([] );

  const fetchAppointments = async () => {
    if (!user?.id) return;

    try {
      const res = await axios.post("/api/doctor/appointments", {
        clerkUserId: user.id,
      });
      setAppointments(res.data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user?.id]);

  const handleUpdateStatus = async (appointmentId: string, newStatus: string) => {
    try {
      await axios.post("/api/doctor/updateappointments", {
        appointmentId,
        status: newStatus,
      });
      fetchAppointments(); // Refresh data
    } catch (error) {
      console.error("Failed to update appointment status:", error);
    }
  };

  const filteredAppointments:appointment[] = appointments.filter((appointment) => {
    const patientName = appointment.patient?.name || '';
    const matchesSearch =
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase());

    const status = appointment.status.toLowerCase();

    if (filter === "upcoming") {
      return matchesSearch && (status === "confirmed" || status === "pending");
    } else if (filter === "confirmed") {
      return matchesSearch && status === "confirmed";
    } else if (filter === "pending") {
      return matchesSearch && status === "pending";
    } else if (filter === "cancelled") {
      return matchesSearch && status === "cancelled";
    }
    return matchesSearch;
  });
    
  return (
    <div className="flex">
      {/* <SidebarContent  /> */}
     
        <SidebarContent  /> 
       
      <div className="flex-1  transition-all duration-300">
        
        <div className="p-6 bg-blue-50 min-h-screen">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-blue-800 mt-8 lg:mt-0">
              Appointments
            </h1>
            <p className="text-gray-600">
              Manage your upcoming patient appointments
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search appointments..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              {["upcoming", "confirmed", "pending", "cancelled"].map((status) => (
                <button
                  key={status}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    filter === status
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
                  onClick={() => setFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

       
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-600" />
        Your appointments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAppointments.slice(0, 3).map((appointment) => (
                <div
                  key={appointment.id}
                  className="border border-gray-100 p-4 rounded-lg hover:shadow-md transition-shadow duration-200 bg-gradient-to-r from-blue-50 to-white"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-blue-800">
                      {appointment.patient?.name || "Unknown"}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        appointment.status === "CONFIRMED"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {appointment.status.toLowerCase()}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    {appointment.type}
                  </div>
                  <div className="flex items-center mt-3 text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1 text-blue-500" />
                    {appointment.time} -{" "}
                    {new Date(appointment.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                All Appointments
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="hover:bg-blue-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {appointment.patient?.name || "Unknown"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(appointment.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-900">
                          {appointment.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            appointment.status === "CONFIRMED"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {appointment.status.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        {appointment.status === "PENDING" && (
                          <>
                            <button
                              className="mr-2 text-green-600 hover:text-green-800"
                              onClick={() =>
                                handleUpdateStatus(appointment.id, "CONFIRMED")
                              }
                            >
                              Accept
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() =>
                                handleUpdateStatus(appointment.id, "CANCELLED")
                              }
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {appointment.status !== "PENDING" && (
                          <span className="text-gray-500">No action</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
