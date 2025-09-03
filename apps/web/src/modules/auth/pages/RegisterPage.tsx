import { RegisterView } from '../components/RegisterView';
import { AppPage } from '../../../shared/core/Page';
import { PAGE_PATH_REGISTER } from '../constants/AuthPathUrl';

export function RegisterPageViewElement() {
  return <RegisterView />;
}

export const RegisterPageRoute = new AppPage({
  path: PAGE_PATH_REGISTER,
  element: <RegisterPageViewElement />,
});
