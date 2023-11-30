import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import style from './Header.module.scss';

export function Header() {
	const initials_user_name = localStorage.getItem('initials_user_name');
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
			if (response) {
				navigate('/login');
			}
		} catch (error) {
			return;
		}
	};
	return (
		<div className={style.main}>
			<div className={style.header_container}>
				<ul className={style.header_container__content}>
					<li className={style.header_container__content_group}>
						<button className={style.header_container__content_button}>
							<img
								className={style.header_container__content_icon}
								src='/img/person.svg'
								alt='person'
							/>
							<p className={style.header_container__content_text}>
								{initials_user_name}
							</p>
						</button>
					</li>
					<li className={style.header_container__content_group}>
						<button className={style.header_container__content_button}>
							<img
								className={style.header_container__content_icon}
								src='/img/setting.svg'
								alt='setting'
							/>
						</button>
					</li>
					<li className={style.header_container__content_group}>
						<button
							className={style.header_container__content_button}
							onClick={() => logoutSystem()}
						>
							<img
								className={style.header_container__content_icon}
								src='/img/logout.svg'
								alt='logout'
							/>
						</button>
					</li>
				</ul>
			</div>
		</div>
	);
}
