import style from './Input.module.scss';

export function Input({ ...props }) {
	return (
		<input
			className={
				props.errorValidation ? style.input_invalid : style.input_valid
			}
			{...props}
		/>
	);
}
