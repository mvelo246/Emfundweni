import React, { useState, useEffect } from 'react';
import { Heart, Star } from 'lucide-react';
import { getSchoolInfo } from '../api';

const About: React.FC = () => {
  const [schoolData, setSchoolData] = useState({
    schoolName: 'Emfundweni High School',
    about: '',
    vision: '',
    values_text: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSchoolInfo()
      .then((response) => {
        setSchoolData({
          schoolName: response.data.school_name || 'Emfundweni High School',
          about: response.data.about || '',
          vision: response.data.vision || '',
          values_text: response.data.values_text || '',
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching about:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="about" className="min-h-screen py-24" style={{ background: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="min-h-screen py-24" style={{ background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #E3F2FD 100%)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ 
            background: 'linear-gradient(135deg, #1565C0, #0277BD)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Georgia, serif' 
          }}>
            About {schoolData.schoolName}
          </h1>
          <p className="text-xl max-w-3xl mx-auto font-medium" style={{ color: '#0288D1' }}>
            Building futures through quality education and holistic development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-16">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border-l-4 transform hover:-translate-y-2 transition-all duration-300" style={{ borderLeftColor: '#2196F3' }}>
            <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg">
              <Heart className="text-white" size={32} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: '#1565C0' }}>Our Vision</h2>
            <p className="leading-relaxed text-base sm:text-lg" style={{ color: '#1976D2' }}>
              {schoolData.vision || 'To be a leading institution of academic excellence that produces well-rounded, responsible citizens who are equipped with the knowledge, skills, and values to succeed in an ever-changing world and contribute positively to society.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border-l-4 transform hover:-translate-y-2 transition-all duration-300" style={{ borderLeftColor: '#2196F3' }}>
            <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Star className="text-white" size={32} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: '#1565C0' }}>Our Values</h2>
            <p className="leading-relaxed text-base sm:text-lg" style={{ color: '#1976D2' }}>
              {schoolData.values_text || 'We pursue excellence, uphold integrity, embrace innovation, celebrate inclusivity, take responsibility, and build strong partnerships with families and the community.'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl border-t-4" style={{ borderTopColor: '#2196F3' }}>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center" style={{ color: '#1565C0' }}>About Our School</h2>
          <p className="leading-relaxed text-base sm:text-lg mb-4" style={{ color: '#1976D2' }}>
            {schoolData.about || 'Emfundweni High School is a leading educational institution committed to academic excellence and character development. We provide a nurturing environment where students can achieve their full potential.'}
          </p>
    
        </div>
      </div>
    </section>
  );
};

export default About;
