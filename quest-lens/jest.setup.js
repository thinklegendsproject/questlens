// In jest.setup.js
import 'react-native-gesture-handler/jestSetup';

// Mock expo-router
jest.mock('expo-router', () => {
    const originalModule = jest.requireActual('expo-router');
    return {
        ...originalModule,
        useRouter: jest.fn(() => ({
            push: jest.fn(),
            replace: jest.fn(),
            back: jest.fn(),
        })),
        useLocalSearchParams: jest.fn(() => ({})),
        useGlobalSearchParams: jest.fn(() => ({})),
        Link: 'Link',
    };
});
