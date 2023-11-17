import { useNavigate, useLocation } from 'react-router-dom';

import style from './CheckEmail.module.scss';

import { Logo } from '../../components/Logo';
import { Button } from '../../components/UI/Button';

export function CheckEmail() {
	const navigate = useNavigate();
	const { state } = useLocation();
	const { successfulMailDeliveryText } = state || '';
	return (
		<div>
			<Logo />
			<div className={style.check_email__container}>
				<h1 className={style.check_email__title}>Проверьте свою почту</h1>
				<p className={style.check_email__text}>{successfulMailDeliveryText}</p>
				<div className={style.check_email_button__container}>
					<Button onClick={() => navigate('/login')}>Вход</Button>
				</div>
			</div>
		</div>
	);
}
