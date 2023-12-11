import { useState, useEffect } from 'react';
import axios from 'axios';

import style from './OrgStructureSidebarChildren.module.scss';

export function OrgStructureSidebarChildren({ children_ID, onClose }) {
	const [childrenData, setChildrenData] = useState([{}]);
	useEffect(() => {
		const getChildrenData = async () => {
			try {
				const responseData = await axios.post(
					`http://localhost:8000/org/get_child?division_id=${children_ID}`,
					{},
					{
						withCredentials: true,
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				setChildrenData(responseData.data);
			} catch (err) {
				return;
			}
		};
		getChildrenData();
	}, [children_ID]);

	return (
		<div className={style.main}>
			<div className={style.sidebar_container}>
				<div className={style.sidebar_content}>
					<div className={style.sidebar_title_group}>
						<h1 className={style.sidebar_title}>{childrenData.name} </h1>
						<button onClick={onClose}>
							<img src='/img/close_button.svg' alt='close_button' />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
