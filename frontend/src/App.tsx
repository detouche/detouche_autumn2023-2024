import { Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

import './App.module.scss';

import { Registration } from './pages/Registration';
import { Login } from './pages/Login';
import { CheckEmail } from './pages/CheckEmail';
import { PasswordReset } from './pages/PasswordReset';
import { PasswordResetConfirmed } from './pages/PasswordResetConfirmed';
import { CreateApplication } from './pages/CreateApplication';
import { MyApplication } from './pages/MyApplication';
import { VerifyEmail } from './pages/VerifyEmail';
import { LinkError } from './pages/LinkError';
import { VerifyError } from './pages/VerifyError';
import { NotFound404 } from './pages/NotFound404';
import { ConsiderationApplication } from './pages/ConsiderationApplication';
import { ProgressApplication } from './pages/ProgressApplication';
import { AllApplication } from './pages/AllApplication';
import { OrganizationStructure } from './pages/OrganizationStructure';
import { OrganizationStructureCreateUser } from './pages/OrganizationStructureCreateUser';
import { OrganizationStructureCreateChildren } from './pages/OrganizationStructureCreateChildren';
import { OrganizationStructureStaffUnit } from './pages/OrganizationStructureStaffUnit';
import { Administration } from './pages/Administration';
import { CalendarPage } from './pages/CalendarPage';
import { PersonalAccount } from './pages/PersonalAccount';

function App() {
	const [isAdmin, setIsAdmin] = useState(null);
	const [isAuthorization, setIsAuthorization] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		async function fetchData() {
			try {
				const response = await axios.get(`http://localhost:8000/users/me`, {
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				});
				if (response.data.role.id === 2) {
					setIsAdmin(true);
				} else {
					setIsAdmin(false);
				}
				setIsAuthorization(true);
			} catch (error) {
				setIsAdmin(false);
				setIsAuthorization(false);
			} finally {
				setLoading(false); // Устанавливаем loading в false после получения ответа (в любом случае)
			}
		}
		fetchData();
	}, []);
	return (
		<>
			{!loading && (
				<Routes>
					<Route
						path='/login'
						element={<Login setIsAuthorization={setIsAuthorization} />}
					/>
					<Route path='/calendar' element={<CalendarPage />} />
					<Route path='/check-email' element={<CheckEmail />} />
					<Route path='/registration' element={<Registration />} />
					<Route path='/password-reset' element={<PasswordReset />} />
					<Route
						path='/password-reset-confirmed/:token'
						element={<PasswordResetConfirmed />}
					/>
					<Route path='/registration/:token' element={<VerifyEmail />} />
					<Route path='/link-error' element={<LinkError />} />
					<Route path='/verify-error' element={<VerifyError />} />
					{isAuthorization && (
						<Route path='/create-application' element={<CreateApplication />} />
					)}
					{isAuthorization && (
						<Route path='/my-application' element={<MyApplication />} />
					)}
					{isAuthorization && (
						<Route
							path='/consideration-application'
							element={<ConsiderationApplication />}
						/>
					)}
					{isAuthorization && (
						<Route
							path='/progress-application'
							element={<ProgressApplication />}
						/>
					)}
					{isAuthorization && (
						<Route path='/all-application' element={<AllApplication />} />
					)}
					{isAuthorization && (
						<Route
							path='/organization-structure'
							element={<OrganizationStructure />}
						/>
					)}
					{isAuthorization && (
						<Route path='/account' element={<PersonalAccount />} />
					)}
					{isAuthorization && (
						<Route path='/administration' element={<Administration />} />
					)}

					{isAdmin && (
						<Route
							path='/organization-structure-create-user'
							element={<OrganizationStructureCreateUser />}
						/>
					)}
					{isAdmin && (
						<Route
							path='/organization-structure-create-children'
							element={<OrganizationStructureCreateChildren />}
						/>
					)}
					{isAdmin && (
						<Route
							path='/organization-structure-staff-unit'
							element={<OrganizationStructureStaffUnit />}
						/>
					)}
					{isAuthorization ? (
						<Route path='*' element={<NotFound404 />} />
					) : (
						<Route path='*' element={<Navigate to='/login'/>} />
					)}
				</Routes>
			)}
		</>
	);
}

export default App;