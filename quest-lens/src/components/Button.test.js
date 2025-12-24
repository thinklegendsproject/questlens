import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from './Button';

describe('Button', () => {
  it('renders the title and handles press events', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Press Me" onPress={onPressMock} />);

    const buttonElement = getByText('Press Me');
    expect(buttonElement).toBeTruthy();

    fireEvent.press(buttonElement);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
