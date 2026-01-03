import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import EditSchoolInfo from '../../admin/EditSchoolInfo';
import * as api from '../../api';

jest.mock('../../api');

describe('EditSchoolInfo Component Tests', () => {
  const mockSchoolInfo = {
    school_name: 'Test School',
    mission: 'Test Mission',
    about: 'Test About',
    contact_email: 'test@test.com',
    contact_phone: '+27 11 999 9999',
    contact_address: 'Test Address',
    stats_students: '1000+',
    stats_pass_rate: '99%',
    stats_awards: '50+',
    stats_subjects: '25+',
    vision: 'Test Vision',
    values_text: 'Test Values',
    hero_title: 'Test Hero Title',
    hero_tagline: 'Test Hero Tagline',
    footer_tagline: 'Test Footer Tagline'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('token', 'test-token');
  });

  test('should load and display school info', async () => {
    (api.getSchoolInfo as jest.Mock).mockResolvedValue({
      data: mockSchoolInfo
    });

    render(<EditSchoolInfo />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test School')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Mission')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test About')).toBeInTheDocument();
    });
  });

  test('should update school name', async () => {
    (api.getSchoolInfo as jest.Mock).mockResolvedValue({
      data: mockSchoolInfo
    });
    (api.updateSchoolInfo as jest.Mock).mockResolvedValue({
      data: { message: 'Updated successfully' }
    });

    render(<EditSchoolInfo />);

    await waitFor(() => {
      const schoolNameInput = screen.getByDisplayValue('Test School');
      fireEvent.change(schoolNameInput, { target: { value: 'Updated School Name' } });
      expect(schoolNameInput).toHaveValue('Updated School Name');
    });
  });

  test('should submit form with updated data', async () => {
    (api.getSchoolInfo as jest.Mock).mockResolvedValue({
      data: mockSchoolInfo
    });
    (api.updateSchoolInfo as jest.Mock).mockResolvedValue({
      data: { message: 'Updated successfully' }
    });

    render(<EditSchoolInfo />);

    await waitFor(() => {
      const submitButton = screen.getByText('Save Changes');
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(api.updateSchoolInfo).toHaveBeenCalled();
      expect(screen.getByText(/successfully/i)).toBeInTheDocument();
    });
  });

  test('should display error message on update failure', async () => {
    (api.getSchoolInfo as jest.Mock).mockResolvedValue({
      data: mockSchoolInfo
    });
    (api.updateSchoolInfo as jest.Mock).mockRejectedValue({
      response: { data: { error: 'Update failed' } }
    });

    render(<EditSchoolInfo />);

    await waitFor(() => {
      const submitButton = screen.getByText('Save Changes');
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/failed/i)).toBeInTheDocument();
    });
  });

  test('should validate required fields', async () => {
    (api.getSchoolInfo as jest.Mock).mockResolvedValue({
      data: mockSchoolInfo
    });

    render(<EditSchoolInfo />);

    await waitFor(() => {
      const missionInput = screen.getByDisplayValue('Test Mission');
      fireEvent.change(missionInput, { target: { value: '' } });
      
      const submitButton = screen.getByText('Save Changes');
      fireEvent.click(submitButton);
    });

    // HTML5 validation should prevent submission
    await waitFor(() => {
      expect(api.updateSchoolInfo).not.toHaveBeenCalled();
    });
  });

  test('should update all editable fields', async () => {
    (api.getSchoolInfo as jest.Mock).mockResolvedValue({
      data: mockSchoolInfo
    });
    (api.updateSchoolInfo as jest.Mock).mockResolvedValue({
      data: { message: 'Updated successfully' }
    });

    render(<EditSchoolInfo />);

    await waitFor(() => {
      // Update vision
      const visionInput = screen.getByLabelText(/Our Vision/i);
      fireEvent.change(visionInput, { target: { value: 'Updated Vision' } });

      // Update values
      const valuesInput = screen.getByLabelText(/Our Values/i);
      fireEvent.change(valuesInput, { target: { value: 'Updated Values' } });

      // Update about
      const aboutInput = screen.getByLabelText(/About Our School/i);
      fireEvent.change(aboutInput, { target: { value: 'Updated About' } });

      // Submit
      const submitButton = screen.getByText('Save Changes');
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(api.updateSchoolInfo).toHaveBeenCalledWith(
        expect.objectContaining({
          vision: 'Updated Vision',
          values_text: 'Updated Values',
          about: 'Updated About'
        })
      );
    });
  });
});

