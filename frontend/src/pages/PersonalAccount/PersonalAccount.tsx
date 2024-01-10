import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import style from './PersonalAccount.module.scss';

import { Drawer } from '../../components/Drawer';
import { Header } from '../../components/Header';
import { EyeShowPassword } from '../../components/EyeShowPassword';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { useInput } from '../../hooks/UseInput';

export function PersonalAccount() {
	axios.defaults.withCredentials = true;
	const [userName, setUserName] = useState({
		id: '',
		title: '',
	});
	const [userStaffUnit, setUserStaffUnit] = useState({
		id: '',
		title: '',
	});
	const [userDivision, setUserDivision] = useState({
		id: '',
		title: '',
	});
	const [userEmail, setUserEmail] = useState('');
	const [editingPassword, setEditingPassword] = useState(false);
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmationPassword, setShowConfirmationPassword] =
		useState(false);
	const currentPassword = useInput('', {
		correctPassword: true,
	});
	const password = useInput('', {
		correctPassword: true,
	});
	const confirmationPassword = useInput('', {});

	const [showSuccessfulEditingPassword, setShowSuccessfulEditingPassword] =
		useState(false);

	useEffect(() => {
		const getUserInfo = async () => {
			try {
				const response = await axios.get(`http://localhost:8000/users/me`, {
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				});
				const user_surname = response.data.surname;
				const user_name = response.data.name;
				const user_patronymic = response.data.patronymic;
				const user_full_name = `${user_surname} ${user_name} ${user_patronymic}`;
				const user_id = response.data.id;
				setUserName({ id: user_id, title: user_full_name });
				const staff_unit_id = response.data.staff_unit.id;
				const staff_unit_name = response.data.staff_unit.name;
				setUserStaffUnit({ id: staff_unit_id, title: staff_unit_name });
				const division_id = response.data.division.id;
				const division_name = response.data.division.name;
				setUserDivision({ id: division_id, title: division_name });
				setUserEmail(response.data.email);
			} catch (error) {
				return;
			}
		};
		getUserInfo();
	}, []);

	const handleClickEditingPassword = async () => {
		try {
			const response = await axios.patch(
				`http://localhost:8000/users/me`,
				{
					password: password.value,
					is_active: true,
					is_superuser: true,
					is_verified: true,
				},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			setShowSuccessfulEditingPassword(true);
		} catch (error) {
			return;
		}
	};

	return (
		<div>
			<Drawer />
			<Header PageID={4} />
			<div className={style.personal_account_container}>
				{editingPassword ? (
					<div>
						<div className={style.personal_account_title_group}>
							<button
								className={style.personal_account_title_group_button}
								onClick={() => setEditingPassword(false)}
							>
								<img src='/img/arrow_back.svg' alt='arrow_back' />
								Назад
							</button>
							<h1 className={style.personal_account_title}>Изменение пароля</h1>
						</div>
						<ul className={style.personal_account_content_container}>
							<li>
								<label className={style.personal_account_password_label}>
									Текущий пароль
									<div
										className={
											currentPassword.value === ''
												? style.attention_figure
												: style.attention_figure_none
										}
									></div>
								</label>
								<div
									className={style.personal_account_password_input_container}
								>
									<Input
										onChange={e => {
											currentPassword.onChange(e);
											setShowSuccessfulEditingPassword(false);
										}}
										onBlur={() => currentPassword.onBlur()}
										value={currentPassword.value}
										type={showCurrentPassword ? 'text' : 'password'}
										name='currentPassword'
										placeholder='Введите текущий пароль'
										errorValidation={
											currentPassword.isDirty && currentPassword.passwordError
										}
										maxLength='41'
									/>
									<div
										className={
											style.personal_account_password_eye_icon__container
										}
									>
										<EyeShowPassword
											showPassword={showCurrentPassword}
											setShowPassword={setShowCurrentPassword}
										/>
									</div>
								</div>
								{currentPassword.isDirty && currentPassword.passwordError && (
									<div
										className={
											style.personal_account_password_error__validation
										}
									>
										Длина пароля должна быть не менее 8 символов.
										<br /> Пароль должен содержать буквы верхнего и нижнего
										регистра, цифры, спец. символы
									</div>
								)}
							</li>
							<li>
								<label className={style.personal_account_password_label}>
									Новый пароль
									<div
										className={
											password.value === ''
												? style.attention_figure
												: style.attention_figure_none
										}
									></div>
								</label>
								<div
									className={style.personal_account_password_input_container}
								>
									<Input
										onChange={e => {
											password.onChange(e);
											setShowSuccessfulEditingPassword(false);
										}}
										onBlur={() => password.onBlur()}
										value={password.value}
										type={showPassword ? 'text' : 'password'}
										name='password'
										placeholder='Введите новый пароль'
										errorValidation={password.isDirty && password.passwordError}
										maxLength='41'
									/>
									<div
										className={
											style.personal_account_password_eye_icon__container
										}
									>
										<EyeShowPassword
											showPassword={showPassword}
											setShowPassword={setShowPassword}
										/>
									</div>
								</div>
								{password.isDirty && password.passwordError && (
									<div
										className={
											style.personal_account_password_error__validation
										}
									>
										Длина пароля должна быть не менее 8 символов.
										<br /> Пароль должен содержать буквы верхнего и нижнего
										регистра, цифры, спец. символы
									</div>
								)}
							</li>
							<li>
								<label className={style.personal_account_password_label}>
									Подтверждение нового пароля
									<div
										className={
											confirmationPassword.value === ''
												? style.attention_figure
												: style.attention_figure_none
										}
									></div>
								</label>
								<div
									className={style.personal_account_password_input_container}
								>
									<Input
										onChange={e => {
											confirmationPassword.onChange(e);
											setShowSuccessfulEditingPassword(false);
										}}
										onBlur={() => confirmationPassword.onBlur()}
										value={confirmationPassword.value}
										type={showConfirmationPassword ? 'text' : 'password'}
										name='confirmationPassword'
										placeholder='Введите новый пароль'
										errorValidation={
											confirmationPassword.isDirty &&
											confirmationPassword.value !== password.value
										}
									/>
									<div
										className={
											style.personal_account_password_eye_icon__container
										}
									>
										<EyeShowPassword
											showPassword={showConfirmationPassword}
											setShowPassword={setShowConfirmationPassword}
										/>
									</div>
								</div>
								{confirmationPassword.isDirty &&
									confirmationPassword.value !== password.value && (
										<div
											className={
												style.personal_account_password_error__validation
											}
										>
											Пароли не совпадают
										</div>
									)}
								{showSuccessfulEditingPassword && (
									<div
										className={style.personal_account_password_success_editing}
									>
										Пароль успешно изменён
									</div>
								)}
							</li>
						</ul>
						<div
							className={
								style.personal_account_password_editing_button_container
							}
						>
							<Button
								disabled={
									!password.inputValid ||
									confirmationPassword.value !== password.value
								}
								onClick={() => handleClickEditingPassword()}
							>
								Изменить пароль
							</Button>
						</div>
					</div>
				) : (
					<div>
						<h1 className={style.personal_account_title}>{userName.title}</h1>
						<ul className={style.personal_account_content_container}>
							<li className={style.personal_account_content_element}>
								<p className={style.personal_account_content_element_title}>
									Должность
								</p>
								<p
									className={style.personal_account_content_element_title_text}
								>
									{userStaffUnit.title}
								</p>
							</li>
							<li className={style.personal_account_content_element}>
								<p className={style.personal_account_content_element_title}>
									Подразделение
								</p>
								<p
									className={style.personal_account_content_element_title_text}
								>
									{userDivision.title}
								</p>
							</li>
							<li className={style.personal_account_content_element}>
								<p className={style.personal_account_content_element_title}>
									Почта
								</p>
								<p
									className={style.personal_account_content_element_title_text}
								>
									{userEmail}
								</p>
							</li>
						</ul>
						<div className={style.personal_account_button_container}>
							<button
								className={style.personal_account_button}
								onClick={() => setEditingPassword(true)}
							>
								Изменить пароль
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
