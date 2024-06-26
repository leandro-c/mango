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

    expect(onChangeMock).toHaveBeenCalledWith({ min: expect.any(Number), max: expect.any(Number) });
  });

  test("render component with min and max parameters", () => {
    const component = render(<Range min={1} max={5} />)
    component.getByText("1")
    component.getByText("5")
  })

  test("render component without parameters", () => {
    const component = render(<Range />)
    component.getByText("0")
    component.getByText("100")
    })

  test("render component with min parameter", () => {
        const component = render(<Range min={5} />)
        component.getByText("5")
    })

  test("render component with max parameter", () => {
        const component = render(<Range max={5} />)
        component.getByText("5")
    })
  test("render component with rangeValue parameter", () => {
        const component = render(<Range rangeValues={[1, 2, 3]} />)
        component.getByText("1")
        component.getByText("3")
    })
});
