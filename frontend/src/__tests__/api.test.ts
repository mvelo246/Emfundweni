import axios from 'axios';
import * as api from '../api';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('getSchoolInfo', () => {
    test('should fetch school info successfully', async () => {
      const mockData = {
        id: 1,
        school_name: 'Test School',
        mission: 'Test Mission',
        about: 'Test About'
      };

      mockedAxios.create = jest.fn(() => ({
        get: jest.fn().mockResolvedValue({ data: mockData }),
        put: jest.fn(),
        post: jest.fn(),
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      })) as any;

      const result = await api.getSchoolInfo();
      expect(result.data).toEqual(mockData);
    });
  });

  describe('updateSchoolInfo', () => {
    test('should update school info with token', async () => {
      localStorage.setItem('token', 'test-token');
      
      const mockResponse = { message: 'Updated successfully' };
      
      mockedAxios.create = jest.fn(() => ({
        get: jest.fn(),
        put: jest.fn().mockResolvedValue({ data: mockResponse }),
        post: jest.fn(),
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      })) as any;

      const updateData = {
        school_name: 'Updated School',
        mission: 'Updated Mission'
      };

      const result = await api.updateSchoolInfo(updateData);
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('getTopStudents', () => {
    test('should fetch top students successfully', async () => {
      const mockStudents = [
        { id: 1, name: 'Student 1', year: 2024, position: 1 },
        { id: 2, name: 'Student 2', year: 2024, position: 2 }
      ];

      mockedAxios.create = jest.fn(() => ({
        get: jest.fn().mockResolvedValue({ data: mockStudents }),
        put: jest.fn(),
        post: jest.fn(),
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      })) as any;

      const result = await api.getTopStudents();
      expect(result.data).toEqual(mockStudents);
    });
  });

  describe('login', () => {
    test('should login successfully and store token', async () => {
      const mockResponse = { token: 'test-token-123' };

      mockedAxios.create = jest.fn(() => ({
        get: jest.fn(),
        put: jest.fn(),
        post: jest.fn().mockResolvedValue({ data: mockResponse }),
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      })) as any;

      const result = await api.login('admin', 'admin123');
      expect(result.data).toEqual(mockResponse);
    });
  });
});

