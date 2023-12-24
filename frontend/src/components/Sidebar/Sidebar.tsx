import { useState, useEffect } from 'react';
import axios from 'axios';

import style from './Sidebar.module.scss';

export function Sidebar({ course_id, onClose }) {
	const [courseData, setCourseData] = useState({});
	const [courseDataText, setCourseDataText] = useState({});
	const [courseDataCommand, setCourseDataCommand] = useState([]);
	const [currentNavPage, setCurrentNavPage] = useState('О курсе');
	const [managerName, setManagerName] = useState('');
	const [directorName, setDirectorName] = useState('');
	const [administratorName, setAdministratorName] = useState('');
	const [memberData, setMemberData] = useState({});

	enum DocumentStatus {
		ON_CONFIRMATION = style.approve_confirmation_status,
		ON_MANAGER_APPROVE = style.approve_confirmation_status,
		ON_DIRECTOR_APPROVE = style.approve_confirmation_status,
		ON_ADMIN_APPROVE = style.approve_confirmation_status,
		ON_ADMIN_IMPLEMENTING = style.approve_confirmation_status,
		COMPLETED = style.completed_status,
		REJECTED = style.rejected_status,
	}

	enum DocumentStatusText {
		ON_CONFIRMATION = 'На подтверждении',
		ON_MANAGER_APPROVE = 'На согласовании',
		ON_DIRECTOR_APPROVE = 'На согласовании',
		ON_ADMIN_APPROVE = 'На согласовании',
		ON_ADMIN_IMPLEMENTING = 'Ожидает записи на обучение',
		COMPLETED = 'Записан на обучение',
		REJECTED = 'Отклонено',
	}

	useEffect(() => {
		const getData = async () => {
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
				console.log(response.data, 'response.data');
				setCourseDataText(response.data.course);
				setCourseDataCommand(response.data.commands);
			} catch (error) {}
		};
		getData();
	}, [course_id]);

	const formatterDate = date => {
		const dateComponents = date.split('-');
		const formattedDate = `${dateComponents[2]}.${dateComponents[1]}.${dateComponents[0]}`;
		return formattedDate;
	};

	const buttonCommandClick = async command => {
		try {
			const response = await axios.post(
				`http://localhost:8000/docs/execute?document_id=${course_id}&command=${command}`,
				{},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			window.location.reload();
		} catch (error) {}
	};

	const getStagesResponsibleData = async (
		managerID,
		directorID,
		administratorID
	) => {
		try {
			const responseManager = await axios.get(
				`http://localhost:8000/org/employee/${managerID}`,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			setManagerName(
				`${responseManager.data.surname} ${responseManager.data.name} ${responseManager.data.patronymic}`
			);
			const responseDirector = await axios.get(
				`http://localhost:8000/org/employee/${directorID}`,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			setDirectorName(
				`${responseDirector.data.surname} ${responseDirector.data.name} ${responseDirector.data.patronymic}`
			);
			const responseAdministrator = await axios.get(
				`http://localhost:8000/org/employee/${administratorID}`,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			setAdministratorName(
				`${responseAdministrator.data.surname} ${responseAdministrator.data.name} ${responseAdministrator.data.patronymic}`
			);
		} catch (error) {
			return;
		}
	};

	const getMemberData = async memberID => {
		try {
			const responseMember = await axios.get(
				`http://localhost:8000/org/employee/${memberID}`,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			setMemberData(responseMember.data);
		} catch (error) {
			return;
		}
	};

	console.log(courseDataText, 'courseDataText');
	console.log(courseDataCommand, 'courseDataCommand');
	console.log(courseData, 'courseData');
	console.log(memberData)
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
					<div className={style.sidebar_state_container}>
						<div
							style={{
								display: 'flex',
							}}
						>
							<p className={DocumentStatus[courseData.state]}>
								{DocumentStatusText[courseData.state]}
							</p>
						</div>
					</div>
					{courseDataCommand !== null && (
						<div>
							<ul className={style.sidebar_button_group}>
								{courseDataCommand.map((item, index) => {
									const key = Object.keys(item)[0];
									const value = item[key];
									return (
										<li>
											<button
												key={index}
												onClick={() => buttonCommandClick(key)}
												className={
													key === 'REJECT'
														? style.sidebar_button_reject
														: style.sidebar_button_affirmative
												}
											>
												{value}
											</button>
										</li>
									);
								})}
								{courseData.state === "ON_CONFIRMATION" && (
									<li>
										<button className={style.sidebar_button_more}>
											<img src='/img/edit.svg' alt='edit' />
										</button>
									</li>
								)}
							</ul>
						</div>
					)}
					{/* <div>
						<ul className={style.sidebar_tags_group}>
							<li className={style.sidebar_tags}>{courseDataText.type}</li>
							<li className={style.sidebar_tags}>{courseDataText.category}</li>
						</ul>
					</div> */}
					<div>
						<ul className={style.sidebar_navigate_button_container}>
							<li
								className={
									currentNavPage === 'О курсе'
										? style.sidebar_navigate_button_active
										: style.sidebar_navigate_button
								}
								onClick={() => setCurrentNavPage('О курсе')}
							>
								О курсе
							</li>
							<li
								className={
									currentNavPage === 'Этапы заявки'
										? style.sidebar_navigate_button_active
										: style.sidebar_navigate_button
								}
								onClick={() => {
									setCurrentNavPage('Этапы заявки');
									getStagesResponsibleData(
										courseData.manager_id,
										courseData.director_id,
										courseData.administrator_id
									);
								}}
							>
								Этапы заявки
							</li>
							<li
								className={
									currentNavPage === 'Сотрудники'
										? style.sidebar_navigate_button_active
										: style.sidebar_navigate_button
								}
								onClick={() => {
									setCurrentNavPage('Сотрудники');
									getMemberData(courseData.members_id);
								}}
							>
								Сотрудники
							</li>
						</ul>
					</div>
					{currentNavPage === 'О курсе' && (
						<div>
							<div className={style.sidebar_tags_group}>
								<div className={style.sidebar_type_group}>
									<h2 className={style.sidebar_title_h2}>Тип курса</h2>
									<p className={style.sidebar_type}>{courseDataText.type}</p>
								</div>
								<div className={style.sidebar_category_group}>
									<h2 className={style.sidebar_title_h2}>Категория курса</h2>
									<p className={style.sidebar_category}>
										{courseDataText.category}
									</p>
								</div>
							</div>
							<div className={style.sidebar_description_group}>
								<h2 className={style.sidebar_title_h2}>Описание курса</h2>
								<p className={style.sidebar_description}>
									{courseDataText.description}
								</p>
							</div>
							<div className={style.sidebar_education_center_group}>
								<h2 className={style.sidebar_title_h2}>Центр обучения</h2>
								<p className={style.sidebar_education_center}>
									{courseDataText.education_center}
								</p>
							</div>
							<div className={style.sidebar_cost_group}>
								<h2 className={style.sidebar_title_h2}>Стоимость обучения</h2>
								<p className={style.sidebar_cost}>
									{courseDataText.cost} рублей
								</p>
							</div>
							<div className={style.sidebar_date_group}>
								<h2 className={style.sidebar_title_h2}>
									Желаемые сроки обучения
								</h2>
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
					)}
					{currentNavPage === 'Этапы заявки' && (
						<div className={style.sidebar_stages_section_container}>
							<div>
								<div>
									<img src='/img/stages_figure.svg' alt='stages_figure' />
								</div>
							</div>
							<div>
								<ul className={style.sidebar_stages_info_group}>
									<li>
										<p className={style.sidebar_stages_group_title}>
											Согласование
										</p>
										<div className={style.sidebar_stages_group_text}>
											<p>{managerName}</p>
										</div>
									</li>
									<li>
										<p className={style.sidebar_stages_group_title}>
											Одобрение финансовых затрат
										</p>

										<div className={style.sidebar_stages_group_text}>
											<p>{directorName}</p>
										</div>
									</li>
									<li>
										<p className={style.sidebar_stages_group_title}>
											Обработка
										</p>

										<div className={style.sidebar_stages_group_text}>
											<p>{administratorName}</p>
										</div>
									</li>
								</ul>
							</div>
						</div>
					)}
					{currentNavPage === 'Сотрудники' && (
						<div className={style.sidebar_member_section_container}>
							<ul>
								{/* {memberData.map(data => {
									return (
										<li>
											{data.surname} {data.name} {data.patronymic}
										</li>
									);
								})} */}
								<li className={style.sidebar_member_content_container}>
									<div className={style.sidebar_member_name}>
										{memberData.surname} {memberData.name}{' '}
										{memberData.patronymic}
									</div>
									<div className={style.sidebar_member_description}>
										Описание сотрудника
									</div>
								</li>
							</ul>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
