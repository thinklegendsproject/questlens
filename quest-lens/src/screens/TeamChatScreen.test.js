import React from 'react';
import { render } from '@testing-library/react-native';
import TeamChatScreen from './TeamChatScreen';

// Mock Firebase services
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: {
      uid: 'testUserId',
      email: 'test@test.com',
    },
  })),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn(() => {
    // Return a mock unsubscribe function
    return () => {};
  }),
  addDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));


describe('TeamChatScreen', () => {
  it('renders the input field and send button', () => {
    const route = { params: { teamId: 'test-team-id' } };
    const { getByPlaceholderText, getByText } = render(<TeamChatScreen route={route} />);

    // Check if the input field is rendered
    expect(getByPlaceholderText('Type a message...')).toBeTruthy();

    // Check if the send button is rendered
    expect(getByText('Send')).toBeTruthy();
  });
});
