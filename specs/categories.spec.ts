import { describe, it } from '@jest/globals';
import controller from '../controller/category.controller';
import * as supertest from 'supertest';
import { login } from '../utils/helper';
import config from '../config/base.config';

const request = supertest('https://practice-react.sdetunicorns.com/api/test');


let categoryId: string;
const today = new Date()
let token = '';

const payloadForPostRequest = {
  name: 'test category' + Math.floor(Math.random() * 1000)
};

beforeAll(async () => {
  // const response1 = await  request
  //     .post('/auth/login')
  //     .send({
  //       email: 'mod@mail.com',
  //       password: 'Modpass123!'
  //     })
  
  token = await login(config.credentials.email, config.credentials.password);



  const response = await controller.postCategories(payloadForPostRequest).set('Authorization', `Bearer ${token}`);
  console.log('beforeAll response: ', response.body);
  console.log('beforeAll categoryId: ', response.body._id);
  categoryId = response.body._id;

  expect(response.status).toBe(200);
  expect(response.body.name).toBe(payloadForPostRequest.name);
  //expect(response.body).toHaveProperty('createdAt');
  //expect(response.body.createdAt).toContain(today.getFullYear().toString());
});

afterAll(async () => {
  const response = await controller.deleteCategory(categoryId).set('Authorization', `Bearer ${token}`);
  expect(response.status).toEqual(200);
  //expect(response.body).toEqual(payloadForPostRequest);
});


describe('categories', () => {
  it('GET categories', async () => {
    const response = await controller.getCategories();

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);

    const hasNameAndIdProperties = response.body.every((el: any) => '_id' in el && 'name' in el);
    expect(hasNameAndIdProperties).toBeTruthy();
  });

  describe('POST create a new category', () => {
    it('Create a new category', async () => {
      const payload = {
        name: 'test category' + Math.floor(Math.random() * 1000)
      };
      const response = await controller.postCategories(payload).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toEqual(payload.name);
      expect(response.body).toHaveProperty('_id');
      //expect(response.body.createdAt).toContain(today.getFullYear().toString());

      // Clean up
      await controller.deleteCategory(response.body._id);
    });

    it('Schema verification - Name is a mandatory field', async () => {
      const response = await controller.postCategories({
        name: ''
      }).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(422);
      expect(response.body.error).toEqual('Name is required');
    });

    it('Schema verification - Name with 2 symbols validation - Valid check', async () => {
      const value = String.fromCharCode(Math.random() * 26 + 65) +
                   String.fromCharCode(Math.random() * 26 + 65);

      const payload = {
        name: value
      };

      const response = await controller.postCategories(payload).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toEqual(payload.name);

      // Clean up
      await controller.deleteCategory(response.body._id);
    });

    it('Schema verification - Name with 1 symbol validation - test failed', async () => {
      const payload = {
        name: 't'
      };

      const response = await controller.postCategories(payload).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(422);
      expect(response.body.error).toEqual('Brand name is too short');
    });

    it('Duplicate category entries are not allowed', async () => {
      const payload = {
        name: payloadForPostRequest.name
      };

      const response = await controller.postCategories(payload).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(422);
      expect(response.body.error).toContain(`${payload.name} already exists`);
    });
  });

  it('GET category/:id', async () => {
    const response = await controller.getCategoryById(categoryId);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(payloadForPostRequest.name);
  });

  describe('PUT update category information', () => {
    it('Update category name', async () => {
      const payload = {
        name: 'new name' + Math.floor(Math.random() * 1000)
      };

      const response = await controller.putCategory(categoryId, payload).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(payload.name);
    });

    it('PUT check name validation on 30 symbols are allowed', async () => {
      const randomText = Array.from({ length: 30 }, () =>
        String.fromCharCode(Math.random() * 26 + 65)
      ).join('');

      const payload = {
        name: randomText
      };

      const response = await controller.putCategory(categoryId, payload).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(payload.name);
    });

    it('PUT check name validation on 31 symbols are not allowed', async () => {
      const payload = {
        name: 'this is thirtyO characters long'
      };

      const response = await controller.putCategory(categoryId, payload).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(422);
      expect(response.body.error).toBe('Brand name is too long');
    });

    it('PUT An error is shown when updating invalid category', async () => {
      const payload = {
        name: 'test name' + Math.floor(Math.random() * 1000)
      };

      const response = await controller.putCategory('invalid_id', payload).set('Authorization', `Bearer ${token}`);
      console.log('response for PUT An error is shown when updating invalid category', response.body);
      expect(response.status).toBe(422);
      expect(response.body.error).toBe('Unable to update categories');
    });
  });

  describe('DELETE category', () => {
    it('DELETE invalid category by invalid categoryId', async () => {
      const response = await controller.deleteCategory('invalid_id').set('Authorization', `Bearer ${token}`);
      console.log('response for DELETE category', response.body);
      expect(response.status).toEqual(422);
      expect(response.body.error).toEqual('Unable to delete categories');
    });
  });
}); 