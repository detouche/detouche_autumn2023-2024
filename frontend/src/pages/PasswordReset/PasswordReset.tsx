import { useNavigate } from 'react-router-dom'

import { Button } from '../../components/UI/Button'
import { Input } from '../../components/UI/Input'
import { useInput } from '../../hooks/UseInput'
import { Logo } from '../../components/Logo'
import { Navigate } from '../../components/UI/Navigate'

import style from './PasswordReset.module.scss'

export function PasswordReset() {
	const email = useInput('', {
		correctEmail: true,
	})
	const navigate = useNavigate()
	const handleClickPrimaryButton = e => {
		e.preventDefault()
		navigate('/checkEmail', {
			state: {
				successfulMailDeliveryText: `На ваш адрес электронной почты ${email.value} была отправлена ссылка для сброса пароля`,
			},
		})
	}
	return (
		<>
			<Logo />
			<div className={style.password_reset_container}>
				<h1 className={style.password_reset_title}>Восстановление пароля</h1>
				<form onSubmit={e => handleClickPrimaryButton(e)}>
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

					<Button disabled={!email.inputValid} type='submit'>
						Далее
					</Button>
				</form>
				<Navigate path='/login'>Назад к входу</Navigate>
			</div>
		</>
	)
}
