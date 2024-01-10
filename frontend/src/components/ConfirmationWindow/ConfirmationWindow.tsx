import style from './ConfirmationWindow.module.scss';

export function ConfirmationWindow({
	setConfirmation,
	setShowConfirmationWindow,
	confirmationWindowStyle = {},
}) {
	return (
		<div className={style.main} style={confirmationWindowStyle}>
			<div className={style.confirmation_window_container}>
				<h1 className={style.confirmation_window_title}>
					Подтвердите действие
				</h1>
				<div className={style.confirmation_window_button_container}>
					<button
						className={style.confirmation_window_button_affirmative}
						onClick={() => {
							setConfirmation(true);
							setShowConfirmationWindow(false);
						}}
					>
						Подтвердить
					</button>
					<button
						className={style.confirmation_window_button_reject}
						onClick={() => {
							setConfirmation(false);
							setShowConfirmationWindow(false);
						}}
					>
						Отклонить
					</button>
				</div>
			</div>
		</div>
	);
}
