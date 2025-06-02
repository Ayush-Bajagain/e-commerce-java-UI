import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Update profile information
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800">Please log in to view your profile</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={profileData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={profileData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={profileData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={profileData.address}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors duration-200"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile; 