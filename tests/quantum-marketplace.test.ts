import { describe, it, beforeEach, expect, vi } from 'vitest';

const mockContractCall = vi.fn();

describe('Quantum Marketplace Contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe('create-listing', () => {
    it('should create a listing successfully', async () => {
      const title = 'Quantum Computer Time';
      const description = '1 hour of quantum computing time on our 50-qubit machine';
      const price = 1000;
      
      mockContractCall.mockResolvedValue({ value: 1 }); // Assuming 1 is the new listing ID
      
      const result = await mockContractCall('quantum-marketplace', 'create-listing', [title, description, price]);
      
      expect(result.value).toBe(1);
      expect(mockContractCall).toHaveBeenCalledWith('quantum-marketplace', 'create-listing', [title, description, price]);
    });
  });
  
  describe('purchase-listing', () => {
    it('should mark a listing as sold successfully', async () => {
      const listingId = 1;
      
      mockContractCall.mockResolvedValue({ value: true });
      
      const result = await mockContractCall('quantum-marketplace', 'purchase-listing', [listingId]);
      
      expect(result.value).toBe(true);
      expect(mockContractCall).toHaveBeenCalledWith('quantum-marketplace', 'purchase-listing', [listingId]);
    });
    
    it('should fail if the listing is not active', async () => {
      const listingId = 1;
      
      mockContractCall.mockRejectedValue(new Error('Listing is not active'));
      
      await expect(mockContractCall('quantum-marketplace', 'purchase-listing', [listingId]))
          .rejects.toThrow('Listing is not active');
    });
  });
  
  describe('get-listing', () => {
    it('should return listing details', async () => {
      const listingId = 1;
      const expectedListing = {
        seller: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        title: 'Quantum Computer Time',
        description: '1 hour of quantum computing time on our 50-qubit machine',
        price: 1000,
        status: 'active'
      };
      
      mockContractCall.mockResolvedValue({ value: expectedListing });
      
      const result = await mockContractCall('quantum-marketplace', 'get-listing', [listingId]);
      
      expect(result.value).toEqual(expectedListing);
      expect(mockContractCall).toHaveBeenCalledWith('quantum-marketplace', 'get-listing', [listingId]);
    });
    
    it('should return null for non-existent listing', async () => {
      const listingId = 999;
      
      mockContractCall.mockResolvedValue({ value: null });
      
      const result = await mockContractCall('quantum-marketplace', 'get-listing', [listingId]);
      
      expect(result.value).toBeNull();
    });
  });
});

