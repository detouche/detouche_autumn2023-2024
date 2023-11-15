import { useNavigate } from 'react-router-dom';

import style from './NavigateButton.module.scss';

export function NavigateButton({ children, ...props }) {
	const navigate = useNavigate();
	return (
		<div className={style.navigate_button_container}>
			<button
				className={style.navigate_button}
				onClick={() => navigate(`${props.path}`)}
				{...props}
			>
				{children}
			</button>
		</div>
	);
}
