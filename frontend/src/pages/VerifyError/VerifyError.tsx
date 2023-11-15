import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import style from './VerifyError.module.scss';

import { NavigateButton } from '../../components/UI/NavigateButton';
import { Button } from '../../components/UI/Button';
import { Logo } from '../../components/Logo';

export function VerifyError() {
	const navigate = useNavigate();
	const { state } = useLocation();
	const { email } = state || 'test@mail.ru';
	const verify_error = async () => {
		try {
			const response = await axios.post(
				`http://localhost:8000/auth/request-verify-token`,
				{
					email: email,
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
						successfulMailDeliveryText: `На ваш адрес электронной почты ${email} была отправлена ссылка для завершения регистрации`,
					},
				});
			}
		} catch (error) {
			navigate('/');
		}
	};
	return (
		<div className={style.verify_error__container}>
			<Logo />
			<div className={style.verify_error__content}>
				<h1 className={style.verify_error__title}>
					Вы не подтвердили свой аккаунт
				</h1>
				<p className={style.verify_error__text}>
					Для входа подтвердите свой аккаунт. <br />
					Если письмо с подтверждением потерялось,
					<br /> отправьте его повторно
				</p>
				<div className={style.verify_error_button__container}>
					<Button onClick={() => verify_error()}>Отправить еще раз</Button>
				</div>
				<div className={style.verify_error_navigate__container}>
					<NavigateButton path='/login'>Вход</NavigateButton>
				</div>
			</div>
		</div>
	);
}
