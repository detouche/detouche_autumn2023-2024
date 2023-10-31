import { useNavigate } from 'react-router-dom'

import style from './Navigate.module.scss'

export function Navigate({ children, ...props }) {
	const navigate = useNavigate()
	return (
		<div className={style.navigate_container}>
			<button
				className={style.navigate_button}
				onClick={() => navigate(`${props.path}`)}
			>
				{children}
			</button>
		</div>
	)
}
