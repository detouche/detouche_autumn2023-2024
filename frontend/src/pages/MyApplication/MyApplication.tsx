import { useEffect, useState } from 'react';
import axios from 'axios';

import style from './MyApplication.module.scss';

import { Drawer } from '../../components/Drawer';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';

export function MyApplication() {
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
					`http://localhost:8000/docs/search-document?request=my`, {},
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
			<Drawer PageID={3} />
			{showSidebar && (
				<Sidebar course_id={courseID} onClose={() => setShowSidebar(false)} />
			)}
			<Header />

			<div className={style.my_application_container}>
				<h1 className={style.my_application_title}>Мои заявки</h1>
				<div className={style.my_application_table_container}>
					<table
						className={style.my_application_table}
						cellPadding={0}
						cellSpacing={0}
					>
						<thead>
							<tr className={style.my_application_table_column}>
								<td className={style.my_application_table_column_course_title}>
									<p>Название курса</p>
								</td>
								<td className={style.my_application_table_column_state}>
									<p>Статус</p>
								</td>
								<td className={style.my_application_table_column_course_type}>
									<p>Тип курса</p>
								</td>
								<td
									className={style.my_application_table_column_course_category}
								>
									<p>Направление обучения</p>
								</td>
								<td
									className={
										style.my_application_table_column_course_education_center
									}
								>
									<p>Учебный центр</p>
								</td>
							</tr>
						</thead>
						{coursesData !== null &&
							coursesData.map(data => (
								<tr
									className={style.my_application_table_content}
									onClick={() => openCourse(data.id)}
								>
									<td
										className={style.my_application_table_content_course_title}
									>
										<p>{data.title}</p>
									</td>
									<td className={style.my_application_table_content_state}>
										<p>
											<div className={style.status_figure}></div>
											{data.status.text}
										</p>
									</td>
									<td
										className={style.my_application_table_content_course_type}
									>
										<p>{data.course_type}</p>
									</td>
									<td
										className={
											style.my_application_table_content_course_category
										}
									>
										<p>{data.course_category}</p>
									</td>
									<td
										className={
											style.my_application_table_content_course_education_center
										}
									>
										<p>{data.education_center}</p>
									</td>
								</tr>
							))}
					</table>
					{coursesData === null && (
						<div>
							<h2 className={style.my_application_title_h2_error}>
								Нет данных
							</h2>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
