import { useEffect, useState } from 'react';
import axios from 'axios';

import style from './ProgressApplication.module.scss';

import { Drawer } from '../../components/Drawer';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';

export function ProgressApplication() {
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

	enum DocumentStatus {
		ON_CONFIRMATION = style.approve_confirmation_status,
		ON_MANAGER_APPROVE = style.approve_confirmation_status,
		ON_DIRECTOR_APPROVE = style.approve_confirmation_status,
		ON_ADMIN_APPROVE = style.approve_confirmation_status,
		ON_ADMIN_IMPLEMENTING = style.approve_confirmation_status,
		COMPLETED = style.completed_status,
		REJECTED = style.rejected_status,
	}

	useEffect(() => {
		const getCourseData = async () => {
			try {
				const response = await axios.post(
					`http://localhost:8000/docs/search-document?request=in_work`,
					{},
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
			<Drawer PageID={5} />
			{showSidebar && (
				<Sidebar course_id={courseID} onClose={() => setShowSidebar(false)} />
			)}
			<Header />
			<div className={style.progress_application_container}>
				<h1 className={style.progress_application_title}>В работе</h1>
				<div className={style.progress_application_table_container}>
					<table
						className={style.progress_application_table}
						cellPadding={0}
						cellSpacing={0}
					>
						<thead>
							<tr className={style.progress_application_table_column}>
								<td
									className={
										style.progress_application_table_column_course_title
									}
								>
									<p>Название курса</p>
								</td>
								<td className={style.progress_application_table_column_state}>
									<p>Статус</p>
								</td>
								<td
									className={
										style.progress_application_table_column_course_type
									}
								>
									<p>Тип курса</p>
								</td>
								<td
									className={
										style.progress_application_table_column_course_category
									}
								>
									<p>Направление обучения</p>
								</td>
								<td
									className={
										style.progress_application_table_column_course_education_center
									}
								>
									<p>Учебный центр</p>
								</td>
								<td
									className={
										style.progress_application_table_column_course_creation_date
									}
								>
									<p>Дата создания</p>
								</td>
								<td
									className={
										style.progress_application_table_column_course_author
									}
								>
									<p>Автор документа</p>
								</td>
							</tr>
						</thead>
						{coursesData !== null &&
							coursesData.map(data => (
								<tr
									className={style.progress_application_table_content}
									onClick={() => openCourse(data.id)}
								>
									<td
										className={
											style.progress_application_table_content_course_title
										}
									>
										<p>{data.title}</p>
									</td>
									<td
										className={style.progress_application_table_content_state}
									>
										<div
											style={{
												display: 'flex',
											}}
										>
											<p className={DocumentStatus[data.status.type]}>
												{data.status.text}
											</p>
										</div>
									</td>
									<td
										className={
											style.progress_application_table_content_course_type
										}
									>
										<p>{data.course_type}</p>
									</td>
									<td
										className={
											style.progress_application_table_content_course_category
										}
									>
										<p>{data.course_category}</p>
									</td>
									<td
										className={
											style.progress_application_table_content_course_education_center
										}
									>
										<p>{data.education_center}</p>
									</td>
									<td
										className={
											style.progress_application_table_content_course_creation_date
										}
									>
										<p>{`${new Date(data.creation_date).getUTCDate()}.${
											new Date(data.creation_date).getUTCMonth() + 1
										}.${new Date(data.creation_date).getUTCFullYear()}`}</p>
									</td>
									<td
										className={
											style.progress_application_table_content_course_author
										}
									>
										<p>{data.author}</p>
									</td>
								</tr>
							))}
					</table>
					{coursesData === null && (
						<div>
							{/* <div className={style.progress_application_loader}>
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
							<h2 className={style.progress_application_title_h2_error}>
								Нет данных
							</h2>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
