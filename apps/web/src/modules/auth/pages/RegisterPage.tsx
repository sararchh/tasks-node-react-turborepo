import { RegisterView } from '../components/RegisterView';
import { AppPage } from '../../../shared/core/Page';
import PATHS from '@/routes/paths';


export function RegisterPageViewElement() {
  return <RegisterView />;
}

export const RegisterPageRoute = new AppPage({
  path: PATHS.register,
  element: <RegisterPageViewElement />,
});
