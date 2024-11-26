import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import api from '../services/api';
import { FiCheckCircle, FiXCircle, FiClock, FiSearch } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserDashboard = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userProfile, setUserProfile] = useState(null); // Changed to null to check loading state
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await api.get('/user/profile');
        const servicesRes = await api.get('/user/services');

        setUserProfile({
          name: profileRes.data.name,
          email: profileRes.data.email,
          appliedServices: profileRes.data.appliedServices || [],
        });

        setServices(servicesRes.data);
        setFilteredServices(servicesRes.data);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterServices(e.target.value);
  };

  const filterServices = (term) => {
    const filtered = services.filter((service) =>
      service.title.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredServices(filtered);
  };

  const applyForService = async (serviceId) => {
    try {
      await api.post(`/user/services/${serviceId}/apply`);

      const appliedService = services.find((service) => service._id === serviceId);

      setUserProfile((prevState) => ({
        ...prevState,
        appliedServices: [
          ...prevState.appliedServices,
          {
            serviceId,
            serviceTitle: appliedService.title,
            serviceDescription: appliedService.description,
            status: 'pending',
          },
        ],
      }));

      toast.success(`Applied for service successfully!`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      toast.error('Failed to create service.', { theme: "dark" });
    }
  };

  const hasAppliedForService = (serviceId) => {
    return userProfile?.appliedServices.some(
      (appliedService) => appliedService.serviceId === serviceId
    );
  };

  return (
    <div className="bg-zinc-900 min-h-screen p-4 sm:p-6 flex justify-center items-start">
      <ToastContainer />
      <div className="w-full max-w-7xl min-h-[660px] bg-zinc-800 rounded-xl shadow-lg p-4 sm:p-8 flex flex-col lg:flex-row gap-8">

        {/* Profile Section */}
        <div className="w-full lg:w-1/3 bg-zinc-700 p-6 rounded-lg shadow-md flex flex-col items-center">
          {loading ? (
            <>
              <Skeleton circle={true} height={80} width={80} />
              <Skeleton width={150} height={20} className="mt-4" />
              <Skeleton width={200} height={20} />
              <Skeleton width={250} height={20} className="mt-4" />
            </>
          ) : (
            <>
              <div className="flex flex-col items-center text-center mb-6">
                <h1 className="text-2xl sm:text-3xl text-white">My Profile</h1>
                <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-100 mt-2">{userProfile.name}</h2>
                <p className="text-base sm:text-lg text-zinc-400">{userProfile.email}</p>
              </div>

              <div className="w-full lg:h-96">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100 mb-4">Applied Services</h3>
                <div className="flex flex-col gap-4 lg:min-h-[350px] sm:max-h-72 overflow-y-auto scrollbar-hidden">
                  {userProfile.appliedServices.map((appliedService) => (
                    <div
                      key={appliedService.serviceId}
                      className="bg-zinc-600 p-4 rounded-lg shadow-md flex flex-col space-y-2"
                    >
                      <p className="text-lg font-semibold text-zinc-100">{appliedService.serviceTitle}</p>
                      <p className="text-zinc-300">{appliedService.serviceDescription}</p>
                      <div
                        className={`text-sm font-medium ${appliedService.status === 'approved'
                          ? 'text-green-500'
                          : appliedService.status === 'rejected'
                            ? 'text-red-500'
                            : 'text-yellow-500'
                          }`}
                      >
                        {appliedService.status === 'pending' && (
                          <span className="flex items-center gap-1">
                            <FiClock /> Pending
                          </span>
                        )}
                        {appliedService.status === 'approved' && (
                          <span className="flex items-center gap-1">
                            <FiCheckCircle /> Approved
                          </span>
                        )}
                        {appliedService.status === 'rejected' && (
                          <span className="flex items-center gap-1">
                            <FiXCircle /> Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Available Services Section */}
        <div className="w-full lg:w-2/3 bg-zinc-700 p-6 rounded-lg shadow-md h-[600px] overflow-y-auto scrollbar-hidden">
          {loading ? (
            Array(6)
              .fill()
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-zinc-600 p-4 rounded-lg shadow-lg hover:bg-zinc-500 transition-colors flex flex-col space-y-4"
                >
                  <Skeleton width={200} height={20} />
                  <Skeleton count={2} />
                  <Skeleton width="60%" height={30} className="mt-4" />
                </div>
              ))
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">Available Services</h3>
                <div className="relative w-full sm:w-auto">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search services..."
                    className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-md bg-zinc-600 text-zinc-100 border border-zinc-500 focus:outline-none"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredServices.map((service) => (
                  <div
                    key={service._id}
                    className="bg-zinc-600 p-4 rounded-lg shadow-lg hover:bg-zinc-500 transition-colors flex flex-col space-y-4"
                  >
                    <h4 className="text-lg font-semibold text-zinc-100">{service.title}</h4>
                    <p className="text-zinc-300">{service.description}</p>
                    <button
                      onClick={() => applyForService(service._id)}
                      disabled={hasAppliedForService(service._id)}
                      className={`mt-4 py-2 w-full rounded-md text-white transition-all ${hasAppliedForService(service._id)
                        ? 'bg-zinc-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400'
                        }`}
                    >
                      {hasAppliedForService(service._id) ? 'Already Applied' : 'Apply'}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
