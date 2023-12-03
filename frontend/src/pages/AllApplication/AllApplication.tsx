import { useEffect, useState } from 'react';
import axios from 'axios';

import style from './AllApplication.module.scss';

import { Drawer } from '../../components/Drawer';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';

export function AllApplication() {
	// useEffect(() => {
	// 	axios.get('http://localhost:3000/messages', {
	// 		headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
	// 	})
	// }, [])
	// const { state } = useLocation();
	// const { successfulMailDeliveryText } = state;
	const [coursesData, setCoursesData] = useState([]);
	const [courseID, setCourseID] = useState(0);
	const [showSidebar, setShowSidebar] = useState(false);

	useEffect(() => {
		const getCourseData = async () => {
			try {
				const response = await axios.post(
					`http://localhost:8000/docs/search-document?request=all`, {},
					{
						withCredentials: true,
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				setCoursesData(response.data);
			} catch (error) {
				setCoursesData(null);
			}
		};
		getCourseData();
	}, []);

	const openCourse = course_ID => {
		setCourseID(course_ID);
		setShowSidebar(true);
	};

	return (
		<div className={style.main}>
			<Drawer PageID={7} />
			{showSidebar && (
				<Sidebar course_id={courseID} onClose={() => setShowSidebar(false)} />
			)}
			<Header />
			<div className={style.all_application_container}>
				<h1 className={style.all_application_title}>Все заявки</h1>
				<div className={style.all_application_table_container}>
					<table
						className={style.all_application_table}
						cellPadding={0}
						cellSpacing={0}
					>
						<thead>
							<tr className={style.all_application_table_column}>
								<td
									className={
										style.all_application_table_column_course_title
									}
								>
									<p>Название курса</p>
								</td>
								<td className={style.all_application_table_column_state}>
									<p>Статус</p>
								</td>
								<td
									className={
										style.all_application_table_column_course_type
									}
								>
									<p>Тип курса</p>
								</td>
								<td
									className={
										style.all_application_table_column_course_category
									}
								>
									<p>Направление обучения</p>
								</td>
								<td
									className={
										style.all_application_table_column_course_education_center
									}
								>
									<p>Учебный центр</p>
								</td>
							</tr>
						</thead>
						{coursesData !== null &&
							coursesData.map(data => (
								<tr
									className={style.all_application_table_content}
									onClick={() => openCourse(data.id)}
								>
									<td
										className={
											style.all_application_table_content_course_title
										}
									>
										<p>{data.title}</p>
									</td>
									<td
										className={style.all_application_table_content_state}
									>
										<p>
											<div className={style.status_figure}></div>
											{data.status.text}
										</p>
									</td>
									<td
										className={
											style.all_application_table_content_course_type
										}
									>
										<p>{data.course_type}</p>
									</td>
									<td
										className={
											style.all_application_table_content_course_category
										}
									>
										<p>{data.course_category}</p>
									</td>
									<td
										className={
											style.all_application_table_content_course_education_center
										}
									>
										<p>{data.education_center}</p>
									</td>
								</tr>
							))}
					</table>
					{coursesData === null && (
						<div>
							{/* <div className={style.all_application_loader}>
								<svg
									className={style.spinner}
									width='57px'
									height='57px'
									viewBox='0 0 66 66'
									xmlns='http://www.w3.org/2000/svg'
								>
									<circle
										className={style.path}
										fill='none'
										stroke-width='6'
										stroke-linecap='round'
										cx='33'
										cy='33'
										r='30'
									></circle>
								</svg>
							</div> */}
							<h2 className={style.all_application_title_h2_error}>
								Нет данных
							</h2>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
