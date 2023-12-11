// import { useState, useEffect } from 'react';
// import axios from 'axios';

import style from './OrgStructureSidebarUser.module.scss';

export function OrgStructureSidebarUser({ user_ID, onClose, user_data }) {
	// const [userData, setUserData] = useState([{}]);
	// useEffect(() => {
	// 	const getUserData = async () => {
	// 		try {
	// 			const responseData = await axios.post(
	// 				`http://localhost:8000/org/get_child?division_id=${user_ID}`,
	// 				{},
	// 				{
	// 					withCredentials: true,
	// 					headers: {
	// 						'Content-Type': 'application/json',
	// 					},
	// 				}
	// 			);
	// 			setUserData(responseData.data);
	// 		} catch (err) {
	// 			return;
	// 		}
	// 	};
	// 	getUserData();
	// }, [user_ID]);
	return (
		<div className={style.main}>
			<div className={style.sidebar_container}>
				<div className={style.sidebar_content}>
					<div className={style.sidebar_title_group}>
						<h1 className={style.sidebar_title}>
							{user_data.name} {user_data.surname} {user_data.patronymic}
						</h1>
						<button onClick={onClose}>
							<img src='/img/close_button.svg' alt='close_button' />
						</button>
					</div>
					<div className={style.sidebar_description_group}>
						<h2 className={style.sidebar_title_h2}>Email</h2>
						<p className={style.sidebar_description}>{user_data.email} </p>
					</div>
					<div className={style.sidebar_description_group}>
						<h2 className={style.sidebar_title_h2}>Должность</h2>
						<p className={style.sidebar_description}>
							{user_data.staff_unit.name}{' '}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
