import { Route, Routes } from 'react-router-dom';

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
				<Route path='/create-application' element={<CreateApplication />} />
				<Route path='/registration/:token' element={<VerifyEmail />} />
				<Route path='/link-error' element={<LinkError />} />
				<Route path='/verify-error' element={<VerifyError />} />
				<Route path='/my-application' element={<MyApplication />} />
				<Route
					path='/consideration-application'
					element={<ConsiderationApplication />}
				/>
				<Route path='/progress-application' element={<ProgressApplication />} />
				<Route path='/all-application' element={<AllApplication />} />
				<Route
					path='/organization-structure'
					element={<OrganizationStructure />}
				/>
				<Route
					path='/organization-structure-create-user'
					element={<OrganizationStructureCreateUser />}
				/>
				<Route
					path='/organization-structure-create-children'
					element={<OrganizationStructureCreateChildren />}
				/>
				<Route
					path='/organization-structure-staff-unit'
					element={<OrganizationStructureStaffUnit />}
				/>
				<Route path='*' element={<NotFound404 />} />
			</Routes>
		</>
	);
}

export default App;
