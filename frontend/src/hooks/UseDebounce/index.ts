import { useState, useEffect } from 'react';

export const useDebounce = (value, delay?) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedValue(value), delay || 100);
		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
}