import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WelcomeScreen from './WelcomeScreen';

describe('WelcomeScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<WelcomeScreen />);
    expect(getByText('Welcome to Quest Lens')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
  });

  it('navigates to Login screen on login button press', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<WelcomeScreen navigation={navigation} />);
    fireEvent.press(getByText('Login'));
    expect(navigation.navigate).toHaveBeenCalledWith('Login');
  });

  it('navigates to SignUp screen on sign up button press', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<WelcomeScreen navigation={navigation} />);
    fireEvent.press(getByText('Sign Up'));
    expect(navigation.navigate).toHaveBeenCalledWith('SignUp');
  });
});
