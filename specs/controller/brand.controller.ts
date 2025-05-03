import * as supertest from 'supertest';
const request = supertest('https://practice-react.sdetunicorns.com/api/test');

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


