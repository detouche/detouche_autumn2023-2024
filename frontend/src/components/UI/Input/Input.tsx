import style from './Input.module.scss';

export function Input({ ...props }) {
	return (
		<input
			className={`${style.input_text} ${
				props.errorValidation ? style.input_invalid : style.input_valid
			}`}
			{...props}
		/>
	);
}
