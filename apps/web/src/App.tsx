import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPageRoute, RegisterPageRoute, DashboardPageRoute } from './modules/auth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={LoginPageRoute.path} element={LoginPageRoute.element} />
        <Route path={RegisterPageRoute.path} element={RegisterPageRoute.element} />
        <Route path={DashboardPageRoute.path} element={DashboardPageRoute.element} />
        <Route path="/" element={<div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Task Management System</h1>
            <div className="space-x-4">
              <a href="/login" className="px-4 py-2 bg-blue-500 text-white rounded">Login</a>
              <a href="/register" className="px-4 py-2 bg-green-500 text-white rounded">Register</a>
            </div>
          </div>
        </div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
