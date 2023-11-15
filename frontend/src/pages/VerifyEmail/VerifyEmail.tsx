import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export function VerifyEmail() {
	const navigate = useNavigate();
	const { token } = useParams();
	const formatted_token = token?.replace(new RegExp('&', 'g'), '.');
	const verify_request = async () => {
		try {
			const response = await axios.post(
				`http://localhost:8000/auth/verify`,
				{
					token: formatted_token,
				},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			console.log(response);
			if (response.status === 200) {
				navigate('/login');
			}
		} catch (error) {
			if (error.response.status === 400) {
				navigate('/link-error', {
					state: {
						linkErrorTitle: 'Неверная ссылка',
						linkErrorText:
							'Вы нажали на неверную ссылку для подтверждения регистрации\nПопробуйте еще раз.',
						linkErrorBtnText: 'Регистрация',
						linkErrorBtnPath: '/registration',
					},
				});
			} else {
				navigate('/link-error', {
					state: {
						linkErrorTitle: 'Неверная ссылка',
						linkErrorText:
							'Вы нажали на неверную ссылку для подтверждения регистрации\nПопробуйте еще раз.',
						linkErrorBtnText: 'Регистрация',
						linkErrorBtnPath: '/registration',
					},
				});
			}
		}
	};

	verify_request();

	return <></>;
}
