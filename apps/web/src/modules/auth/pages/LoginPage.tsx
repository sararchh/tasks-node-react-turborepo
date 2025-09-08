import { LoginView } from '../components/LoginView';
import { AppPage } from '../../../shared/core/Page';
import PATHS from '@/routes/paths';


export function LoginPageViewElement() {
  return <LoginView />;
}

export const LoginPageRoute = new AppPage({
  path: PATHS.login,
  element: <LoginPageViewElement />,
});
