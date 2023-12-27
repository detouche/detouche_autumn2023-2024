import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

import style from './Sidebar.module.scss';

import { ConfirmationWindow } from '../ConfirmationWindow';

export function Sidebar({ course_id, onClose }) {
	const [courseData, setCourseData] = useState({});
	const [courseDataText, setCourseDataText] = useState({});
	const [courseDataCommand, setCourseDataCommand] = useState([]);
	const [currentNavPage, setCurrentNavPage] = useState('О курсе');
	const [managerName, setManagerName] = useState('');
	const [directorName, setDirectorName] = useState('');
	const [administratorName, setAdministratorName] = useState('');
	const [memberData, setMemberData] = useState({});
	const [editingCourseDate, setEditingCourseDate] = useState(false);
	/////
	const [showConfirmationEditingWindow, setShowConfirmationEditingWindow] =
		useState(false);
	const [confirmationEditing, setConfirmationEditing] = useState();

	const [educationCenter, setEducationCenter] = useState('');
	const [courseCost, setCourseCost] = useState('');
	const [courseGoal, setCourseGoal] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [categoryDate, setCategoryDate] = useState({});
	const [courseDescription, setCourseDescription] = useState('');
	const [courseTitle, setCourseTitle] = useState('');

	///////////////

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
		setEditingCourseDate(false);
	}, [course_id]);
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
				setCourseDataText(response.data.course);
				setCourseDataCommand(response.data.commands);
				setEducationCenter(response.data.course.education_center);
				setCourseCost(response.data.course.cost);
				setCourseGoal(response.data.course.goal);
				setStartDate(response.data.course.start_date.split('T')[0]);
				setEndDate(response.data.course.end_date.split('T')[0]);
				// setCategoryDate(response.data.course.);
				setCourseDescription(response.data.course.description);
				setCourseTitle(response.data.course.title);
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

	useEffect(() => {
		if (confirmationEditing) {
			updateCourseData();
		} else if (confirmationEditing === false) {
			setShowConfirmationEditingWindow(false);
		}
	}, [confirmationEditing]);

	const updateCourseData = async () => {
		try {
			const responseData = await axios.post(
				`http://localhost:8000/docs/course-application/update?application_id=${courseData.id}`,
				{
					manager_id: courseData.manager_id,
					director_id: courseData.director_id,
					administrator_id: courseData.administrator_id,
					members_id: courseData.members_id,
					title: courseTitle,
					description: courseDescription,
					cost: courseCost,
					start_date: new Date(startDate),
					end_date: new Date(endDate),
					goal: courseGoal,
					type: courseData.course.type,
					category: courseData.course.category,
					education_center: educationCenter,
				},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			window.location.reload();
		} catch (err) {
			return;
		}
	};
	//////////
	const getCategory = () => {
		return categoryDate.id
			? categoryOptionsSelect.find(e => e.value === categoryDate.id)
			: '';
	};
	const categoryOptionsSelect = [
		{ value: 'Soft skills', label: 'Soft skills' },
		{ value: 'Hard skills', label: 'Hard skills' },
	];
	const onChangeCategorySelect = newValue => {
		setCategoryDate(prevUserData => ({
			...prevUserData,
			id: newValue.value,
		}));
	};
	const [typeDate, setTypeDate] = useState({});
	const typeOptionsSelect = [
		{ value: 'Очный', label: 'Очный' },
		{ value: 'Онлайн', label: 'Онлайн' },
		{ value: 'Смешанный', label: 'Смешанный' },
	];

	const onChangeTypeSelect = newValue => {
		setTypeDate(prevUserData => ({
			...prevUserData,
			id: newValue.value,
		}));
	};

	const getType = () => {
		return typeDate.id
			? typeOptionsSelect.find(e => e.value === typeDate.id)
			: '';
	};

	const objectTeachingInputAutoResize = event => {
		event.target.style.height = 'auto';
		event.target.style.height = `${event.target.scrollHeight}px`;
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
					{courseDataCommand !== null && editingCourseDate === false && (
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
								{/* {courseData.state === 'ON_CONFIRMATION' &&
									editingCourseDate === false && (
										<li>
											<button
												className={style.sidebar_button_more}
												onClick={() => setEditingCourseDate(true)}
											>
												<img src='/img/edit.svg' alt='edit' />
											</button>
										</li>
									)} */}
							</ul>
						</div>
					)}
					{courseDataCommand !== null &&
						editingCourseDate === true &&
						courseData.state === 'ON_CONFIRMATION' && (
							<div>
								<ul className={style.sidebar_button_group}>
									<li>
										<button
											className={style.sidebar_button_save}
											// disabled={!isValid()}
											onClick={() => setShowConfirmationEditingWindow(true)}
										>
											Сохранить
										</button>
									</li>
									<li>
										<button
											className={style.sidebar_button_cancel}
											onClick={() => setEditingCourseDate(false)}
										>
											Отменить
										</button>
									</li>
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
							{editingCourseDate && (
								<div
									className={
										style.create_application_course_info_training_center
									}
								>
									<label className={style.create_application_description_label}>
										Название курса
										<div
											className={
												courseTitle === ''
													? style.attention_figure
													: style.attention_figure_none
											}
										></div>
									</label>
									<div
										className={
											style.create_application_education_center_input_container
										}
									>
										<input
											type='text'
											placeholder='Введите название курса'
											className={style.create_application_course_info_input}
											value={courseTitle}
											onChange={e => setCourseTitle(e.target.value)}
										/>
									</div>
								</div>
							)}
							{editingCourseDate ? (
								// <ul className={style.create_application_course_info}>
								// 	<li className={style.create_application_course_info_type}>
								// 		<div>
								// 			<label
								// 				className={style.create_application_description_label}
								// 			>
								// 				Тип курса
								// 			</label>
								// 			<div
								// 				className={
								// 					style.create_application_course_type_selector_container
								// 				}
								// 			>
								// 				<Select
								// 					classNamePrefix='custom-select'
								// 					options={typeOptionsSelect}
								// 					placeholder='Выберите тип курса'
								// 					onChange={onChangeTypeSelect}
								// 					value={getType()}
								// 				/>
								// 			</div>
								// 		</div>
								// 	</li>
								// 	<li className={style.create_application_course_info_category}>
								// 		<div>
								// 			<label
								// 				className={style.create_application_description_label}
								// 			>
								// 				Категория курса
								// 			</label>
								// 			<div
								// 				className={
								// 					style.create_application_course_category_selector_container
								// 				}
								// 			>
								// 				<Select
								// 					classNamePrefix='custom-select'
								// 					options={categoryOptionsSelect}
								// 					placeholder='Выберите категорию'
								// 					onChange={onChangeCategorySelect}
								// 					value={getCategory()}
								// 				/>
								// 			</div>
								// 		</div>
								// 	</li>
								// </ul>
								<div></div>
							) : (
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
							)}
							{editingCourseDate ? (
								<div
									className={style.create_application_object_teaching_container}
								>
									<label className={style.create_application_description_label}>
										Описание курса
										<div
											className={
												courseDescription === ''
													? style.attention_figure
													: style.attention_figure_none
											}
										></div>
									</label>
									<div
										className={
											style.create_application_description_input_container
										}
									>
										<textarea
											placeholder='Введите описание курса'
											className={style.create_application_course_info_input}
											value={courseDescription}
											onChange={e => setCourseDescription(e.target.value)}
											onInput={objectTeachingInputAutoResize}
										></textarea>
									</div>
								</div>
							) : (
								<div className={style.sidebar_description_group}>
									<h2 className={style.sidebar_title_h2}>Описание курса</h2>
									<p className={style.sidebar_description}>
										{courseDataText.description}
									</p>
								</div>
							)}
							{editingCourseDate ? (
								<div
									className={
										style.create_application_course_info_training_center
									}
								>
									<label className={style.create_application_description_label}>
										Центр обучения
										<div
											className={
												educationCenter === ''
													? style.attention_figure
													: style.attention_figure_none
											}
										></div>
									</label>
									<div
										className={
											style.create_application_education_center_input_container
										}
									>
										<input
											type='text'
											placeholder='Введите центр обучения'
											className={style.create_application_course_info_input}
											value={educationCenter}
											onChange={e => setEducationCenter(e.target.value)}
										/>
									</div>
								</div>
							) : (
								<div className={style.sidebar_education_center_group}>
									<h2 className={style.sidebar_title_h2}>Центр обучения</h2>
									<p className={style.sidebar_education_center}>
										{courseDataText.education_center}
									</p>
								</div>
							)}
							{editingCourseDate ? (
								<div className={style.create_application_price_container}>
									<label className={style.create_application_description_label}>
										Стоимость обучения
										<div
											className={
												courseCost === ''
													? style.attention_figure
													: style.attention_figure_none
											}
										></div>
									</label>
									<input
										type='text'
										placeholder='Введите стоимость обучения'
										className={style.create_application_course_info_input}
										value={courseCost}
										onChange={e => setCourseCost(e.target.value)}
									/>
								</div>
							) : (
								<div className={style.sidebar_cost_group}>
									<h2 className={style.sidebar_title_h2}>Стоимость обучения</h2>
									<p className={style.sidebar_cost}>
										{courseDataText.cost} рублей
									</p>
								</div>
							)}
							{editingCourseDate ? (
								<div className={style.create_application_date_container}>
									<div className={style.create_application_date_group}>
										<div className={style.create_application_date_start_group}>
											<label
												className={style.create_application_description_label}
											>
												Дата начала обучения
												<div
													className={
														startDate === ''
															? style.attention_figure
															: style.attention_figure_none
													}
												></div>
											</label>
											<div
												className={
													style.create_application_date_start_input_container
												}
											>
												<input
													type='date'
													className={style.create_application_date_start_input}
													value={startDate}
													onChange={e => setStartDate(e.target.value)}
												/>
											</div>
										</div>
										<div className={style.create_application_date_line}>
											<img src='/img/date_line.svg' alt='date_line' />
										</div>
										<div className={style.create_application_date_end_group}>
											<label
												className={style.create_application_description_label}
											>
												Дата конца обучения
												<div
													className={
														endDate === ''
															? style.attention_figure
															: style.attention_figure_none
													}
												></div>
											</label>
											<div
												className={
													style.create_application_date_end_input_container
												}
											>
												<input
													type='date'
													className={style.create_application_date_end_input}
													value={endDate}
													onChange={e => setEndDate(e.target.value)}
												/>
											</div>
										</div>
									</div>
								</div>
							) : (
								<div className={style.sidebar_date_group}>
									<h2 className={style.sidebar_title_h2}>
										Желаемые сроки обучения
									</h2>
									<p className={style.sidebar_date}>
										{formatterDate(`${courseDataText.start_date}`)} –{' '}
										{formatterDate(`${courseDataText.end_date}`)}
									</p>
								</div>
							)}

							{editingCourseDate ? (
								<div
									className={style.create_application_object_teaching_container}
								>
									<label className={style.create_application_description_label}>
										Цель обучения
										<div
											className={
												courseGoal === ''
													? style.attention_figure
													: style.attention_figure_none
											}
										></div>
									</label>
									<div
										className={
											style.create_application_description_input_container
										}
									>
										<textarea
											placeholder='Введите цель обучения'
											value={courseGoal}
											onChange={e => setCourseGoal(e.target.value)}
											onInput={objectTeachingInputAutoResize}
											className={style.create_application_course_info_input}
										></textarea>
									</div>
								</div>
							) : (
								<div className={style.sidebar_goal_group}>
									<h2 className={style.sidebar_title_h2}>Цель обучения</h2>
									<p className={style.sidebar_goal}>{courseDataText.goal}</p>
								</div>
							)}
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
			{showConfirmationEditingWindow && (
				<ConfirmationWindow
					setConfirmation={setConfirmationEditing}
					setShowConfirmationWindow={setShowConfirmationEditingWindow}
				/>
			)}
		</div>
	);
}
