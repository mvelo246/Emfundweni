import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { getSchoolInfo } from '../api';

const Contact: React.FC = () => {
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSchoolInfo()
      .then((response) => {
        setContactInfo({
          email: response.data.contact_email || '',
          phone: response.data.contact_phone || '',
          address: response.data.contact_address || '',
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching contact info:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="contact" className="min-h-screen bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="min-h-screen bg-white py-24" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #E3F2FD 100%)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ 
            background: 'linear-gradient(135deg, #1565C0, #0277BD)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Georgia, serif' 
          }}>
            Contact Us
          </h1>
          <p className="text-xl font-medium" style={{ color: '#0288D1' }}>We'd love to hear from you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          <div>
            <div className="rounded-2xl p-6 sm:p-8 shadow-xl mb-8 border-l-4" style={{ backgroundColor: '#E3F2FD', borderLeftColor: '#2196F3' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#1565C0' }}>Get In Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg flex-shrink-0 mr-4">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: '#1565C0' }}>Address</h3>
                    <p style={{ color: '#1976D2' }}>{contactInfo.address || 'South Africa'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg flex-shrink-0 mr-4">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: '#1565C0' }}>Phone</h3>
                    <p style={{ color: '#1976D2' }}>{contactInfo.phone || ''}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0 mr-4">
                    <Mail className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: '#1565C0' }}>Email</h3>
                    <p style={{ color: '#1976D2' }}>{contactInfo.email || 'info@Emfundweni.edu.za'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6 sm:p-8 shadow-xl border-l-4" style={{ backgroundColor: '#E3F2FD', borderLeftColor: '#2196F3' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1565C0' }}>Office Hours</h2>
              <div className="space-y-2" style={{ color: '#1976D2' }}>
                <p><span className="font-semibold">Monday - Friday:</span> 7:30 AM - 4:00 PM</p>
                <p><span className="font-semibold">Saturday:</span> 8:00 AM - 12:00 PM</p>
                <p><span className="font-semibold">Sunday:</span> Closed</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 sm:p-8 shadow-xl border-t-4" style={{ backgroundColor: '#E3F2FD', borderTopColor: '#2196F3' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1565C0' }}>Send Us a Message</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block font-semibold mb-2" style={{ color: '#1565C0' }}>Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-colors"
                  placeholder="Your name"
                  style={{ borderColor: '#64B5F6' }}
                />
              </div>
              <div>
                <label className="block font-semibold mb-2" style={{ color: '#1565C0' }}>Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-colors"
                  placeholder="your.email@example.com"
                  style={{ borderColor: '#64B5F6' }}
                />
              </div>
              <div>
                <label className="block font-semibold mb-2" style={{ color: '#1565C0' }}>Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-colors"
                  placeholder="+27 (0) XX XXX XXXX"
                  style={{ borderColor: '#64B5F6' }}
                />
              </div>
              <div>
                <label className="block font-semibold mb-2" style={{ color: '#1565C0' }}>Message</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-colors resize-none"
                  placeholder="How can we help you?"
                  style={{ borderColor: '#64B5F6' }}
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-lg font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{ background: 'linear-gradient(135deg, #1976D2, #1565C0, #0D47A1)' }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
