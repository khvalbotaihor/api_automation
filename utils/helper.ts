import adminController from '../controller/admin.controller';

const login = async (email:string, password: string)  => {
  const data = {"email": email, "password": password,};

  const response = await adminController.postAdminLogin(data);
  console.log('response', response.body);

  return response.body.token;
};

