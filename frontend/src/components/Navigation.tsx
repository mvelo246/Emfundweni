import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { getSchoolInfo } from '../api';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, onSectionChange }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [schoolName, setSchoolName] = useState('Emfundweni');

  useEffect(() => {
    getSchoolInfo()
      .then((response) => {
        const name = response.data.school_name || 'Emfundweni High School';
        setSchoolName(name.split(' ')[0]); // Get first word for navigation
      })
      .catch((error) => {
        console.error('Error fetching school info:', error);
      });
  }, []);

  const sections = [
    { name: 'home', label: 'Home' },
    { name: 'mission', label: 'Mission' },
    { name: 'about', label: 'About' },
    { name: 'students', label: 'Top Students' },
    { name: 'contact', label: 'Contact' },
  ];

  const scrollToSection = (sectionName: string) => {
    onSectionChange(sectionName);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionName);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAdminClick = () => {
    setIsMobileMenuOpen(false);
    navigate('/admin/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'mission', 'about', 'students', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition) {
          onSectionChange(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onSectionChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('nav')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-lg z-50 border-b-2" style={{ borderColor: '#64B5F6' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div 
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer" 
            onClick={() => scrollToSection('home')}
          >
            <div className="flex-shrink-0">
              <Logo size={50} showText={false} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold" style={{ background: 'linear-gradient(135deg, #1565C0, #0277BD)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Georgia, serif' }}>{schoolName}</h1>
              <p className="text-xs tracking-wide hidden sm:block font-semibold" style={{ color: '#0288D1' }}>HIGH SCHOOL</p>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-1">
            {sections.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.name)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeSection === item.name
                    ? 'text-white shadow-md'
                    : 'hover:bg-opacity-50'
                }`}
                style={
                  activeSection === item.name
                    ? { background: 'linear-gradient(135deg, #1976D2, #1565C0)' }
                    : { color: '#1565C0' }
                }
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => navigate('/admin/login')}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-blue-50"
              style={{ color: '#1565C0' }}
            >
              Admin
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-all duration-300 hover:bg-blue-50"
            style={{ color: '#1565C0' }}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="bg-white shadow-xl border-t-2 animate-slide-down"
            style={{ borderTopColor: '#64B5F6' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-6 space-y-2">
              {sections.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.name)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeSection === item.name
                      ? 'text-white shadow-md'
                      : 'hover:bg-blue-50'
                  }`}
                  style={
                    activeSection === item.name
                      ? { background: 'linear-gradient(135deg, #1976D2, #1565C0)' }
                      : { color: '#1565C0' }
                  }
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={handleAdminClick}
                className="w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-blue-50"
                style={{ color: '#1565C0' }}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
