import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Users from '@/pages/users';

// Mock Better Auth
jest.mock("@/lib/auth-client", () => ({
  useSession: () => ({
    data: {
      user: { 
        id: "1", 
        email: "admin@example.com", 
        name: "Admin User",
        role: "ADMIN" 
      }
    },
    isPending: false,
  }),
}));

// Mock the withAuth HOC
jest.mock("@/lib/withAuth", () => ({
  withAuth: (Component: React.ComponentType) => Component,
}));

// Mock router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/users',
  }),
}));

// Mock fetch
global.fetch = jest.fn();

describe('Users Page', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders users page with admin access', async () => {
    const mockUsers = [
      {
        id: "1",
        name: "Juan Pérez",
        email: "juan@example.com",
        phone: "+1234567890",
        role: "ADMIN"
      },
      {
        id: "2", 
        name: "María García",
        email: "maria@example.com",
        phone: null,
        role: "USER"
      }
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ users: mockUsers })
    });

    render(<Users />);
    
    expect(screen.getByText('Gestión de Usuarios')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('María García')).toBeInTheDocument();
      expect(screen.getByText('juan@example.com')).toBeInTheDocument();
      expect(screen.getByText('maria@example.com')).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<Users />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error al cargar usuarios/)).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<Users />);
    
    expect(screen.getByText('Cargando usuarios...')).toBeInTheDocument();
  });
}); 