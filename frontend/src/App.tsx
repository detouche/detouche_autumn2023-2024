import { Route, Routes } from 'react-router-dom'

import { Registration } from './pages/Registration'
import { Login } from './pages/Login'
import { CheckEmail } from './pages/CheckEmail'
import { PasswordReset } from './pages/PasswordReset'
import { PasswordResetConfirmed } from './pages/PasswordResetConfirmed'

import './App.module.scss'

function App() {
	return (
		<>
			<Routes>
				<Route path='/login' element={<Login />} />
				<Route path='/checkEmail' element={<CheckEmail />} />
				<Route path='/registration' element={<Registration />} />
				<Route path='/passwordReset' element={<PasswordReset />} />
				<Route
					path='/passwordResetConfirmed'
					element={<PasswordResetConfirmed />}
				/>
				<Route path='*' element={<Login />} />
			</Routes>
		</>
	)
}

export default App
