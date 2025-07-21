import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddComplaint() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [contact, setContact] = useState('');
  const [image, setImage] = useState(null);
  const [ward, setWard] = useState(''); // New field: Ward/Area
  const [landmark, setLandmark] = useState(''); // New field: Nearby Landmark
  const [dateReported, setDateReported] = useState(new Date().toISOString().split('T')[0]); // New field: Date Reported
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('category', category);
      formData.append('severity', severity);
      formData.append('preferredTime', preferredTime);
      formData.append('anonymous', anonymous);
      formData.append('contact', anonymous ? 'Anonymous' : contact);
      formData.append('ward', ward);
      formData.append('landmark', landmark);
      formData.append('dateReported', dateReported);
      if (image) formData.append('image', image);

      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit complaint');
      // Navigate to dashboard with success state
      navigate('/citizen-dashboard', { state: { complaintSubmitted: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
        },
        (error) => {
          console.error(error);
          alert('Unable to detect location. Please enter it manually or ensure location services are enabled.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          📝 Report a New Civic Issue
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Your voice helps us improve our community. Please fill out the details below.
        </p>
        {message && <div className="mb-4 text-green-600 text-center font-semibold">{message}</div>}
        {error && <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">Complaint Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="title"
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-150 ease-in-out"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Pothole on Main Street"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
            <select
              id="category"
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-150 ease-in-out"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select an Issue Category</option>
              <option value="Roads & Pavements">🛣️ Roads & Pavements</option>
              <option value="Water Supply & Drainage">💧 Water Supply & Drainage</option>
              <option value="Electricity & Streetlights">💡 Electricity & Streetlights</option>
              <option value="Waste Management">🗑️ Waste Management</option>
              <option value="Public Health & Sanitation">🏥 Public Health & Sanitation</option>
              <option value="Parks & Recreation">🌳 Parks & Recreation</option>
              <option value="Public Safety">🚨 Public Safety</option>
              <option value="Others">❓ Others</option>
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">Detailed Description <span className="text-red-500">*</span></label>
            <textarea
              id="description"
              rows="4"
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-150 ease-in-out"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more details about the issue, e.g., location specifics, impact, duration."
              required
            />
          </div>

          {/* Severity */}
          <div>
            <label htmlFor="severity" className="block text-sm font-semibold text-gray-700 mb-1">Severity Level <span className="text-red-500">*</span></label>
            <select
              id="severity"
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-150 ease-in-out"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              required
            >
              <option value="">Assess Impact/Urgency</option>
              <option value="Low">🟢 Low (Minor inconvenience, not urgent)</option>
              <option value="Medium">🟠 Medium (Moderate impact, needs attention)</option>
              <option value="High">🔴 High (Significant impact, urgent action required)</option>
              <option value="Critical">🔥 Critical (Immediate danger or severe widespread impact)</option>
            </select>
          </div>
          
          {/* Location with Detect */}
          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1">Specific Location (Lat/Long) <span className="text-red-500">*</span></label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="location"
                className="mt-1 flex-1 border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-150 ease-in-out"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., 18.5204, 73.8567"
                required
              />
              <button
                type="button"
                onClick={handleDetectLocation}
                className="inline-flex items-center justify-center p-3 mt-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out shadow-md"
                title="Detect My Current Location"
              >
                📍 Detect
              </button>
            </div>
          </div>

          {/* Ward/Area */}
          <div>
            <label htmlFor="ward" className="block text-sm font-semibold text-gray-700 mb-1">Ward/Area (e.g., Shivajinagar, Kothrud)</label>
            <input
              type="text"
              id="ward"
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-150 ease-in-out"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              placeholder="e.g., Ward 7, Deccan Gymkhana"
            />
          </div>

          {/* Nearby Landmark */}
          <div>
            <label htmlFor="landmark" className="block text-sm font-semibold text-gray-700 mb-1">Nearby Landmark / Address</label>
            <input
              type="text"
              id="landmark"
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-150 ease-in-out"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g., Near ABC Garden, Opposite XYZ School"
            />
          </div>

          {/* Date Reported (Pre-filled) */}
          <div>
            <label htmlFor="dateReported" className="block text-sm font-semibold text-gray-700 mb-1">Date Reported</label>
            <input
              type="date"
              id="dateReported"
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 bg-gray-50 cursor-not-allowed"
              value={dateReported}
              onChange={(e) => setDateReported(e.target.value)}
              readOnly
              title="This field is automatically set to today's date."
            />
          </div>

          {/* Preferred Time for Visit */}
          <div>
            <label htmlFor="preferredTime" className="block text-sm font-semibold text-gray-700 mb-1">Preferred Time for Inspection/Visit (Optional)</label>
            <input
              type="time"
              id="preferredTime"
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-150 ease-in-out"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
            />
          </div>

          {/* Contact Info (optional) */}
          {!anonymous && (
            <div>
              <label htmlFor="contact" className="block text-sm font-semibold text-gray-700 mb-1">Your Contact Info (Email/Phone) <span className="text-gray-400">(Optional for updates)</span></label>
              <input
                type="text"
                id="contact"
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-150 ease-in-out"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="e.g., your.email@example.com or 9876543210"
              />
            </div>
          )}

          {/* Anonymous Option */}
          <div className="flex items-center pt-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={anonymous}
              onChange={() => setAnonymous(!anonymous)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="anonymous" className="ml-2 block text-base font-medium text-gray-700 select-none">
              Submit Anonymously
            </label>
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1">Upload Photo/Evidence (Optional)</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-150 ease-in-out cursor-pointer"
              onChange={handleImageUpload}
            />
            {image && (
              <p className="mt-2 text-sm text-gray-500">Selected file: {image.name}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 text-center mt-6">
            <button
              type="submit"
              className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md shadow-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:scale-105"
              disabled={loading}
            >
              {loading ? 'Submitting...' : '🚀 Submit Your Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}