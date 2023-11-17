import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import style from './Login.module.scss';

import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { useInput } from '../../hooks/UseInput';
import { Logo } from '../../components/Logo';
import { NavigateButton } from '../../components/UI/NavigateButton';

export function Login() {
	axios.defaults.withCredentials = true;
	const email = useInput('', {
		correctEmail: true,
	});
	const password = useInput('', {
		correctPassword: true,
	});
	const navigate = useNavigate();
	const handleClickPrimaryButton = async e => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`http://localhost:8000/auth/login`,
				{
					username: email.value,
					password: password.value,
				},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				}
			);
			if (response) {
				navigate('/user-page', {
					state: {
						successfulMailDeliveryText: `${email.value}`,
					},
				});
			}
		} catch (error) {
			if (error.response.status === 400) {
				console.log(error);
				if (error.response.data.detail === 'LOGIN_USER_NOT_VERIFIED') {
					navigate('/verify-error', {
						state: {
							email: email.value,
						},
					});
				} else if (error.response.data.detail === 'LOGIN_BAD_CREDENTIALS') {
					console.log('Неверная почта или пароль');
				}
			}
		}
	};
	const message = async () => {
		await axios.get('http://localhost:8000/protected-route');
	};
	return (
		<div>
			<Logo />
			<div className={style.login_container}>
				<h1 className={style.login_title}>Авторизация</h1>
				<form
					onSubmit={e => handleClickPrimaryButton(e)}
					className={style.login_form_container}
				>
					<div className={style.login_input__group}>
						<label className={style.login_label}>Почта</label>
						<Input
							onChange={e => email.onChange(e)}
							onBlur={() => email.onBlur()}
							value={email.value}
							type='text'
							name='email'
							placeholder='Введите почту'
							errorValidation={email.isDirty && email.emailError}
							maxLength='41'
						/>
						{email.isDirty && email.emailError && (
							<div className={style.login_error__validation}>
								Почта должна содержать корпоративный домен
							</div>
						)}
					</div>
					<div className={style.login_input__group}>
						<label className={style.login_label}>Пароль</label>
						<Input
							onChange={e => password.onChange(e)}
							onBlur={() => password.onBlur()}
							value={password.value}
							type='password'
							name='password'
							placeholder='Введите пароль'
							errorValidation={password.isDirty && password.passwordError}
						/>
						{password.isDirty && password.passwordError && (
							<div className={style.login_error__validation}>
								Длина пароля должна быть не менее 8 символов.
								<br /> Пароль должен содержать буквы верхнего и нижнего
								регистра, цифры, спец. символы
							</div>
						)}
					</div>
					<div className={style.login_button__container}>
						<Button
							// disabled={!email.inputValid || !password.inputValid}
							type='submit'
						>
							Войти
						</Button>
					</div>
				</form>
				<div className={style.login_navigate__container}>
					<NavigateButton path='/password-reset'>Забыли пароль?</NavigateButton>
					<NavigateButton path='/registration'>Регистрация</NavigateButton>
				</div>
				<Button type={'submit'} onClick={message}>
					Кнопка защищенного роута
				</Button>
			</div>
		</div>
	);
}
