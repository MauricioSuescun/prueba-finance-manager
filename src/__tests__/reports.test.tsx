import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Reports from '@/pages/reports';

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

// Mock Chart.js
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="chart">Chart Component</div>,
}));

// Mock Papa Parse
jest.mock('papaparse', () => ({
  unparse: jest.fn(() => 'mock,csv,data'),
}));

// Mock router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/reports',
  }),
}));

// Mock fetch
global.fetch = jest.fn();

describe('Reports Page', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders reports page with financial data', async () => {
    const mockReportData = {
      movements: [
        {
          id: "1",
          concept: "Salario enero",
          amount: 2500.00,
          date: "2024-01-15T00:00:00.000Z",
          user: { name: "Juan Pérez", email: "juan@example.com" }
        },
        {
          id: "2",
          concept: "Alquiler",
          amount: -800.00,
          date: "2024-01-20T00:00:00.000Z",
          user: { name: "Juan Pérez", email: "juan@example.com" }
        }
      ],
      saldo: 1700.00,
      report: {
        totalIncome: 2500.00,
        totalExpenses: 800.00,
        balance: 1700.00,
        period: "Todos los movimientos"
      }
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockReportData
    });

    render(<Reports />);
    
    expect(screen.getByText('Reportes Financieros')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Saldo Actual: $1,700.00')).toBeInTheDocument();
      expect(screen.getByText('Descargar Reporte CSV')).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<Reports />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error al cargar reportes/)).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<Reports />);
    
    expect(screen.getByText('Cargando reportes...')).toBeInTheDocument();
  });

  it('displays chart when data is available', async () => {
    const mockReportData = {
      movements: [
        {
          id: "1",
          concept: "Salario",
          amount: 1000.00,
          date: "2024-01-01T00:00:00.000Z",
          user: { name: "Test User", email: "test@example.com" }
        }
      ],
      saldo: 1000.00,
      report: {
        totalIncome: 1000.00,
        totalExpenses: 0.00,
        balance: 1000.00,
        period: "Todos los movimientos"
      }
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockReportData
    });

    render(<Reports />);
    
    await waitFor(() => {
      expect(screen.getByTestId('chart')).toBeInTheDocument();
    });
  });
}); 