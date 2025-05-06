import * as supertest from 'supertest';
import config from '../config/base.config';
const request = supertest(config.baseUrl);

class AdminController {

  // getToken() {
  //   const response = request
  //     .post('/auth/login')
  //     .send({
  //       email: 'mod@mail.com',
  //       password: 'Modpass123!'
  //     })
  //   return response;
  // }

  postAdminLogin(data: { [key: string]: string }) {
    return request.post('/admin/login').send(data);
  }
}

export default new AdminController(); 