import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import About from '../../components/About';
import * as api from '../../api';

jest.mock('../../api');

describe('About Component Tests', () => {
  const mockSchoolInfo = {
    school_name: 'Test School',
    about: 'This is a test about section',
    vision: 'Test vision statement',
    values_text: 'Test values text'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render about section with school name', async () => {
    (api.getSchoolInfo as jest.Mock).mockResolvedValue({
      data: mockSchoolInfo
    });

    render(<About />);

    await waitFor(() => {
      expect(screen.getByText(/About Test School/i)).toBeInTheDocument();
    });
  });

  test('should display vision correctly', async () => {
    (api.getSchoolInfo as jest.Mock).mockResolvedValue({
      data: mockSchoolInfo
    });

    render(<About />);

    await waitFor(() => {
      expect(screen.getByText('Our Vision')).toBeInTheDocument();
      expect(screen.getByText('Test vision statement')).toBeInTheDocument();
    });
  });

  test('should display values correctly', async () => {
    (api.getSchoolInfo as jest.Mock).mockResolvedValue({
      data: mockSchoolInfo
    });

    render(<About />);

    await waitFor(() => {
      expect(screen.getByText('Our Values')).toBeInTheDocument();
      expect(screen.getByText('Test values text')).toBeInTheDocument();
    });
  });

  test('should display about text correctly', async () => {
    (api.getSchoolInfo as jest.Mock).mockResolvedValue({
      data: mockSchoolInfo
    });

    render(<About />);

    await waitFor(() => {
      expect(screen.getByText('About Our School')).toBeInTheDocument();
      expect(screen.getByText('This is a test about section')).toBeInTheDocument();
    });
  });

  test('should handle loading state', () => {
    (api.getSchoolInfo as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<About />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});

