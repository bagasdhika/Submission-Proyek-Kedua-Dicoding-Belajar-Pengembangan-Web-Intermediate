import HomePage from '../pages/home/home-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import AddStoryPage from '../pages/add-story/add-story-page';

/* ===============================
   SPA ROUTES
   ===============================
   Key   : hash route
   Value : page instance
================================ */
const routes = {
  '/': new HomePage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/add': new AddStoryPage(),
};

export default routes;
