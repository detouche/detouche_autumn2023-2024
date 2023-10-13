import { useNavigate } from 'react-router-dom'

import { Button } from '../UI/Button'
import { Input } from '../UI/Input'
import { useInput } from '../../hooks/UseInput'
import { Logo } from '../Logo'
import { Navigate } from '../Navigate'

import style from './Registration.module.scss'

export function Registration() {
	const email = useInput('', {
		correctEmail: true,
	})
	const password = useInput('', {
		correctPassword: true,
	})
	const navigate = useNavigate()
	const handleClickPrimaryButton = () => {
		navigate('/checkEmail', {
			state: {
				successfulMailDeliveryText: `На ваш адрес электронной почты ${email.value} была отправлена ссылка для завершения регистрации`,
			},
		})
	}
	return (
		<div>
			<Logo />
			<form className={style.registration_container}>
				<h1 className={style.registration_title}>Регистрация</h1>
				<div className={style.registration_input__group}>
					<label className={style.registration_label}>Почта</label>
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
						<div className={style.registration_error__validation}>
							Почта должна содержать корпоративный домен
						</div>
					)}
				</div>
				<div className={style.registration_input__group}>
					<label className={style.registration_label}>Пароль</label>
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
						<div className={style.registration_error__validation}>
							Длина пароля должна быть не менее 8 символов.
							<br /> Пароль должен содержать буквы верхнего и нижнего регистра,
							цифры, спец. символы
						</div>
					)}
				</div>
				<Button
					disabled={!email.inputValid || !password.inputValid}
					type='submit'
					onClick={handleClickPrimaryButton}
				>
					Зарегистрироваться
				</Button>
				<Navigate path='/login'>Вход</Navigate>
			</form>
		</div>
	)
}
