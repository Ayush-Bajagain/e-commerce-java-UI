import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { isAuthenticated } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    marketingEmails: false,
    darkMode: false,
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Save settings
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800">Please log in to view settings</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      className="sr-only peer"
                      checked={settings.emailNotifications}
                      onChange={handleChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Order Updates</label>
                    <p className="text-sm text-gray-500">Get notified about your order status</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="orderUpdates"
                      className="sr-only peer"
                      checked={settings.orderUpdates}
                      onChange={handleChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Marketing Emails</label>
                    <p className="text-sm text-gray-500">Receive marketing and promotional emails</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="marketingEmails"
                      className="sr-only peer"
                      checked={settings.marketingEmails}
                      onChange={handleChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Appearance</h2>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Dark Mode</label>
                  <p className="text-sm text-gray-500">Switch between light and dark theme</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="darkMode"
                    className="sr-only peer"
                    checked={settings.darkMode}
                    onChange={handleChange}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors duration-200"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings; 