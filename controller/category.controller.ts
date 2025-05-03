import * as supertest from 'supertest';
import config from '../config/base.config';

const request = supertest(config.baseUrl);

class CategoriesController {

  getToken() {
    const response = request
      .post('/auth/login')
      .send({
        email: 'mod@mail.com',
        password: 'Modpass123!'
      })
      .then((res) => {
        return res.body.token;
      });
    return response;
  }

  getCategories() {
    return request.get('/categories');
  }

  getCategoryById(categoryId: string) {
    return request.get(`/categories/${categoryId}`);
  }

  postCategories(payload: { name: string }) {
    return request.post('/categories').send(payload);
  }

  putCategory(categoryId: string, payload: { name: string }) {
    return request.put(`/categories/${categoryId}`).send(payload);
  }

  deleteCategory(categoryId: string) {
    return request.delete(`/categories/${categoryId}`);
  }
}

export default new CategoriesController(); 