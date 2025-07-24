
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import MovementsPage from '../movements';
import { SessionProvider } from 'next-auth/react';

jest.mock('next-auth/react', () => {
  const actual = jest.requireActual('next-auth/react');
  return {
    ...actual,
    getSession: jest.fn().mockResolvedValue({
      user: { name: 'Admin', email: 'admin@test.com', role: 'ADMIN' },
    }),
  };
});

describe('MovementsPage', () => {
  it('renderiza el título y la tabla', async () => {
    render(
      <SessionProvider session={null}>
        <MovementsPage />
      </SessionProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Gestión de Ingresos y Egresos')).toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });
});
