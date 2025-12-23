import React from 'react';
import { render } from '@testing-library/react-native';
import ProfileScreen from './ProfileScreen';
import { getAuth } from 'firebase/auth';

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: {
      email: 'test@example.com',
    },
  })),
  signOut: jest.fn(),
}));

// Mock Firestore
jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(() => Promise.resolve({ exists: () => true, data: () => ({ email: 'test@example.com', level: 1, xp: 100, coins: 50 }) })),
    collection: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
}));

describe('ProfileScreen', () => {
  it('renders the user email correctly', async () => {
    const { findByText } = render(<ProfileScreen />);
    const emailElement = await findByText('test@example.com');
    expect(emailElement).toBeTruthy();
  });
});
