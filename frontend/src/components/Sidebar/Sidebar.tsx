import { useState, useEffect } from 'react';
import axios from 'axios';

import style from './Sidebar.module.scss';

export function Sidebar({ course_id, onClose }) {
	const [courseData, setCourseData] = useState({});
	const [courseDataText, setCourseDataText] = useState({});
	useEffect(() => {
		const ge = async () => {
			try {
				const response = await axios.get(
					`http://localhost:8000/docs/course-application/${course_id}`,
					{
						withCredentials: true,
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				setCourseData(response.data);
				setCourseDataText(response.data.course);
			} catch (error) {
				return;
			}
		};
		ge();
	}, [course_id]);

	const formatterDate = date => {
		const dateComponents = date.split('-');
		const formattedDate = `${dateComponents[2]}.${dateComponents[1]}.${dateComponents[0]}`;
		console.log(formattedDate);
		return formattedDate;
	};

	return (
		<div className={style.main}>
			<div className={style.sidebar_container}>
				<div className={style.sidebar_content}>
					<div className={style.sidebar_title_group}>
						<h1 className={style.sidebar_title}>{courseDataText.title}</h1>
						<button onClick={onClose}>
							<img src='/img/close_button.svg' alt='close_button' />
						</button>
					</div>
					<div className={style.sidebar_button_group}>
						<ul className={style.sidebar_button_group}>
							<li>
								<button className={style.sidebar_button}>Действие 1</button>
							</li>
							<li>
								<button className={style.sidebar_button}>Действие 2</button>
							</li>
							<li>
								<button className={style.sidebar_button_more}>
									<img src='/img/more_horiz.svg' alt='more_horiz' />
								</button>
							</li>
						</ul>
					</div>
					<div>
						<ul className={style.sidebar_tags_group}>
							<li className={style.sidebar_tags}>{courseDataText.type}</li>
							<li className={style.sidebar_tags}>{courseDataText.category}</li>
						</ul>
					</div>
					<div className={style.sidebar_description_group}>
						<h2 className={style.sidebar_title_h2}>Описание курса</h2>
						<p className={style.sidebar_description}>
							{courseDataText.description}
						</p>
					</div>
					<div className={style.sidebar_education_center_group}>
						<h2 className={style.sidebar_title_h2}>Учебный центр</h2>
						<p className={style.sidebar_education_center}>
							{courseDataText.education_center}
						</p>
					</div>
					<div className={style.sidebar_cost_group}>
						<h2 className={style.sidebar_title_h2}>Стоимость обучения</h2>
						<p className={style.sidebar_cost}>{courseDataText.cost} рублей</p>
					</div>
					<div className={style.sidebar_date_group}>
						<h2 className={style.sidebar_title_h2}>Желаемые сроки обучения</h2>
						<p className={style.sidebar_date}>
							{formatterDate(`${courseDataText.start_date}`)} –{' '}
							{formatterDate(`${courseDataText.end_date}`)}
						</p>
					</div>
					<div className={style.sidebar_goal_group}>
						<h2 className={style.sidebar_title_h2}>Цель обучения</h2>
						<p className={style.sidebar_goal}>{courseDataText.goal}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
