import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Cloud, Droplets, Thermometer, Zap} from 'lucide-react';

export default function CropRecommendation() {
  const [formData, setFormData] = useState({
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });
  const navigate = useNavigate();
  const [recommendations,setRecommendations] = useState(null);
  const [loading,setLoading]= useState(false);

 const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const callMLModel = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          temperature: parseFloat(formData.temperature),
          humidity: parseFloat(formData.humidity),
          ph: parseFloat(formData.ph),
          rainfall: parseFloat(formData.rainfall)
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }
      
      const result = await response.json();
      return result.crop;
    } catch (error) {
      console.error('Error calling ML model:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const recommendedCrop = await callMLModel();
      setRecommendations(recommendedCrop);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      alert('Failed to get crop recommendation. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-amber-600 hover:text-amber-700"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </button>
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-gray-900">Crop Recommendation System</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Farm Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Temperature */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Thermometer size={16} className="inline mr-2" />
                  Average Temperature (°C)
                </label>
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  placeholder="e.g., 28"
                  step="0.1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Droplets size={16} className="inline mr-2" />
                  Humidity (%)
                </label>
                <input
                  type="number"
                  name="humidity"
                  value={formData.humidity}
                  onChange={handleInputChange}
                  placeholder="e.g., 75"
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Cloud size={16} className="inline mr-2" />
                  Rainfall (mm)
                </label>
                <input
                  type="number"
                  name="rainfall"
                  value={formData.rainfall}
                  onChange={handleInputChange}
                  placeholder="e.g., 1200"
                  step="0.1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Zap size={16} className="inline mr-2" />
                  Soil pH level
                </label>
                <input
                  type="number"
                  name="ph"
                  value={formData.ph}
                  onChange={handleInputChange}
                  placeholder="e.g., 6.5"
                  min="0"
                  max="14"
                  step="0.1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50 diabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Analyzing...': 'Get Crop Recommendation'}
              </button>
            </form>
          </div>
          {/* Results */}

          <div className='bg-whote rounded-xl shadow-md p-6'>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recommendations</h2>
            {
              loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                  <span className="ml-4 text-gray-600"> Running ML model analysis ...</span>
                </div>
              )
            }
            {!loading && !recommendations && (
              <div>
                <Cloud size={48} className="max-auto mb-4 text-gray-300"/>
                <p>Fill in the environmental parameters.</p>
              </div>
            )}

            {recommendations && (
              <div className='space-y-4'>
                <div className='border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-gradient-to-r from-green-50 to-amber-50'>
                  <div className='text-center'>
                    <h3 className='text-2xl font-bold text-gray-900 mb-2'>Recommended Crop</h3>
                    <p className="text-3xl font-bold text-green-600 capitalize mb-4">{recommendations}</p>
                    <div className='bg-white rounded-lg p-4 shadow-sm'>
                      <h4 className='font-semibold text-gray-800 mb-2'>Input Paramters:</h4>
                      <div className='grid grid-cols-2 gap-4 text-sm'>
                        <div>
                          <span className="text-gray-600">Temperature:</span>
                          <p className="font-medium">{formData.temperature}°C</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Humidity:</span>
                          <p className="font-medium">{formData.humidity}%</p>
                        </div>
                        <div>
                          <span className="text-gray-600">pH level:</span>
                          <p className="font-medium">{formData.ph}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Rainfall:</span>
                          <p className="font-medium">{formData.rainfall}mm</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                  <h4 clas> Pro Tips:</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• This recommendation is based on environmental conditions optimal for crop growth</li>
                    <li>• This recommendation is based on environmental conditions optimal for crop growth</li>
                    <li>• This recommendation is based on environmental conditions optimal for crop growth</li>
                    <li>• This recommendation is based on environmental conditions optimal for crop growth</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
