import { useNavigate } from 'react-router-dom'

import { Button } from '../UI/Button'
import { Input } from '../UI/Input'
import { useInput } from '../../hooks/UseInput'
import { Logo } from '../Logo'
import { Navigate } from '../Navigate'

import style from './PasswordResetConfirmed.module.scss'

export function PasswordResetConfirmed() {
	const password = useInput('', {
		correctPassword: true,
	})
	const confirmationPassword = useInput('', {})
	const navigate = useNavigate()
	const handleClickPrimaryButton = () => {
		navigate('/')
	}
	return (
		<div>
			<Logo />
			<form className={style.password_reset_confirmed_container}>
				<h1 className={style.password_reset_confirmed_title}>
					Восстановление пароля
				</h1>
				<div className={style.password_reset_confirmed_input__group}>
					<label className={style.password_reset_confirmed_label}>Пароль</label>
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
						<div className={style.password_reset_confirmed_error__validation}>
							Длина пароля должна быть не менее 8 символов.
							<br /> Пароль должен содержать буквы верхнего и нижнего регистра,
							цифры, спец. символы
						</div>
					)}
				</div>
				<div className={style.password_reset_confirmed_input__group}>
					<label className={style.password_reset_confirmed_label}>
						Подтверждение пароля
					</label>
					<Input
						onChange={e => confirmationPassword.onChange(e)}
						onBlur={() => confirmationPassword.onBlur()}
						value={confirmationPassword.value}
						type='password'
						name='confirmationPassword'
						placeholder='Подтвердите пароль'
						errorValidation={
							confirmationPassword.isDirty &&
							confirmationPassword.value !== password.value
						}
					/>
					{confirmationPassword.isDirty &&
						confirmationPassword.value !== password.value && (
							<div className={style.password_reset_confirmed_error__validation}>
								Пароли не совпадают
							</div>
						)}
				</div>
				<Button
					disabled={
						!password.inputValid ||
						confirmationPassword.value !== password.value
					}
					type='submit'
					onClick={handleClickPrimaryButton}
				>
					Восстановить
				</Button>
				<Navigate path='/login'>Назад к входу</Navigate>
			</form>
		</div>
	)
}
