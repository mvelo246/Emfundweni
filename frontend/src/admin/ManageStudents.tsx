import React, { useState, useEffect } from 'react';
import { getTopStudents, addStudent, updateStudent, deleteStudent } from '../api';

interface Student {
  id: number;
  name: string;
  year: number;
  position: number;
}

const ManageStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    year: new Date().getFullYear(),
    position: 1,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    setLoading(true);
    getTopStudents()
      .then((response) => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
        setLoading(false);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'number' ? parseInt(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      if (editingId) {
        await updateStudent(editingId, formData);
        setMessage('Student updated successfully!');
      } else {
        await addStudent(formData);
        setMessage('Student added successfully!');
      }
      fetchStudents();
      resetForm();
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Operation failed. Please try again.');
    }
  };

  const handleEdit = (student: Student) => {
    setFormData({
      name: student.name,
      year: student.year,
      position: student.position,
    });
    setEditingId(student.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      await deleteStudent(id);
      setMessage('Student deleted successfully!');
      fetchStudents();
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to delete student.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      year: new Date().getFullYear(),
      position: 1,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const groupedStudents = students.reduce((acc, student) => {
    if (!acc[student.year]) {
      acc[student.year] = [];
    }
    acc[student.year].push(student);
    return acc;
  }, {} as Record<number, Student[]>);

  const years = Object.keys(groupedStudents)
    .map(Number)
    .sort((a, b) => b - a);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold" style={{ color: '#4682B4' }}>
          Manage Top 10 Students
        </h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg"
          style={{ backgroundColor: '#4682B4' }}
        >
          Add New Student
        </button>
      </div>

      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.includes('successfully')
              ? 'bg-green-50 text-green-600'
              : 'bg-red-50 text-red-600'
          }`}
        >
          {message}
        </div>
      )}

      {showForm && (
        <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: '#F0F8FF' }}>
          <h3 className="text-xl font-semibold mb-4" style={{ color: '#4682B4' }}>
            {editingId ? 'Edit Student' : 'Add New Student'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#4682B4' }}>
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                style={{ borderColor: '#B0E0E6' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#4682B4' }}>
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  min="2000"
                  max="2100"
                  className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                  style={{ borderColor: '#B0E0E6' }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#4682B4' }}>
                  Position (1-10)
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                  style={{ borderColor: '#B0E0E6' }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg"
                style={{ backgroundColor: '#87CEEB' }}
              >
                {editingId ? 'Update' : 'Add'} Student
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
                style={{ backgroundColor: '#B0E0E6', color: '#4682B4' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {years.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No students have been added yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {years.map((year) => (
            <div key={year}>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#4682B4' }}>
                Class of {year}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedStudents[year]
                  .sort((a, b) => a.position - b.position)
                  .map((student) => (
                    <div
                      key={student.id}
                      className="p-4 rounded-lg border-2"
                      style={{ borderColor: '#B0E0E6', backgroundColor: '#F0F8FF' }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-2xl font-bold" style={{ color: '#5F9EA0' }}>
                            #{student.position}
                          </div>
                          <div className="text-lg font-semibold" style={{ color: '#4682B4' }}>
                            {student.name}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="px-3 py-1 rounded text-sm font-semibold text-white transition-all duration-300"
                            style={{ backgroundColor: '#87CEEB' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="px-3 py-1 rounded text-sm font-semibold text-white transition-all duration-300"
                            style={{ backgroundColor: '#ef4444' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageStudents;

