import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import style from './PasswordReset.module.scss';

import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { useInput } from '../../hooks/UseInput';
import { Logo } from '../../components/Logo';
import { NavigateButton } from '../../components/UI/NavigateButton';

export function PasswordReset() {
	axios.defaults.withCredentials = true;
	const email = useInput('', {
		correctEmail: true,
	});
	const navigate = useNavigate();
	const handleClickPrimaryButton = async e => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`http://localhost:8000/auth/forgot-password`,
				{
					email: email.value,
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
						successfulMailDeliveryText: `На ваш адрес электронной почты ${email.value} была отправлена ссылка для сброса пароля`,
					},
				});
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div>
			<Logo />
			<div className={style.password_reset_container}>
				<h1 className={style.password_reset_title}>Восстановление пароля</h1>
				<form
					onSubmit={e => handleClickPrimaryButton(e)}
					className={style.password_reset_form_container}
				>
					<div className={style.password_reset_input__group}>
						<label className={style.password_reset_label}>Почта</label>
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
							<div className={style.password_reset_error__validation}>
								Почта должна содержать корпоративный домен
							</div>
						)}
					</div>
					<div className={style.password_reset_button__container}>
						<Button
							disabled={!email.inputValid}
							type='submit'
						>
							Далее
						</Button>
					</div>
				</form>
				<div className={style.password_reset_navigate__container}>
					<NavigateButton path='/login'>Вернуться ко входу</NavigateButton>
				</div>
			</div>
		</div>
	);
}
