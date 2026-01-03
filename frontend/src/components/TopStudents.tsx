import React, { useState, useEffect } from 'react';
import { Trophy, Filter } from 'lucide-react';
import { getTopStudents } from '../api';

interface Student {
  id: number;
  name: string;
  year: number;
  position: number;
}

const TopStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    setLoading(true);
    getTopStudents()
      .then((response) => {
        setStudents(response.data);
        if (response.data.length > 0) {
          const years = response.data.map((s: Student) => s.year);
          const maxYear = Math.max(...years);
          setSelectedYear(maxYear);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
        setLoading(false);
      });
  };

  const filteredStudents = selectedYear
    ? students.filter((s) => s.year === selectedYear).sort((a, b) => a.position - b.position)
    : [];

  const availableYears = Array.from(new Set(students.map((s) => s.year))).sort((a, b) => b - a);

  const getMedalColor = (position: number) => {
    if (position === 1) return 'from-yellow-400 to-amber-500';
    if (position === 2) return 'from-gray-300 to-gray-400';
    if (position === 3) return 'from-orange-400 to-orange-500';
    return 'from-blue-400 to-cyan-500';
  };

  if (loading) {
    return (
      <section id="students" className="min-h-screen bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="students" className="min-h-screen py-24" style={{ background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #E3F2FD 100%)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg">
            <Trophy className="text-white" size={48} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ 
            background: 'linear-gradient(135deg, #1565C0, #0277BD)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Georgia, serif' 
          }}>
            Top 10 Grade 12 Students
          </h1>
          <p className="text-xl mb-8 font-medium" style={{ color: '#0288D1' }}>Celebrating Academic Excellence</p>
          
          {availableYears.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
              <Filter style={{ color: '#1565C0' }} size={20} />
              <div className="flex flex-wrap justify-center gap-2">
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-4 sm:px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                      selectedYear === year
                        ? 'text-white shadow-lg'
                        : 'bg-white hover:bg-blue-50 border-2'
                    }`}
                    style={
                      selectedYear === year
                        ? { background: 'linear-gradient(135deg, #1976D2, #1565C0)' }
                        : { color: '#1565C0', borderColor: '#64B5F6' }
                    }
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-medium" style={{ color: '#1565C0' }}>
              {availableYears.length === 0
                ? 'No top students have been added yet.'
                : 'Please select a year to view top students.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 flex flex-col sm:flex-row items-center gap-4 transform hover:-translate-y-1"
                style={{ borderLeftColor: '#2196F3' }}
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${getMedalColor(student.position)} rounded-full flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-lg flex-shrink-0`}>
                  {student.position}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: '#1565C0' }}>{student.name}</h3>
                  <span className="px-4 py-1 rounded-full text-sm font-semibold inline-block" style={{ backgroundColor: '#E3F2FD', color: '#1565C0' }}>
                    Class of {student.year}
                  </span>
                </div>
                <div className="text-center sm:text-right">
                  <div className="text-3xl sm:text-4xl font-bold" style={{ background: 'linear-gradient(135deg, #00BCD4, #0288D1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>#{student.position}</div>
                  <div className="text-sm font-medium" style={{ color: '#0288D1' }}>Position</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TopStudents;
