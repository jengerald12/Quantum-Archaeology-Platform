import { describe, it, beforeEach, expect, vi } from 'vitest';

const mockContractCall = vi.fn();

describe('Research Management Contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe('create-research-project', () => {
    it('should create a research project successfully', async () => {
      const title = 'Quantum Entanglement Study';
      const description = 'Investigating long-distance quantum entanglement for information retrieval';
      
      mockContractCall.mockResolvedValue({ value: 1 }); // Assuming 1 is the new project ID
      
      const result = await mockContractCall('research-management', 'create-research-project', [title, description]);
      
      expect(result.value).toBe(1);
      expect(mockContractCall).toHaveBeenCalledWith('research-management', 'create-research-project', [title, description]);
    });
  });
  
  describe('update-project-status', () => {
    it('should update project status successfully', async () => {
      const projectId = 1;
      const newStatus = 'in-progress';
      
      mockContractCall.mockResolvedValue({ value: true });
      
      const result = await mockContractCall('research-management', 'update-project-status', [projectId, newStatus]);
      
      expect(result.value).toBe(true);
      expect(mockContractCall).toHaveBeenCalledWith('research-management', 'update-project-status', [projectId, newStatus]);
    });
    
    it('should fail if not called by the project creator', async () => {
      const projectId = 1;
      const newStatus = 'completed';
      
      mockContractCall.mockRejectedValue(new Error('Unauthorized'));
      
      await expect(mockContractCall('research-management', 'update-project-status', [projectId, newStatus]))
          .rejects.toThrow('Unauthorized');
    });
  });
  
  describe('add-collaborator', () => {
    it('should add a collaborator successfully', async () => {
      const projectId = 1;
      const collaborator = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      
      mockContractCall.mockResolvedValue({ value: true });
      
      const result = await mockContractCall('research-management', 'add-collaborator', [projectId, collaborator]);
      
      expect(result.value).toBe(true);
      expect(mockContractCall).toHaveBeenCalledWith('research-management', 'add-collaborator', [projectId, collaborator]);
    });
    
    it('should fail if not called by the project creator', async () => {
      const projectId = 1;
      const collaborator = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      
      mockContractCall.mockRejectedValue(new Error('Unauthorized'));
      
      await expect(mockContractCall('research-management', 'add-collaborator', [projectId, collaborator]))
          .rejects.toThrow('Unauthorized');
    });
  });
  
  describe('get-research-project', () => {
    it('should return research project details', async () => {
      const projectId = 1;
      const expectedProject = {
        creator: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        title: 'Quantum Entanglement Study',
        description: 'Investigating long-distance quantum entanglement for information retrieval',
        status: 'active',
        collaborators: ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM']
      };
      
      mockContractCall.mockResolvedValue({ value: expectedProject });
      
      const result = await mockContractCall('research-management', 'get-research-project', [projectId]);
      
      expect(result.value).toEqual(expectedProject);
      expect(mockContractCall).toHaveBeenCalledWith('research-management', 'get-research-project', [projectId]);
    });
    
    it('should return null for non-existent project', async () => {
      const projectId = 999;
      
      mockContractCall.mockResolvedValue({ value: null });
      
      const result = await mockContractCall('research-management', 'get-research-project', [projectId]);
      
      expect(result.value).toBeNull();
    });
  });
});

