import { Route, Routes } from 'react-router-dom'

import { Registration } from './components/Registration'
import { Login } from './components/Login'
import { CheckEmail } from './components/CheckEmail'
import { PasswordReset } from './components/PasswordReset'
import { PasswordResetConfirmed } from './components/PasswordResetConfirmed'

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
