import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { getSchoolInfo } from '../api';

const Footer: React.FC = () => {
  const [footerData, setFooterData] = useState({
    schoolName: 'Emfundweni High School',
    tagline: 'Excellence in Education',
  });

  useEffect(() => {
    getSchoolInfo()
      .then((response) => {
        setFooterData({
          schoolName: response.data.school_name || 'Emfundweni High School',
          tagline: response.data.footer_tagline || 'Excellence in Education',
        });
      })
      .catch((error) => {
        console.error('Error fetching footer data:', error);
      });
  }, []);

  return (
    <footer className="py-12" style={{ background: 'linear-gradient(135deg, #1565C0, #0D47A1)' }}>
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4">
            <Logo size={80} showText={true} />
          </div>
          <h3 className="text-3xl font-bold mb-2 text-white" style={{ fontFamily: 'Georgia, serif' }}>{footerData.schoolName}</h3>
          <p style={{ color: '#BBDEFB' }}>{footerData.tagline}</p>
        </div>
        <div className="border-t pt-6" style={{ borderTopColor: '#64B5F6' }}>
          <p style={{ color: '#BBDEFB' }}>© 2026 {footerData.schoolName}. All rights reserved.</p>
          <p className="mt-2 text-sm" style={{ color: '#90CAF9' }}>
            Website developed by <span className="font-semibold">KasiBets Devs</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
