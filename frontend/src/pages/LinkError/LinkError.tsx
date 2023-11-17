import { useNavigate, useLocation } from 'react-router-dom';

import style from './LinkError.module.scss';

import { NavigateButton } from '../../components/UI/NavigateButton';
import { Button } from '../../components/UI/Button';
import { Logo } from '../../components/Logo';

export function LinkError() {
	const navigate = useNavigate();
	const { state } = useLocation();
	const { linkErrorTitle, linkErrorText, linkErrorBtnText, linkErrorBtnPath } =
		state || '';
	return (
		<div>
			<Logo />
			<div className={style.link_error__container}>
				<h1 className={style.link_error__title}>{linkErrorTitle}</h1>
				<p className={style.link_error__text}>{linkErrorText}</p>
				<div className={style.link_error_button__container}>
					<Button onClick={() => navigate(`${linkErrorBtnPath}`)}>
						{linkErrorBtnText}
					</Button>
				</div>
				<div className={style.link_error_navigate__container}>
					<NavigateButton path='/login'>Вход</NavigateButton>
				</div>
			</div>
		</div>
	);
}
