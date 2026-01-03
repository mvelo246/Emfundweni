import React, { useState, useEffect } from 'react';
import { Users, Trophy, Award, BookOpen } from 'lucide-react';
import { getSchoolInfo } from '../api';

const Hero: React.FC = () => {
  const [heroData, setHeroData] = useState({
    stats: {
      students: '850+',
      passRate: '98.5%',
      awards: '25+',
      subjects: '15+',
    },
    title: 'Welcome to Emfundweni',
    tagline: 'Excellence in Education • Nurturing Future Leaders • Building Tomorrow\'s Success',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSchoolInfo()
      .then((response) => {
        setHeroData({
          stats: {
            students: response.data.stats_students || '850+',
            passRate: response.data.stats_pass_rate || '98.5%',
            awards: response.data.stats_awards || '25+',
            subjects: response.data.stats_subjects || '15+',
          },
          title: response.data.hero_title || 'Welcome to Emfundweni',
          tagline: response.data.hero_tagline || 'Excellence in Education • Nurturing Future Leaders • Building Tomorrow\'s Success',
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching hero data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center pt-16 sm:pt-20" style={{ background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)' }}>
      <div className="w-full">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(90deg, #2196F3, #03A9F4, #00BCD4)' }}></div>
          <div className="max-w-7xl mx-auto px-6 py-24 relative">
            <div className="text-center">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6" style={{ 
                background: 'linear-gradient(135deg, #1565C0, #0277BD, #0288D1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'Georgia, serif' 
              }}>
                {heroData.title}
              </h1>
              <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto font-medium" style={{ color: '#0277BD' }}>
                {heroData.tagline}
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
                <a
                  href="#about"
                  className="px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                  style={{ background: 'linear-gradient(135deg, #1976D2, #1565C0, #0D47A1)' }}
                >
                  Learn More About Us
                </a>
                <a
                  href="#contact"
                  className="px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2"
                  style={{ backgroundColor: 'white', color: '#1565C0', borderColor: '#64B5F6' }}
                >
                  Get In Touch
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-24">
          {loading ? (
            <div className="text-center py-12">
              <p style={{ color: '#1565C0' }}>Loading statistics...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Users, label: 'Students', value: heroData.stats.students, gradient: 'from-blue-500 to-cyan-500' },
                { icon: Trophy, label: 'Pass Rate', value: heroData.stats.passRate, gradient: 'from-cyan-500 to-teal-500' },
                { icon: Award, label: 'Awards Won', value: heroData.stats.awards, gradient: 'from-teal-500 to-blue-600' },
                { icon: BookOpen, label: 'Subjects', value: heroData.stats.subjects, gradient: 'from-blue-600 to-indigo-600' },
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 transform hover:-translate-y-2"
                  style={{ borderTopColor: '#2196F3' }}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="text-white" size={32} />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold mb-2" style={{ background: 'linear-gradient(135deg, #1565C0, #0277BD)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stat.value}</div>
                  <div className="font-medium" style={{ color: '#0288D1' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
