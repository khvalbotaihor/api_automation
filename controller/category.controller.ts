import * as supertest from 'supertest';
import config from '../config/base.config';

const request = supertest(config.baseUrl);

class CategoriesController {
  private token: string | null = null;

  async getToken() {
    try {
      if (!this.token) {
        const response = await request
          .post('/admin/login')
          .send({
            email: 'mod@mail.com',
            password: 'Modpass123!'
          });

        if (response.status !== 200) {
          console.error('Authentication failed:', response.body);
          throw new Error('Authentication failed');
        }

        this.token = response.body.token;
        if (!this.token) {
          throw new Error('Token not received in response');
        }
      }
      return this.token;
    } catch (error) {
      console.error('Error getting token:', error);
      throw error;
    }
  }

  private async authenticatedRequest(method: string, endpoint: string, data?: any) {
    const token = await this.getToken();
    const req = request[method](endpoint).set('Authorization', `Bearer ${token}`);
    
    if (data) {
      return req.send(data);
    }
    return req;
  }

  async getCategories() {
    return this.authenticatedRequest('get', '/categories');
  }

  async getCategoryById(categoryId: string) {
    return this.authenticatedRequest('get', `/categories/${categoryId}`);
  }

  async postCategories(payload: { name: string }) {
    return this.authenticatedRequest('post', '/categories', payload);
  }

  async putCategory(categoryId: string, payload: { name: string }) {
    return this.authenticatedRequest('put', `/categories/${categoryId}`, payload);
  }

  async deleteCategory(categoryId: string) {
    return this.authenticatedRequest('delete', `/categories/${categoryId}`);
  }
}

export default new CategoriesController(); 