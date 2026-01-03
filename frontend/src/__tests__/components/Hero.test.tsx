import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Hero from '../../components/Hero';
import * as api from '../../api';

jest.mock('../../api');

describe('Hero Component Tests', () => {
  const mockSchoolInfo = {
    hero_title: 'Welcome to Test School',
    hero_tagline: 'Test Tagline',
    stats_students: '1000+',
    stats_pass_rate: '99%',
    stats_awards: '50+',
    stats_subjects: '25+'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render hero section with school info', async () => {
    (api.getSchoolInfo as jest.Mock).mockResolvedValue({
      data: mockSchoolInfo
    });

    render(<Hero />);

    await waitFor(() => {
      expect(screen.getByText('Welcome to Test School')).toBeInTheDocument();
      expect(screen.getByText('Test Tagline')).toBeInTheDocument();
    });
  });

  test('should display statistics correctly', async () => {
    (api.getSchoolInfo as jest.Mock).mockResolvedValue({
      data: mockSchoolInfo
    });

    render(<Hero />);

    await waitFor(() => {
      expect(screen.getByText('1000+')).toBeInTheDocument();
      expect(screen.getByText('99%')).toBeInTheDocument();
      expect(screen.getByText('50+')).toBeInTheDocument();
      expect(screen.getByText('25+')).toBeInTheDocument();
    });
  });

  test('should display default values when API fails', async () => {
    (api.getSchoolInfo as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<Hero />);

    await waitFor(() => {
      expect(screen.getByText('Welcome to Emfundweni')).toBeInTheDocument();
    });
  });

  test('should render buttons correctly', () => {
    (api.getSchoolInfo as jest.Mock).mockResolvedValue({
      data: mockSchoolInfo
    });

    render(<Hero />);

    expect(screen.getByText('Learn More About Us')).toBeInTheDocument();
    expect(screen.getByText('Get In Touch')).toBeInTheDocument();
  });
});

