export function EyeShowPassword({ showPassword, setShowPassword }) {
	return (
		<img
			src={showPassword ? '/img/visibility_off.svg' : '/img/visibility.svg'}
			alt='eye_icon'
			onClick={() => setShowPassword(!showPassword)}
		/>
	);
}
