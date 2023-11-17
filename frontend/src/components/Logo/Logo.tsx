import style from './Logo.module.scss';

export function Logo() {
	return (
		<div className={style.logo_container}>
			<img src='img/logo.svg' alt='Logo' />
		</div>
	);
}
