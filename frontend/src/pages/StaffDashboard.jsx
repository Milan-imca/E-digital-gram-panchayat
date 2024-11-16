import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import api from '../services/api';
import { FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StaffDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, applicationsRes] = await Promise.all([
          api.get('/staff/services'),
          api.get('/staff/applications'),
        ]);
        setServices(servicesRes.data);
        setApplications(applicationsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingApplications(false);
        setLoadingServices(false);
      }
    };
    fetchData();
  }, []);

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const res = await api.put(`/staff/application/${applicationId}/status`, { status });
      setApplications((prevApps) =>
        prevApps.map((app) =>
          app._id === applicationId ? { ...app, status: res.data.status } : app
        )
      );
      toast.success(`Application status updated to ${status}!`);
    } catch (error) {
      toast.error('Failed to update application status.');
    }
  };

  const renderSkeletons = (count, height = '100px') =>
    Array.from({ length: count }).map((_, index) => (
      <Skeleton key={index} height={height} className="rounded-lg" />
    ));

  const renderApplications = (apps, colorClass) => (
    <>
      {loadingApplications
        ? renderSkeletons(3)
        : apps.length > 0
        ? apps.map((application) => (
            <div
              key={application._id}
              className="bg-gray-700 p-4 rounded-lg shadow-md"
            >
              <p className="text-lg font-semibold">{application.service.title}</p>
              <p className="text-sm text-gray-300">{application.service.description}</p>
              <p className="text-sm">User: {application.user.name}</p>
              <p className="text-sm">Email: {application.user.email}</p>
              {colorClass === 'yellow' && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => updateApplicationStatus(application._id, 'approved')}
                    className="bg-green-600 px-4 py-1 rounded-md hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(application._id, 'rejected')}
                    className="bg-red-600 px-4 py-1 rounded-md hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        : 'No applications found.'}
    </>
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-center mb-4">Staff Dashboard</h1>
      <ToastContainer />

      {/* Manage Applications Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-2">Manage Applications</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending Applications */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-1 text-yellow-500">
              <FiClock /> Pending Applications
            </h3>
            <div className="space-y-4 max-h-72 overflow-y-auto scrollbar-hidden">
              {renderApplications(
                applications.filter((app) => app.status === 'pending'),
                'yellow'
              )}
            </div>
          </div>

          {/* Approved Applications */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-1 text-green-500">
              <FiCheckCircle /> Approved Applications
            </h3>
            <div className="space-y-4 max-h-72 overflow-y-auto scrollbar-hidden">
              {renderApplications(
                applications.filter((app) => app.status === 'approved'),
                'green'
              )}
            </div>
          </div>

          {/* Rejected Applications */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-1 text-red-500">
              <FiXCircle /> Rejected Applications
            </h3>
            <div className="space-y-4 max-h-72 overflow-y-auto scrollbar-hidden">
              {renderApplications(
                applications.filter((app) => app.status === 'rejected'),
                'red'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Available Services Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500">Available Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {loadingServices
            ? renderSkeletons(6)
            : services.map((service) => (
                <div
                  key={service._id}
                  className="bg-gray-700 p-4 rounded-lg shadow-md transform transition-transform duration-200 hover:scale-105"
                >
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                  <p className="text-sm text-gray-300">{service.description}</p>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
