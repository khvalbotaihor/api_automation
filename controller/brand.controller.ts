import * as supertest from 'supertest';
import config from '../config/base.config';

const request = supertest(config.baseUrl);

class BrandsController {
  getBrands() {
    return request.get('/brands');
  }

  getBrandById(brandId: string) {
    return request.get(`/brands/${brandId}`);
  }

  postBrands(payload) {
    return request.post('/brands').send(payload);
  }

  putBrands(brandId: string, payload) {
    return request.put(`/brands/${brandId}`).send(payload);
  }

  deleteBrands(brandId: string) {
    return request.delete(`/brands/${brandId}`);
  }
}

export default new BrandsController();


