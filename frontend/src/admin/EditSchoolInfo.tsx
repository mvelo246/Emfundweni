import React, { useState, useEffect } from 'react';
import { getSchoolInfo, updateSchoolInfo } from '../api';

const EditSchoolInfo: React.FC = () => {
  const [formData, setFormData] = useState({
    school_name: '',
    mission: '',
    about: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    stats_students: '',
    stats_pass_rate: '',
    stats_awards: '',
    stats_subjects: '',
    vision: '',
    values_text: '',
    hero_title: '',
    hero_tagline: '',
    footer_tagline: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSchoolInfo();
  }, []);

  const fetchSchoolInfo = () => {
    setLoading(true);
    getSchoolInfo()
      .then((response) => {
        setFormData({
          school_name: response.data.school_name || 'Emfundweni High School',
          mission: response.data.mission || '',
          about: response.data.about || '',
          contact_email: response.data.contact_email || '',
          contact_phone: response.data.contact_phone || '',
          contact_address: response.data.contact_address || '',
          stats_students: response.data.stats_students || '850+',
          stats_pass_rate: response.data.stats_pass_rate || '98.5%',
          stats_awards: response.data.stats_awards || '25+',
          stats_subjects: response.data.stats_subjects || '15+',
          vision: response.data.vision || '',
          values_text: response.data.values_text || '',
          hero_title: response.data.hero_title || 'Welcome to Emfundweni',
          hero_tagline: response.data.hero_tagline || 'Excellence in Education • Nurturing Future Leaders • Building Tomorrow\'s Success',
          footer_tagline: response.data.footer_tagline || 'Excellence in Education',
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching school info:', error);
        setLoading(false);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      console.log('Submitting form data:', formData);
      const response = await updateSchoolInfo(formData);
      console.log('Update response:', response);
      setMessage('School information updated successfully!');
      setTimeout(() => setMessage(''), 3000);
      // Refresh data after successful update
      fetchSchoolInfo();
    } catch (error: any) {
      console.error('Update error:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update school information.';
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6" style={{ 
        background: 'linear-gradient(135deg, #1565C0, #0277BD)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Edit School Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-xl font-bold mb-4" style={{ color: '#1565C0' }}>Basic Information</h3>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#1565C0' }}>
              School Name
            </label>
            <input
              type="text"
              name="school_name"
              value={formData.school_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
              style={{ borderColor: '#64B5F6' }}
            />
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-xl font-bold mb-4" style={{ color: '#1565C0' }}>Hero Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1565C0' }}>
                Hero Title
              </label>
              <input
                type="text"
                name="hero_title"
                value={formData.hero_title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                style={{ borderColor: '#64B5F6' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1565C0' }}>
                Hero Tagline
              </label>
              <input
                type="text"
                name="hero_tagline"
                value={formData.hero_tagline}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                style={{ borderColor: '#64B5F6' }}
              />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-xl font-bold mb-4" style={{ color: '#1565C0' }}>Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1565C0' }}>
                Students Count
              </label>
              <input
                type="text"
                name="stats_students"
                value={formData.stats_students}
                onChange={handleChange}
                placeholder="850+"
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                style={{ borderColor: '#64B5F6' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1565C0' }}>
                Pass Rate
              </label>
              <input
                type="text"
                name="stats_pass_rate"
                value={formData.stats_pass_rate}
                onChange={handleChange}
                placeholder="98.5%"
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                style={{ borderColor: '#64B5F6' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1565C0' }}>
                Awards Won
              </label>
              <input
                type="text"
                name="stats_awards"
                value={formData.stats_awards}
                onChange={handleChange}
                placeholder="25+"
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                style={{ borderColor: '#64B5F6' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1565C0' }}>
                Subjects
              </label>
              <input
                type="text"
                name="stats_subjects"
                value={formData.stats_subjects}
                onChange={handleChange}
                placeholder="15+"
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                style={{ borderColor: '#64B5F6' }}
              />
            </div>
          </div>
        </div>

        {/* Mission, Vision, Values & About */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-xl font-bold mb-4" style={{ color: '#1565C0' }}>School Content</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1565C0' }}>
                Mission Statement <span className="text-red-500">*</span>
              </label>
              <textarea
                name="mission"
                value={formData.mission}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                style={{ borderColor: '#64B5F6' }}
                placeholder="Enter the school's mission statement..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1565C0' }}>
                Our Vision
              </label>
              <textarea
                name="vision"
                value={formData.vision}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                style={{ borderColor: '#64B5F6' }}
                placeholder="Enter the school's vision..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1565C0' }}>
                Our Values
              </label>
              <textarea
                name="values_text"
                value={formData.values_text}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                style={{ borderColor: '#64B5F6' }}
                placeholder="Enter the school's values..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1565C0' }}>
                About Our School <span className="text-red-500">*</span>
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                style={{ borderColor: '#64B5F6' }}
                placeholder="Enter information about the school..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-4" style={{ color: '#1565C0' }}>Footer</h3>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#1565C0' }}>
              Footer Tagline
            </label>
            <input
              type="text"
              name="footer_tagline"
              value={formData.footer_tagline}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
              style={{ borderColor: '#64B5F6' }}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-4" style={{ color: '#1565C0' }}>Contact Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1565C0' }}>
                Contact Email
              </label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                style={{ borderColor: '#64B5F6' }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1565C0' }}>
                Contact Phone
              </label>
              <input
                type="tel"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                style={{ borderColor: '#64B5F6' }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1565C0' }}>
                Contact Address
              </label>
              <input
                type="text"
                name="contact_address"
                value={formData.contact_address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                style={{ borderColor: '#64B5F6' }}
              />
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.includes('successfully')
                ? 'bg-green-50 text-green-600'
                : 'bg-red-50 text-red-600'
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #1976D2, #1565C0, #0D47A1)' }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditSchoolInfo;
