import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { getSchoolInfo } from '../api';

const Mission: React.FC = () => {
  const [mission, setMission] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSchoolInfo()
      .then((response) => {
        setMission(response.data.mission || '');
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching mission:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="mission" className="min-h-screen bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="mission" className="min-h-screen py-24" style={{ background: 'linear-gradient(135deg, #E3F2FD 0%, #FFFFFF 100%)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <Target className="text-white" size={48} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ 
            background: 'linear-gradient(135deg, #1565C0, #0277BD)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Georgia, serif' 
          }}>
            Our Mission
          </h1>
          <p className="text-xl font-medium" style={{ color: '#0288D1' }}>Our commitment to excellence</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl border-l-4 transform hover:-translate-y-2 transition-all duration-300" style={{ borderLeftColor: '#2196F3' }}>
            <p className="text-lg md:text-xl leading-relaxed" style={{ color: '#1565C0' }}>
              {mission || 'To provide quality education and develop well-rounded individuals who are prepared for success in higher education and life.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
