import adminController from '../controller/admin.controller';
import categoryController from '../controller/category.controller';
import config from '../config/base.config';

export const login = async (email:string, password: string)  => {
  const data = {"email": email, "password": password,};

  const response = await adminController.postAdminLogin(data);
  console.log('response', response.body);

  return response.body.token;
};

export const getCategoryId = async (token: string) => {
    const payload = {name: 'test category' + Math.floor(Math.random() * 1000)};
    const response = await categoryController.postCategories(payload).set('Authorization', `Bearer ${token}`);
    console.log('response', response.body);

    return response.body._id;
    
}

export const createCategory = async () => {
  const payload = {name: 'test category' + Math.floor(Math.random() * 1000)};
  const token = await login(config.credentials.email, config.credentials.password);
  const response = await categoryController.postCategories(payload).set('Authorization', `Bearer ${token}`);
  console.log('response', response.body);

  return payload;
}


