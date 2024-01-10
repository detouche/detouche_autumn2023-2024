import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import style from './Header.module.scss';

export function Header({ ...props }) {
	const initials_user_name = localStorage.getItem('initials_user_name');
	const [activePageHeader, setActivePageHeader] = useState(props.PageID);

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
			navigate('/login');
		}
	};

	const handleClickPrimaryButton = (id, path) => {
		setActivePageHeader(id);
		navigate(path);
	};

	return (
		<div className={style.main}>
			<div className={style.header_container}>
				<ul className={style.header_container__content}>
					<li className={style.header_container__content_group}>
						<button
							onClick={() =>
								handleClickPrimaryButton(1, '/organization-structure')
							}
							id='1'
							className={`${style.header_container__content_button} ${
								1 === activePageHeader ? style.header_active_page : ''
							}`}
						>
							<img
								className={style.header_container__content_icon}
								alt='person'
								src='/img/workspaces_filled.svg'
							/>
							<p className={style.header_container__content_text}>
								Структура организации
							</p>
						</button>
					</li>
					<li className={style.header_container__content_group}>
						<button
							onClick={() => handleClickPrimaryButton(2, '/calendar')}
							id='2'
							className={`${style.header_container__content_button} ${
								2 === activePageHeader ? style.header_active_page : ''
							}`}
						>
							<img
								className={style.header_container__content_icon}
								src='/img/calendar_today.svg'
								alt='calendar'
							/>
							<p className={style.header_container__content_text}>Календарь</p>
						</button>
					</li>

					<li className={style.header_container__content_group}>
						<button
							onClick={() => handleClickPrimaryButton(3, '/administration')}
							id='3'
							className={`${style.header_container__content_button} ${
								3 === activePageHeader ? style.header_active_page : ''
							}`}
						>
							<img
								className={style.header_container__content_icon}
								src='/img/administration.svg'
								alt='administration'
							/>
							<p className={style.header_container__content_text}>
								Администрирование
							</p>
						</button>
					</li>

					<li className={style.header_container__content_group}>
						<button
							onClick={() => handleClickPrimaryButton(4, '/account')}
							id='4'
							className={`${style.header_container__content_button} ${
								4 === activePageHeader ? style.header_active_page : ''
							}`}
						>
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
