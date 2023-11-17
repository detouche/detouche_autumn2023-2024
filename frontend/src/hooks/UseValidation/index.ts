import { useEffect, useState } from 'react';

const EMAIL_DOMAIN: string = import.meta.env.VITE_EMAIL_DOMAIN;

const EMAIL_DOMAIN_ARRAY: string[] =
	EMAIL_DOMAIN && EMAIL_DOMAIN.length != 0 ? JSON.parse(EMAIL_DOMAIN) : [];

let emailPattern: RegExp;

if (!(EMAIL_DOMAIN_ARRAY.length == 0)) {
	const allowedDomainsPattern = EMAIL_DOMAIN_ARRAY.map(domain =>
		domain.replace('.', '\\.')
	).join('|');
	emailPattern = new RegExp('^[\\w\\.-]+@(' + allowedDomainsPattern + ')$');
} else {
	emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
}

const passwordPattern: RegExp =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~'"=\-`\\])(?=.*[0-9])(?!.*[а-яА-Я])(?!.*[\s]).{8,41}$/;

export const useValidation = (value, validations) => {
	const [passwordError, setPasswordError] = useState(false);
	const [emailError, setEmailError] = useState(false);
	const [inputValid, setInputValid] = useState(false);

	useEffect(() => {
		for (const validation in validations) {
			switch (validation) {
				case 'correctEmail':
					emailPattern.test(String(value).toLowerCase())
						? setEmailError(false)
						: setEmailError(true);
					break;
				case 'correctPassword':
					passwordPattern.test(String(value))
						? setPasswordError(false)
						: setPasswordError(true);
					break;
			}
		}
	}, [value]);

	useEffect(() => {
		emailError || passwordError ? setInputValid(false) : setInputValid(true);
	}, [emailError, passwordError]);

	return {
		emailError,
		passwordError,
		inputValid,
	};
};
