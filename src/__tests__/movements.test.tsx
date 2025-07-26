import React from 'react';
import { render, screen } from '@testing-library/react';
import Movements from '@/pages/movements';

// Mock Better Auth
jest.mock("@/lib/auth-client", () => ({
  useSession: () => ({
    data: {
      user: { 
        id: "1", 
        email: "test@example.com", 
        name: "Test User",
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
    pathname: '/movements',
  }),
}));

// Mock fetch
global.fetch = jest.fn();

describe('Movements Page', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders movements page', () => {
    render(<Movements />);
    expect(screen.getByText('Gestión de Ingresos y Egresos')).toBeInTheDocument();
  });
});
