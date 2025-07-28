import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MovementForm from '@/components/MovementForm';
import UserEditForm from '@/components/UserEditForm';

describe('MovementForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders movement form correctly', () => {
    render(<MovementForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    
    expect(screen.getByText('Nuevo Movimiento')).toBeInTheDocument();
    expect(screen.getByLabelText('Concepto')).toBeInTheDocument();
    expect(screen.getByLabelText('Monto')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha')).toBeInTheDocument();
    expect(screen.getByText('Guardar')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<MovementForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    
    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Todos los campos son obligatorios')).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates amount is positive', async () => {
    render(<MovementForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    
    const conceptInput = screen.getByLabelText('Concepto');
    const amountInput = screen.getByLabelText('Monto');
    const dateInput = screen.getByLabelText('Fecha');
    
    fireEvent.change(conceptInput, { target: { value: 'Test Concept' } });
    fireEvent.change(amountInput, { target: { value: '-100' } });
    fireEvent.change(dateInput, { target: { value: '2024-01-15' } });
    
    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('El monto debe ser un número positivo')).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<MovementForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    
    const conceptInput = screen.getByLabelText('Concepto');
    const amountInput = screen.getByLabelText('Monto');
    const dateInput = screen.getByLabelText('Fecha');
    
    fireEvent.change(conceptInput, { target: { value: 'Test Concept' } });
    fireEvent.change(amountInput, { target: { value: '100' } });
    fireEvent.change(dateInput, { target: { value: '2024-01-15' } });
    
    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        concept: 'Test Concept',
        amount: 100,
        date: '2024-01-15'
      });
    });
  });

  it('closes form when close button is clicked', () => {
    render(<MovementForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    
    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });
});

describe('UserEditForm Component', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    role: 'ADMIN'
  };
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user edit form correctly', () => {
    render(<UserEditForm user={mockUser} onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    
    expect(screen.getByText('Editar Usuario')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    expect(screen.getByLabelText('Rol')).toBeInTheDocument();
    expect(screen.getByText('Guardar')).toBeInTheDocument();
  });

  it('pre-fills form with user data', () => {
    render(<UserEditForm user={mockUser} onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    
    const nameInput = screen.getByLabelText('Nombre') as HTMLInputElement;
    const roleSelect = screen.getByLabelText('Rol') as HTMLSelectElement;
    
    expect(nameInput.value).toBe('Test User');
    expect(roleSelect.value).toBe('ADMIN');
  });

  it('validates required fields', async () => {
    render(<UserEditForm user={mockUser} onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    
    const nameInput = screen.getByLabelText('Nombre');
    fireEvent.change(nameInput, { target: { value: '' } });
    
    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Todos los campos son obligatorios')).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates name length', async () => {
    render(<UserEditForm user={mockUser} onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    
    const nameInput = screen.getByLabelText('Nombre');
    fireEvent.change(nameInput, { target: { value: 'A' } });
    
    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('El nombre debe tener al menos 2 caracteres')).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<UserEditForm user={mockUser} onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    
    const nameInput = screen.getByLabelText('Nombre');
    const roleSelect = screen.getByLabelText('Rol');
    
    fireEvent.change(nameInput, { target: { value: 'Updated User' } });
    fireEvent.change(roleSelect, { target: { value: 'USER' } });
    
    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        id: '1',
        name: 'Updated User',
        role: 'USER'
      });
    });
  });

  it('closes form when close button is clicked', () => {
    render(<UserEditForm user={mockUser} onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    
    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });
}); 