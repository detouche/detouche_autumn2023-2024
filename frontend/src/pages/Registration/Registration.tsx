// import { useEffect, useState } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import style from './Registration.module.scss';

import { EyeShowPassword } from '../../components/EyeShowPassword';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { useInput } from '../../hooks/UseInput';
import { Logo } from '../../components/Logo';
import { NavigateButton } from '../../components/UI/NavigateButton';

export function Registration() {
	axios.defaults.withCredentials = true;
	const email = useInput('', {
		correctEmail: true,
	});
	const password = useInput('', {
		correctPassword: true,
	});
	const [showPassword, setShowPassword] = useState(false);
	const [errorText, setErrorText] = useState('');
	// const [error, setError] = useState('error');
	// const [resp, setResp] = useState(null)
	const navigate = useNavigate();
	const handleClickPrimaryButton = async e => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`http://localhost:8000/auth/register`,
				{
					email: email.value,
					password: password.value,
				},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			if (response) {
				navigate('/check-email', {
					state: {
						successfulMailDeliveryText: `На ваш адрес электронной почты ${email.value} была отправлена ссылка для завершения регистрации`,
					},
				});
			}
		} catch (error) {
			// console.log(error);
			if (error.response.status === 400) {
				if (
					error.response.data.detail.code === 'REGISTER_NOT_AVAILABLE_EMAIL'
				) {
					setErrorText('Данной почты нет в системе');
				} else if (
					error.response.data.detail === 'REGISTER_USER_ALREADY_EXISTS'
				) {
					setErrorText('Данная почта уже зарегистрирована');
				} else if (
					error.response.data.detail.code === 'REGISTER_INVALID_PASSWORD'
				) {
					setErrorText('Пароль не проходит валидацию');
				} else if (
					error.response.data.detail.code === 'REGISTER_WRONG_EMAIL_DOMAIN'
				) {
					setErrorText('Неправильный домен почты');
				}
			}
		}
	};

	return (
		<div>
			<Logo />
			<div className={style.registration_container}>
				<h1 className={style.registration_title}>Регистрация</h1>
				<form
					onSubmit={e => handleClickPrimaryButton(e)}
					className={style.registration_form_container}
				>
					<div className={style.registration_input__group}>
						<label className={style.registration_label}>Почта</label>
						<Input
							onChange={e => {
								email.onChange(e);
								setErrorText('');
							}}
							onBlur={() => email.onBlur()}
							value={email.value}
							type='text'
							name='email'
							placeholder='Введите почту'
							errorValidation={email.isDirty && email.emailError}
							maxLength='41'
						/>
						{email.isDirty && email.emailError && (
							<div className={style.registration_error__validation}>
								Почта должна содержать корпоративный домен
								{/* {error} */}
							</div>
						)}
					</div>
					<div className={style.registration_input__group}>
						<label className={style.registration_label}>Пароль</label>
						<div className={style.registration_password__group_container}>
							<Input
								onChange={e => {
									password.onChange(e);
									setErrorText('');
								}}
								onBlur={() => password.onBlur()}
								value={password.value}
								type={showPassword ? 'text' : 'password'}
								name='password'
								placeholder='Введите пароль'
								errorValidation={password.isDirty && password.passwordError}
								maxLength='41'
							/>
							<div className={style.registration_eye_icon__container}>
								<EyeShowPassword
									showPassword={showPassword}
									setShowPassword={setShowPassword}
								/>
							</div>
						</div>
						{password.isDirty && password.passwordError && (
							<div className={style.registration_error__validation}>
								Длина пароля должна быть не менее 8 символов.
								<br /> Пароль должен содержать буквы верхнего и нижнего
								регистра, цифры, спец. символы
								{/* {error} */}
							</div>
						)}
					</div>
					{errorText !== '' && (
						<div className={style.registration_error__validation}>
							{<p>{errorText}</p>}
						</div>
					)}
					<div className={style.registration_button__container}>
						<Button
							disabled={!email.inputValid || !password.inputValid}
							type='submit'
						>
							Зарегистрироваться
						</Button>
					</div>
				</form>
				<div className={style.registration_navigate__container}>
					<NavigateButton path='/login'>Вход</NavigateButton>
				</div>
			</div>
		</div>
	);
}
