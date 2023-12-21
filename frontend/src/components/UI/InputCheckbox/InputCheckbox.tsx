import style from './InputCheckbox.module.scss';

export function InputCheckbox({ ...props }) {
	return (
		<label className={style.checkbox}>
			<input {...props} />
			<span className={style.checkbox_switch}></span>
		</label>
	);
}
