import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import style from './NotFound404.module.scss';

import { Logo } from '../../components/Logo';
import { Button } from '../../components/UI/Button';

export function NotFound404() {
	const navigate = useNavigate();
	const logoutSystem = async () => {
		try {
			const response = await axios.post(
				`http://localhost:8000/auth/logout`,
				{},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
		} catch (error) {
			return;
		}
	};
	return (
		<div>
			<Logo />
			<div className={style.not_found_404__container}>
				<img src='/img/404.svg' alt='NotFound404' />
				<p className={style.not_found_404__text}>
					Возможно страница была перемещена,
					<br />
					или вы просто неверно указали адрес страницы
				</p>
				<div className={style.not_found_404_button__container}>
					<Button
						onClick={() => {

							navigate('/my-application');
						}}
					>
						Перейти на главную
					</Button>
				</div>
			</div>
		</div>
	);
}
