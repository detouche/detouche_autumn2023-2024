import { useState, useEffect } from 'react';

import { useValidation } from '../UseValidation';

export const useInput = (initialValue, validations) => {
	const [value, setValue] = useState(initialValue);
	const [isDirty, setDirty] = useState(false);
	const valid = useValidation(value, validations);

	useEffect(() => {
		setValue(initialValue); // Обновляем значение при изменении initialValue
	}, [initialValue]);

	const onChange = e => {
		setValue(e.target.value);
	};

	const onBlur = () => {
		setDirty(true);
	};
	
	return {
		value,
		onChange,
		onBlur,
		isDirty,
		...valid,
	};
};
