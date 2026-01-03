import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../admin/Login';
import * as api from '../../api';

jest.mock('../../api');

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Login Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('should render login form', () => {
    renderWithRouter(<Login />);
    
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('should handle successful login', async () => {
    const mockToken = 'test-token-123';
    (api.login as jest.Mock).mockResolvedValue({
      data: { token: mockToken }
    });

    renderWithRouter(<Login />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith('admin', 'admin123');
      expect(localStorage.getItem('token')).toBe(mockToken);
    });
  });

  test('should display error on login failure', async () => {
    (api.login as jest.Mock).mockRejectedValue({
      response: { data: { error: 'Invalid credentials' } }
    });

    renderWithRouter(<Login />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('should require username and password', () => {
    renderWithRouter(<Login />);

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    // HTML5 validation should prevent submission
    expect(api.login).not.toHaveBeenCalled();
  });

  test('should show loading state during login', async () => {
    (api.login as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ data: { token: 'test' } }), 100))
    );

    renderWithRouter(<Login />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(loginButton);

    expect(screen.getByText(/logging in/i)).toBeInTheDocument();
  });
});

