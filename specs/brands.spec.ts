import { describe, it } from '@jest/globals';
import * as supertest from 'supertest';
import { object, number, string, array, date } from 'superstruct';

const request = supertest('https://practice-react.sdetunicorns.com/api/test');
let brandId;
const today = new Date();

const payloadForPostRequest = {
  name: 'test name' + Math.floor(Math.random() * 1000),
  description: 'test description',
};

beforeAll(async () => {
  const response = await request.post('/brands').send(payloadForPostRequest);

  console.log('beforeAll response: ', response.body);

  brandId = response.body['_id'];
  console.log('beforeAll brandId: ', brandId);

  expect(response.status).toBe(200);
  expect(response.body.name).toBe(payloadForPostRequest.name);
  expect(response.body.description).toBe(payloadForPostRequest.description);
  expect(response.body).toHaveProperty('createdAt');
  expect(response.body.createdAt).toContain(today.getFullYear().toString());
  expect(response.body.createdAt).toContain(today.getDate().toString().padStart(2, '0'));
});

describe('brands', () => {
  it('GET brands', async () => {
    const response = await request.get('/brands');

    console.log('response', response.body);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(1);

    const hasNameAndIdProperties = response.body.every((el) => '_id' in el && 'name' in el);
    expect(hasNameAndIdProperties).toBeTruthy();

    const objectKeys = Object.keys(response.body[0]);
    console.log('object keys', objectKeys);
    expect(objectKeys).toEqual(['_id', 'name']);
  });

  describe('POST create a new brand', () => {
    describe('Create brands', () => {
      it('Create a new brand', async () => {
        const payload = {
          name: 'test name' + Math.floor(Math.random() * 1000),
          description: 'test description',}
        const response = await request.post('/brands').send(payload);

        console.log('response', response.body);

        expect(response.status).toBe(200);
        expect(response.body.name).toEqual(payload.name);
        expect(response.body.description).toBe(payloadForPostRequest.description);
        expect(response.body).toHaveProperty('createdAt');
        expect(response.body.createdAt).toContain(today.getFullYear().toString());
        expect(response.body.createdAt).toContain(today.getDate().toString().padStart(2, '0'));
      });
    });

    it('Schema verification - Name is a mandatory field', async () => {
      const response = await request.post('/brands').send({
        name: '',
        description: 'test description',
      });

      console.log('response', response.body);

      expect(response.status).toBe(422);
      expect(response.body.error).toEqual('Name is required');
    });

    it('Schema verification - Name with 2 symbols validation - Valid check', async () => {
      const value =
        String.fromCharCode(Math.random() * 26 + 65) +
        String.fromCharCode(Math.random() * 26 + 65);

      const payload = {
        name: value,
        description: 'test description',
      };

      console.log('Schema verification ', payload.name);
      const response = await request.post('/brands').send(payload);

      console.log('response', response.body);

      expect(response.status).toBe(200);
      expect(response.body.name).toEqual(payload.name);
    });

    it('Schema verification - Name with 1 symbol validation - test failed', async () => {
      const payload = {
        name: 't',
        description: 'test description',
      };

      const response = await request.post('/brands').send(payload);

      console.log('response', response.body);

      expect(response.status).toBe(422);
      expect(response.body.error).toEqual('Brand name is too short');
    });

    it('Duplicate brand entries are not allowed', async () => {
      const payload = {
        name: payloadForPostRequest.name,
        description: 'test description',
      };

      const response = await request.post('/brands').send(payload);

      console.log('response', response.body);

      expect(response.status).toBe(422);
      expect(response.body.error).toContain(`${payload.name} already exists`);
    });

    it('Business logic - GET /brands/invalidId will throw an error', async () => {
      const response = await request.get('/brands/invalid_id');

      console.log('response', response.body);

      expect(response.status).toBe(422);
      expect(response.body.error).toEqual('Unable to fetch brand');
    });

    it('Business logic - GET /brands/incorrect_id will throw an error', async () => {
      const response = await request.get('/brands/64b8866b49e85607248e2b21');

      console.log('response', response.body);

      expect(response.status).toBe(404);
      expect(response.body.error).toEqual('Brand not found.');
    });

    it('POST Brand description must be a string', async () => {
      const payload = {
        name: 'test name' + Math.floor(Math.random() * 1000),
        description: 111,
      };

      console.log('payload', payload);
      const response = await request.post('/brands').send(payload);

      console.log('response', response.body);

      expect(response.status).toBe(422);
      expect(response.body.error).toBe('Brand description must be a string');
    });
  });

  it('GET brand/:id', async () => {
    const response = await request.get('/brands/' + brandId);

    console.log('response', response.body);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(payloadForPostRequest.name);
  });

  describe('PUT update brand information', () => {
    it('PUT', async () => {
      const payload = {
        name: 'new name' + Math.floor(Math.random() * 1000),
      };

      console.log('brandId in PUT request', brandId);
      console.log('payload', payload);
      const response = await request.put(`/brands/${brandId}`).send(payload);

      expect(response.status).toBe(200);
      console.log('response', response.body);

      expect(response.body.name).toBe(payload.name);
    });

    it('PUT check name validation on 30 symbols are allowed', async () => {
      const randomText = Array.from({ length: 30 }, () =>
        String.fromCharCode(Math.random() * 26 + 65)
      ).join('');

      const payload = {
        name: randomText,
      };

      console.log('brandId in PUT request', brandId);
      console.log('payload', payload);
      const response = await request.put(`/brands/${brandId}`).send(payload);

      expect(response.status).toBe(200);
      console.log('response', response.body);

      expect(response.body.name).toBe(payload.name);
    });

    it('PUT check name validation on 31 symbols are not allowed', async () => {
      const payload = {
        name: 'this is thirtyO characters long',
      };

      console.log('payload', payload);
      const response = await request.put(`/brands/${brandId}`).send(payload);

      console.log('response', response.body);

      expect(response.status).toBe(422);
      expect(response.body.error).toBe('Brand name is too long');
    });

    it('PUT An error is shown when updating invalid brand', async () => {
      const payload = {
        name: 'test name' + Math.floor(Math.random() * 1000),
        describe: 'test describe',
      };

      console.log('payload', payload);
      const response = await request.put('/brands/64b8853449e85607248e2b11').send(payload);

      console.log('response', response.body);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Brand not found.');
    });
  });

  describe('DELETE brand', () => {
    it('DELETE', async () => {
      const response = await request.delete(`/brands/${brandId}`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(null);
    });

    it('DELETE invalid brand by invalid brandId', async () => {
      const response = await request.delete('/brands/64b8853449e85607248e2b11');

      expect(response.status).toEqual(404);
      expect(response.body.error).toEqual('Brand not found.');
    });
  });
});