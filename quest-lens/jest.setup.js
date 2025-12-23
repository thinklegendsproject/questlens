// Mock the AssetRegistry module, which is a common source of this error.
jest.mock('react-native/Libraries/Image/AssetRegistry', () => ({
  getAssetByID: jest.fn(),
}));
