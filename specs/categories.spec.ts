import { describe, it } from '@jest/globals';
import controller from '../controller/category.controller';

let categoryId: string;
const today = new Date()

const payloadForPostRequest = {
  name: 'test category' + Math.floor(Math.random() * 1000)
};

beforeAll(async () => {
  const response = await controller.postCategories(payloadForPostRequest);
  console.log('beforeAll response: ', response.body);
  console.log('beforeAll categoryId: ', response.body._id);
  categoryId = response.body._id;

  expect(response.status).toBe(200);
  expect(response.body.name).toBe(payloadForPostRequest.name);
  expect(response.body).toHaveProperty('_id');
  expect(response.body).toHaveProperty('__v');
});

afterAll(async () => {
  const response = await controller.deleteCategory(categoryId);
  expect(response.status).toEqual(200);
  expect(response.body).toHaveProperty('_id');
});

describe('categories', () => {
  describe('GET categories', () => {
    it('should get all categories', async () => {
      const response = await controller.getCategories();
  
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
  
      const hasNameAndIdProperties = response.body.every((el: any) => '_id' in el && 'name' in el);
      expect(hasNameAndIdProperties).toBeTruthy();
    });

    it('should return categories sorted by name', async () => {
      // Create two categories with different names
      const category1 = await controller.postCategories({ name: 'AAAA Test Category' });
      const category2 = await controller.postCategories({ name: 'ZZZZ Test Category' });

      const response = await controller.getCategories();
      const categories = response.body;

      // Find our test categories in the response
      const index1 = categories.findIndex((c: any) => c.name === 'AAAA Test Category');
      const index2 = categories.findIndex((c: any) => c.name === 'ZZZZ Test Category');

      expect(index1).toBeLessThan(index2);

      // Clean up
      await controller.deleteCategory(category1.body._id);
      await controller.deleteCategory(category2.body._id);
    });
  });

  describe('GET category by ID', () => {
    it('should get category by valid ID', async () => {
      const response = await controller.getCategoryById(categoryId);
  
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(payloadForPostRequest.name);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('__v');
    });

    it('should handle non-existent category ID', async () => {
      const nonExistentId = '123456789012345678901234'; // Valid MongoDB ObjectId format
      const response = await controller.getCategoryById(nonExistentId);
  
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Category not found.');
    });

    it('should handle invalid category ID format', async () => {
      const invalidId = 'invalid-id';
      const response = await controller.getCategoryById(invalidId);
  
      expect(response.status).toBe(422);
      expect(response.body.error).toBe('Unable to fetch category');
    });
  });

  describe('POST create a new category', () => {
    it('should create a new category with valid data', async () => {
      const payload = {
        name: 'test category' + Math.floor(Math.random() * 1000)
      };
      const response = await controller.postCategories(payload);

      expect(response.status).toBe(200);
      expect(response.body.name).toEqual(payload.name);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('__v');

      // Clean up
      await controller.deleteCategory(response.body._id);
    });

    it('should reject empty name', async () => {
      const response = await controller.postCategories({
        name: ''
      });

      expect(response.status).toBe(422);
      expect(response.body.error).toEqual('Name is required');
    });

    it('should handle name with special characters', async () => {
      const payload = {
        name: 'Test Category @#$%^&*()_+'
      };
      const response = await controller.postCategories(payload);

      expect(response.status).toBe(200);
      expect(response.body.name).toEqual(payload.name);

      // Clean up
      await controller.deleteCategory(response.body._id);
    });

    it('should handle name with numbers', async () => {
      const payload = {
        name: 'Test Category 12345'
      };
      const response = await controller.postCategories(payload);

      expect(response.status).toBe(200);
      expect(response.body.name).toEqual(payload.name);

      // Clean up
      await controller.deleteCategory(response.body._id);
    });

    it('should reject name with only spaces', async () => {
      const response = await controller.postCategories({
        name: '   '
      });

      expect(response.status).toBe(422);
      expect(response.body.error).toEqual('    already exists');
    });

    it('should handle name with leading/trailing spaces', async () => {
      const payload = {
        name: '  Test Category  '
      };
      const response = await controller.postCategories(payload);

      expect(response.status).toBe(200);
      expect(response.body.name).toEqual(payload.name);

      // Clean up
      await controller.deleteCategory(response.body._id);
    });

    it('should validate minimum name length (2 characters)', async () => {
      const value = String.fromCharCode(Math.random() * 26 + 65) +
                   String.fromCharCode(Math.random() * 26 + 65);

      const payload = {
        name: value
      };

      const response = await controller.postCategories(payload);

      expect(response.status).toBe(200);
      expect(response.body.name).toEqual(payload.name);

      // Clean up
      await controller.deleteCategory(response.body._id);
    });

    it('should reject name with 1 character', async () => {
      const payload = {
        name: 't'
      };

      const response = await controller.postCategories(payload);

      expect(response.status).toBe(422);
      expect(response.body.error).toEqual('Brand name is too short');
    });

    it('should prevent duplicate category names', async () => {
      const payload = {
        name: payloadForPostRequest.name
      };

      const response = await controller.postCategories(payload);

      expect(response.status).toBe(422);
      expect(response.body.error).toContain(`${payload.name} already exists`);
    });
  });

  describe('PUT update category', () => {
    it('should update category name with valid data', async () => {
      const payload = {
        name: 'new name' + Math.floor(Math.random() * 1000)
      };

      const response = await controller.putCategory(categoryId, payload);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(payload.name);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('__v');
    });

    it('should allow maximum name length (30 characters)', async () => {
      const randomText = Array.from({ length: 30 }, () =>
        String.fromCharCode(Math.random() * 26 + 65)
      ).join('');

      const payload = {
        name: randomText
      };

      const response = await controller.putCategory(categoryId, payload);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(payload.name);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('__v');
    });

    it('should reject name longer than 30 characters', async () => {
      const payload = {
        name: 'this is thirtyO characters long'
      };

      const response = await controller.putCategory(categoryId, payload);

      expect(response.status).toBe(422);
      expect(response.body.error).toBe('Brand name is too long');
    });

    it('should handle invalid category ID', async () => {
      const payload = {
        name: 'test name' + Math.floor(Math.random() * 1000)
      };

      const response = await controller.putCategory('invalid_id', payload);

      expect(response.status).toBe(422);
      expect(response.body.error).toBe('Unable to update categories');
    });

    it('should reject empty name on update', async () => {
      const payload = {
        name: ''
      };

      const response = await controller.putCategory(categoryId, payload);

      expect(response.status).toBe(422);
      expect(response.body.error).toBe('Name is required');
    });

    it('should prevent updating to existing category name', async () => {
      // Create a new category first
      const newCategory = await controller.postCategories({
        name: 'Unique Category Name ' + Math.floor(Math.random() * 1000)
      });

      // Try to update it with the name of our test category
      const response = await controller.putCategory(newCategory.body._id, {
        name: payloadForPostRequest.name
      });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(payloadForPostRequest.name);

      // Clean up
      await controller.deleteCategory(newCategory.body._id);
    });
  });

  describe('DELETE category', () => {
    it('should handle invalid category ID format', async () => {
      const response = await controller.deleteCategory('invalid_id');

      expect(response.status).toEqual(422);
      expect(response.body.error).toEqual('Unable to delete categories');
    });

    it('should handle non-existent category ID', async () => {
      const nonExistentId = '123456789012345678901234'; // Valid MongoDB ObjectId format
      const response = await controller.deleteCategory(nonExistentId);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(null);
    });

    it('should successfully delete an existing category', async () => {
      // Create a new category
      const newCategory = await controller.postCategories({
        name: 'Category to Delete ' + Math.floor(Math.random() * 1000)
      });

      // Delete it
      const response = await controller.deleteCategory(newCategory.body._id);

      expect(response.status).toEqual(200);
      expect(response.body).toHaveProperty('_id');

      // Verify it's deleted
      const getResponse = await controller.getCategoryById(newCategory.body._id);
      expect(getResponse.status).toBe(404);
      expect(getResponse.body.error).toBe('Category not found.');
    });
  });
}); 