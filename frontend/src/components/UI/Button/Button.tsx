import style from './Button.module.scss'

export function Button({ children, ...props }) {
	return (
		<button className={style.button} {...props}>
			{children}
		</button>
	)
}
