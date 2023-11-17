import { Route, Routes } from 'react-router-dom';

import { Registration } from './pages/Registration';
import { Login } from './pages/Login';
import { CheckEmail } from './pages/CheckEmail';
import { PasswordReset } from './pages/PasswordReset';
import { PasswordResetConfirmed } from './pages/PasswordResetConfirmed';
import { UserPage } from './pages/UserPage';
import { VerifyEmail } from './pages/VerifyEmail';
import { LinkError } from './pages/LinkError';
import { VerifyError } from './pages/VerifyError';
import { NotFound404 } from './pages/NotFound404';

import './App.module.scss';

function App() {
	return (
		<>
			<Routes>
				<Route path='/login' element={<Login />} />
				<Route path='/check-email' element={<CheckEmail />} />
				<Route path='/registration' element={<Registration />} />
				<Route path='/password-reset' element={<PasswordReset />} />
				<Route
					path='/password-reset-confirmed/:token'
					element={<PasswordResetConfirmed />}
				/>
				<Route path='/user-page' element={<UserPage />} />
				<Route path='/registration/:token' element={<VerifyEmail />} />
				<Route path='/link-error' element={<LinkError />} />
				<Route path='/verify-error' element={<VerifyError />} />
				<Route path='*' element={<NotFound404 />} />
			</Routes>
		</>
	);
}

export default App;
