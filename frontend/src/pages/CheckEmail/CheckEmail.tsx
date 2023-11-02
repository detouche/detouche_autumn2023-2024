import { useNavigate, useLocation } from 'react-router-dom'

import { Logo } from '../../components/Logo'
import { Button } from '../../components/UI/Button'

import style from './CheckEmail.module.scss'

export function CheckEmail() {
	const navigate = useNavigate()
	const { state } = useLocation()
	const { successfulMailDeliveryText } = state
	return (
		<div className={style.check_email__container}>
			<Logo />
			<div className={style.check_email__content}>
				<h1 className={style.check_email__title}>Проверьте свою почту</h1>
				<p className={style.check_email__text}>{successfulMailDeliveryText}</p>
				<Button onClick={() => navigate('/login')}>Вход</Button>
			</div>
		</div>
	)
}
