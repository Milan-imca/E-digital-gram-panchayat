import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FiEdit, FiTrash, FiCheck, FiX } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

const AdminDashboard = () => {
  const [services, setServices] = useState([]);
  const [applications, setApplications] = useState([]);
  const [newService, setNewService] = useState({ title: '', description: '' });
  const [editServiceId, setEditServiceId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesRes = await api.get('/admin/services');
        const applicationsRes = await api.get('/admin/applications');
        setServices(servicesRes.data);
        setApplications(applicationsRes.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  const handleNewServiceChange = (e) => setNewService({ ...newService, [e.target.name]: e.target.value });

  const createService = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/service', newService);
      setServices([...services, res.data]);
      setNewService({ title: '', description: '' });
      // Display success toast notification
      toast.success('Service created successfully!', {
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
      console.error('Error creating service', error);
      toast.error('Failed to create service.', { theme: "colored" }); // Error toast if needed
    }
  };

  const handleEditServiceChange = (e, serviceId) => {
    const { name, value } = e.target;
    setServices(services.map(service =>
      service._id === serviceId ? { ...service, [name]: value } : service
    ));
  };

  const startEditService = (serviceId) => setEditServiceId(serviceId);

  const cancelEditService = () => setEditServiceId(null);

  const updateService = async (serviceId) => {
    const updatedService = services.find(service => service._id === serviceId);
    try {
      const res = await api.put(`/admin/service/${serviceId}`, updatedService);
      setServices(services.map(service =>
        service._id === serviceId ? res.data : service
      ));
      setEditServiceId(null);
      toast.success('Service updated successfully!', {
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
      console.error('Error updating service', error);
      toast.error('Failed to update service.', {
        theme: "colored",
        position: "top-center",
      });
    }
  };

  const deleteService = async (serviceId) => {
    try {
      await api.delete(`/admin/service/${serviceId}`);
      setServices(services.filter(service => service._id !== serviceId));
      // Display success toast notification
      toast.success('Service deleted successfully!', {
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
      console.error('Error deleting service', error);
      // Display error toast notification
      toast.error('Failed to delete service.', {
        theme: "colored",
        position: "top-center",
      });
    }
  };


  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const res = await api.put(`/admin/application/${applicationId}/status`, { status });
      setApplications(applications.map(app =>
        app._id === applicationId ? { ...app, status: res.data.status } : app
      ));
      // Display success toast notification
      toast.success(`Application status updated to ${status}!`, {
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
      console.error('Error updating status', error);
      // Display error toast notification
      toast.error('Failed to update application status.', {
        theme: "colored",
        position: "top-center",
      });
    }
  };


  return (
    <div className="bg-zinc-900 min-h-screen p-6 flex flex-col gap-8 text-zinc-200">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>
      <ToastContainer />

      {/* Create Service Form */}
      <div className="bg-zinc-800 shadow-md p-6 rounded-lg mb-8 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Create Service</h2>
        <form onSubmit={createService} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Service Title"
            value={newService.title}
            onChange={handleNewServiceChange}
            className="w-full p-3 rounded-md border border-zinc-600 bg-zinc-700 text-zinc-200"
          />
          <textarea
            name="description"
            placeholder="Service Description"
            value={newService.description}
            onChange={handleNewServiceChange}
            className="w-full p-3 rounded-md border border-zinc-600 bg-zinc-700 text-zinc-200"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 rounded-md text-white hover:bg-blue-500 transition-all"
          >
            Create Service
          </button>
        </form>
      </div>

      {/* Manage Services Section */}
      <div className="bg-zinc-800 shadow-md p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Manage Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service._id} className="bg-zinc-700 p-4 rounded-lg shadow-md border border-zinc-600 relative">
              {editServiceId === service._id ? (
                <>
                  <input
                    type="text"
                    name="title"
                    value={service.title}
                    onChange={(e) => handleEditServiceChange(e, service._id)}
                    className="w-full p-2 rounded-md border border-zinc-600 bg-zinc-700 text-zinc-200 mb-2"
                  />
                  <textarea
                    name="description"
                    value={service.description}
                    onChange={(e) => handleEditServiceChange(e, service._id)}
                    className="w-full p-2 rounded-md border border-zinc-600 bg-zinc-700 text-zinc-200 mb-2"
                  />
                  <div className="flex justify-between mt-2">
                    <button
                      onClick={() => updateService(service._id)}
                      className="py-1 px-2 bg-green-600 rounded-md text-white hover:bg-green-500 transition-all flex items-center"
                    >
                      <FiCheck className="mr-1" /> Save
                    </button>
                    <button
                      onClick={cancelEditService}
                      className="py-1 px-2 bg-red-600 rounded-md text-white hover:bg-red-500 transition-all flex items-center"
                    >
                      <FiX className="mr-1" /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-zinc-200">{service.title}</h3>
                  <p className="text-zinc-400 mt-2">{service.description}</p>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => startEditService(service._id)}
                      className="py-1 px-2 bg-blue-600 rounded-md text-white hover:bg-blue-500 transition-all flex items-center"
                    >
                      <FiEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => deleteService(service._id)}
                      className="py-1 px-2 bg-red-600 rounded-md text-white hover:bg-red-500 transition-all flex items-center"
                    >
                      <FiTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Manage Applications Section */}



      <div className="bg-zinc-800 shadow-md p-6 rounded-lg mt-8">
        <h2 className="text-2xl font-semibold mb-4">Manage Applications</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((application) => (
            <div
              key={application._id}
              className={`p-4 rounded-lg shadow-md border border-zinc-600 flex flex-col ${application.status === 'approved'
                ? 'bg-green-500'
                : application.status === 'rejected'
                  ? 'bg-red-500'
                  : 'bg-yellow-500'
                }`}
            >
              <p className="text-zinc-300"><strong>User:</strong> {application.user.name}</p>
              <p className="text-zinc-300 mt-1"><strong>Service:</strong> {application.service.title}</p>
              <p className="text-zinc-300 mt-1"><strong>Status:</strong> {application.status}</p>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => updateApplicationStatus(application._id, 'approved')}
                  className="py-1 px-3 bg-green-600 rounded-md text-white hover:bg-green-500 transition-all flex items-center"
                >
                  <FiCheck className="mr-1" /> Approve
                </button>
                <button
                  onClick={() => updateApplicationStatus(application._id, 'rejected')}
                  className="py-1 px-3 bg-red-600 rounded-md text-white hover:bg-red-500 transition-all flex items-center"
                >
                  <FiX className="mr-1" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
