import * as supertest from 'supertest';
const request = supertest('https://practice-react.sdetunicorns.com/api/test');

type Brand = {
  [key: string]: string;
};

class BrandController {
  getBrands() {
    return request.get('/brands');
  }

  getBrandById(brandId: string) {
    return request.get(`/brands/${brandId}`);
  }

  postBrands(payload: Brand) {
    return request.post('/brands').send(payload);
  }

  putBrands(brandId: string, payload: Brand) {
    return request.put(`/brands/${brandId}`).send(payload);
  }

  deleteBrands(brandId: string) {
    return request.delete(`/brands/${brandId}`);
  }
}

export default new BrandController();


