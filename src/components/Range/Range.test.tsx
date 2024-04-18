import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Range from './Range';

describe('Range component', () => {
  const onChangeMock = jest.fn();

  beforeEach(() => {
    onChangeMock.mockClear();
  });

  test('renders Range component with default values', () => {
    render(<Range onChange={onChangeMock} />);
    
    const bullet1 = screen.getByTestId('bullet1');
    const bullet2 = screen.getByTestId('bullet2');
    
    expect(bullet1).toBeDefined();
    expect(bullet2).toBeDefined();
  });

  test('triggers onChange when bullets are moved', () => {
    render(<Range onChange={onChangeMock} />);
    
    const bullet1 = screen.getByTestId('bullet1');
    const bullet2 = screen.getByTestId('bullet2');

    fireEvent.mouseDown(bullet1);
    fireEvent.mouseMove(bullet1, { clientX: 100 });
    fireEvent.mouseUp(bullet1);
    
    fireEvent.mouseDown(bullet2);
    fireEvent.mouseMove(bullet2, { clientX: 200 });
    fireEvent.mouseUp(bullet2);

    expect(onChangeMock).toHaveBeenCalledTimes(2);
    expect(onChangeMock).toHaveBeenCalledWith({ min: expect.any(Number), max: expect.any(Number) });
  });

  test('renders Range component with provided default values', () => {
    render(<Range onChange={onChangeMock} defaultValue={{ min: 20, max: 80 }} />);
    
    const bullet1 = screen.getByTestId('bullet1');
    const bullet2 = screen.getByTestId('bullet2');

    expect(bullet1.style.left).toBe('20%');
    expect(bullet2.style.left).toBe('80%');
  });

  test('clicking on label changes bullet position', () => {
    render(<Range onChange={onChangeMock} min={10} max={90} clickOnLabel />);
    
    const minLabel = screen.getByText('10');
    const maxLabel = screen.getByText('90');

    fireEvent.click(minLabel);
    fireEvent.click(maxLabel);

    expect(onChangeMock).toHaveBeenCalledTimes(2);
    expect(onChangeMock).toHaveBeenCalledWith({ min: 10, max: 90 });
  });
});
