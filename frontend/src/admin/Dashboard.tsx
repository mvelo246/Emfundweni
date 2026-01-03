import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import EditSchoolInfo from './EditSchoolInfo';
import ManageStudents from './ManageStudents';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'school' | 'students'>('school');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #E3F2FD 100%)' }}>
      <nav className="py-4 px-6 shadow-md" style={{ background: 'linear-gradient(135deg, #1565C0, #0D47A1)' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg text-white"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white">Welcome, {localStorage.getItem('username')}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-white transition-all duration-300 hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #00BCD4, #0288D1)' }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex gap-4 border-b-2" style={{ borderColor: '#64B5F6' }}>
          <button
            onClick={() => setActiveTab('school')}
            className={`px-6 py-3 font-semibold transition-all duration-300 ${
              activeTab === 'school'
                ? 'border-b-4 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={
              activeTab === 'school'
                ? { borderBottomColor: '#00BCD4', background: 'linear-gradient(135deg, #1976D2, #1565C0)' }
                : {}
            }
          >
            School Information
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-6 py-3 font-semibold transition-all duration-300 ${
              activeTab === 'students'
                ? 'border-b-4 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={
              activeTab === 'students'
                ? { borderBottomColor: '#00BCD4', background: 'linear-gradient(135deg, #1976D2, #1565C0)' }
                : {}
            }
          >
            Manage Top Students
          </button>
        </div>

        <div className="rounded-xl shadow-xl p-8" style={{ backgroundColor: 'white' }}>
          {activeTab === 'school' && <EditSchoolInfo />}
          {activeTab === 'students' && <ManageStudents />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
