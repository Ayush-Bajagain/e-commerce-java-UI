import { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Calendar, Clock } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import Swal from 'sweetalert2';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/users/get-profile`,
        {},
        {
          withCredentials: true
        }
      );

      if (response.data.httpStatus === 'OK') {
        setProfile(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error.response?.data?.message || 'Failed to fetch profile');
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to fetch profile',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
          <button
            onClick={fetchProfile}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <User className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile?.username}</h1>
              <p className="text-gray-500">{profile?.roleName?.roleName}</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="text-gray-900">{profile?.email}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="text-gray-900">{profile?.phoneNumber}</p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="text-gray-900">{profile?.roleName?.roleName}</p>
                </div>
              </div>

              {/* Account Created */}
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Account Created</p>
                  <p className="text-gray-900">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Last Updated */}
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-gray-900">
                    {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors duration-200">
            Edit Profile
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors duration-200">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 