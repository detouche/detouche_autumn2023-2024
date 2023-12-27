import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import style from './Drawer.module.scss';

export function Drawer({ ...props }) {
	const [activePageDrawer, setActivePageDrawer] = useState(props.PageID);
	const navigate = useNavigate();
	const handleClickPrimaryButton = (id, path) => {
		setActivePageDrawer(id);
		navigate(path);
	};
	return (
		<div className={style.main}>
			<div className={style.drawer_container}>
				<div className={`${style.drawer_logo}`}>
					<img src='/img/logo_drawer.svg' alt='logo' />
					<h1 className={style.drawer_title}>Etude</h1>
				</div>
				<ul className={style.drawer_icon_list}>
					<li
						id='2'
						onClick={() => handleClickPrimaryButton(2, '/create-application')}
						className={`${style.drawer_icon_list__element} ${
							2 === activePageDrawer ? style.drawer_active_page : ''
						}`}
					>
						<img src='/img/add.svg' alt='add' />
						<p className={style.drawer_icon_list__element_text}>
							Создание заявки
						</p>
					</li>
					<li
						id='3'
						onClick={() => handleClickPrimaryButton(3, '/my-application')}
						className={`${style.drawer_icon_list__element} ${
							3 === activePageDrawer ? style.drawer_active_page : ''
						}`}
					>
						<img src='/img/topic.svg' alt='topic' />
						<p className={style.drawer_icon_list__element_text}> Мои заявки </p>
					</li>
					<li
						id='4'
						onClick={() =>
							handleClickPrimaryButton(4, '/consideration-application')
						}
						className={`${style.drawer_icon_list__element} ${
							4 === activePageDrawer ? style.drawer_active_page : ''
						}`}
					>
						<img src='/img/remove_red_eye.svg' alt='remove_red_eye' />
						<p className={style.drawer_icon_list__element_text}>
							На рассмотрении
						</p>
					</li>
					<li
						id='5'
						onClick={() => handleClickPrimaryButton(5, '/progress-application')}
						className={`${style.drawer_icon_list__element} ${
							5 === activePageDrawer ? style.drawer_active_page : ''
						}`}
					>
						<img src='/img/work.svg' alt='work' />
						<p className={style.drawer_icon_list__element_text}> В работе </p>
					</li>
					{/* <li
						onClick={() => setActivePageDrawer(6)}
						className={`${style.drawer_icon_list__element} ${
							6 === activePageDrawer ? style.drawer_active_page : ''
						}`}
					>
						<img src='/img/history.svg' alt='history' />
						<p className={style.drawer_icon_list__element_text}>
							История заявок
						</p>
					</li> */}
					<li
						id='7'
						onClick={() => handleClickPrimaryButton(7, '/all-application')}
						className={`${style.drawer_icon_list__element} ${
							7 === activePageDrawer ? style.drawer_active_page : ''
						}`}
					>
						<img src='/img/layers.svg' alt='layers' />
						<p className={style.drawer_icon_list__element_text}> Все заявки </p>
					</li>
					{/* <li
						onClick={() => setActivePageDrawer(9)}
						className={`${style.drawer_icon_list__element} ${
							9 === activePageDrawer ? style.drawer_active_page : ''
						}`}
					>
						<img src='/img/badge.svg' alt='badge' />
						<p className={style.drawer_icon_list__element_text}> ВрИО</p>
					</li> */}
				</ul>
			</div>
		</div>
	);
}
