import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import style from './PasswordResetConfirmed.module.scss';

import { EyeShowPassword } from '../../components/EyeShowPassword';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { useInput } from '../../hooks/UseInput';
import { Logo } from '../../components/Logo';
import { NavigateButton } from '../../components/UI/NavigateButton';

export function PasswordResetConfirmed() {
	axios.defaults.withCredentials = true;
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmationPassword, setShowConfirmationPassword] =
		useState(false);
	const { token } = useParams();
	const formatted_token = token?.replace(new RegExp('&', 'g'), '.');
	const password = useInput('', {
		correctPassword: true,
	});
	const confirmationPassword = useInput('', {});
	const navigate = useNavigate();
	const handleClickPrimaryButton = async e => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`http://localhost:8000/auth/reset-password`,
				{
					token: formatted_token,
					password: password.value,
				},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			console.log(response);
			if (response.status === 200) {
				navigate('/login');
			}
		} catch (error) {
			if (error.response.status === 400) {
				// console.log(error)
				navigate('/link-error', {
					state: {
						linkErrorTitle: 'Неверная ссылка',
						linkErrorText:
							'Вы нажали на неверную ссылку для сброса пароля.\nПопробуйте еще раз.',
						linkErrorBtnText: 'Восстановление пароля',
						linkErrorBtnPath: '/password-reset',
					},
				});
			} else {
				navigate('/link-error', {
					state: {
						linkErrorTitle: 'Неверная ссылка',
						linkErrorText:
							'Вы нажали на неверную ссылку для сброса пароля.\nПопробуйте еще раз.',
						linkErrorBtnText: 'Восстановление пароля',
						linkErrorBtnPath: '/password-reset',
					},
				});
			}
		}
	};
	return (
		<div>
			<Logo />
			<div className={style.password_reset_confirmed_container}>
				<h1 className={style.password_reset_confirmed_title}>
					Восстановление пароля
				</h1>
				<form
					onSubmit={e => handleClickPrimaryButton(e)}
					className={style.password_reset_confirmed_form_container}
				>
					<div className={style.password_reset_confirmed_input__group}>
						<label className={style.password_reset_confirmed_label}>
							Пароль
						</label>
						<div
							className={
								style.password_reset_confirmed_password__group_container
							}
						>
							<Input
								onChange={e => password.onChange(e)}
								onBlur={() => password.onBlur()}
								value={password.value}
								type={showPassword ? 'text' : 'password'}
								name='password'
								placeholder='Введите пароль'
								errorValidation={password.isDirty && password.passwordError}
								maxLength='41'
							/>
							<div
								className={style.password_reset_confirmed_eye_icon__container}
							>
								<EyeShowPassword
									showPassword={showPassword}
									setShowPassword={setShowPassword}
								/>
							</div>
						</div>
						{password.isDirty && password.passwordError && (
							<div className={style.password_reset_confirmed_error__validation}>
								Длина пароля должна быть не менее 8 символов.
								<br /> Пароль должен содержать буквы верхнего и нижнего
								регистра, цифры, спец. символы
							</div>
						)}
					</div>
					<div className={style.password_reset_confirmed_input__group}>
						<label className={style.password_reset_confirmed_label}>
							Подтверждение пароля
						</label>
						<div
							className={
								style.password_reset_confirmed_password__group_container
							}
						>
							<Input
								onChange={e => confirmationPassword.onChange(e)}
								onBlur={() => confirmationPassword.onBlur()}
								value={confirmationPassword.value}
								type={showConfirmationPassword ? 'text' : 'password'}
								name='confirmationPassword'
								placeholder='Подтвердите пароль'
								errorValidation={
									confirmationPassword.isDirty &&
									confirmationPassword.value !== password.value
								}
							/>
							<div
								className={style.password_reset_confirmed_eye_icon__container}
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
									className={style.password_reset_confirmed_error__validation}
								>
									Пароли не совпадают
								</div>
							)}
					</div>
					<div className={style.password_reset_confirmed_button__container}>
						<Button
							// disabled={
							// 	!password.inputValid ||
							// 	confirmationPassword.value !== password.value
							// }
							type='submit'
						>
							Восстановить
						</Button>
					</div>
				</form>
				<div className={style.password_reset_confirmed_navigate__container}>
					<NavigateButton path='/login'>Вернуться ко входу</NavigateButton>
				</div>
			</div>
		</div>
	);
}
