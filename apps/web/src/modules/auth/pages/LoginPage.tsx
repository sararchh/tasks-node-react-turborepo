import { LoginView } from '../components/LoginView';
import { AppPage } from '../../../shared/core/Page';
import { PAGE_PATH_LOGIN } from '../constants/AuthPathUrl';

export function LoginPageViewElement() {
  return <LoginView />;
}

export const LoginPageRoute = new AppPage({
  path: PAGE_PATH_LOGIN,
  element: <LoginPageViewElement />,
});
