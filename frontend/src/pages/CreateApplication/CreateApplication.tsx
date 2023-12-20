import axios from 'axios';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

import style from './CreateApplication.module.scss';
import './react-select.scss';

import { Drawer } from '../../components/Drawer';
import { Header } from '../../components/Header';
import { Button } from '../../components/UI/Button';

export function CreateApplication() {
	// useEffect(() => {
	// 	axios.get('http://localhost:3000/messages', {
	// 		headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
	// 	})
	// }, [])
	// const { state } = useLocation();
	// const { successfulMailDeliveryText } = state;
	const [courseID, setCourseID] = useState(0);
	const [courseCost, setCourseCost] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [courseGoal, setCourseGoal] = useState('');
	const [memberID, setMemberID] = useState(0);
	const [courseData, setCourseData] = useState([]);
	const [adminData, setAdminData] = useState([]);
	const [managerData, setManagerData] = useState([]);
	const [directorData, setDirectorData] = useState([]);
	const [membersOptionsSelect, setMembersOptionsSelect] = useState([]);
	const [coursesOptionsSelect, setCoursesOptionsSelect] = useState([]);
	const [userName, setUserName] = useState({
		id: '',
		title: '',
	});
	const isMulti = true;
	const navigate = useNavigate();

	useEffect(() => {
		const getUserInfo = async () => {
			try {
				const response = await axios.get(`http://localhost:8000/users/me`, {
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				});
				const user_surname = response.data.surname;
				const user_name = response.data.name;
				const user_patronymic = response.data.patronymic;
				const user_full_name = `${user_surname} ${user_name} ${user_patronymic}`;
				const user_id = response.data.id;
				setUserName({ id: user_id, title: user_full_name });
			} catch (error) {
				return;
			}
		};
		getUserInfo();
	}, []);

	useEffect(() => {
		const getMemberOptionsSelect = async () => {
			try {
				const responseData = await axios.get(
					`http://localhost:8000/docs/course-templates`,
					{
						withCredentials: true,
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				responseData.data.push(userName);
				setMembersOptionsSelect(
					responseData.data.map(data => ({
						value: data.id,
						label: data.title,
					}))
				);
			} catch (error) {
				setMembersOptionsSelect([
					{ value: userName.id, label: userName.title },
				]);
			}
			// console.log(responseData);
			// setMembersOptionsSelect(
			// 	responseData.data.map(
			// 		data => ({
			// 			value: data.id,
			// 			label: data.title,
			// 		}),
			// 		responseData.data.push(userName)
			// 	)
			// );
		};
		getMemberOptionsSelect();
	}, [userName]);

	useEffect(() => {
		const getCoursesOptionsSelect = async () => {
			try {
				const responseData = await axios.get(
					`http://localhost:8000/docs/course-template`,
					{
						withCredentials: true,
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				setCoursesOptionsSelect(
					responseData.data.map(data => ({
						value: data.id,
						label: data.title,
					}))
				);
			} catch (error) {
				return;
			}
		};
		getCoursesOptionsSelect();
	}, []);

	const getCourseID = () => {
		return courseID ? coursesOptionsSelect.find(e => e.value === courseID) : '';
	};

	const onChangeSelect = newValue => {
		setCourseID(newValue.value);
	};

	const getMembersID = () => {
		if (memberID) {
			return isMulti
				? membersOptionsSelect.filter(e => memberID.indexOf(e.value) >= 0)
				: membersOptionsSelect.find(e => e.value === memberID);
			// return memberID ? membersOptionsSelect.find(e => e.value === memberID) : '';
		} else {
			return isMulti ? [] : '';
		}
	};

	const onChangeMultiSelect = newValue => {
		setMemberID(isMulti ? newValue.map(e => e.value) : newValue.value);
	};

	useEffect(() => {
		const getCourseData = async () => {
			try {
				const responseData = await axios.get(
					`http://localhost:8000/docs/course-template/${courseID}`,
					{
						withCredentials: true,
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				setCourseData(responseData.data);
			} catch (err) {
				return;
			}
		};
		getCourseData();
	}, [courseID]);

	useEffect(() => {
		const getHeadsData = async () => {
			try {
				const responseData = await axios.get(
					`http://localhost:8000/docs/define-heads/${memberID}`,
					{
						withCredentials: true,
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				setAdminData(responseData.data.admin);
				setManagerData(responseData.data.manager);
				setDirectorData(responseData.data.director);
			} catch (err) {
				return;
			}
		};
		getHeadsData();
	}, [memberID]);

	const create_application = async e => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`http://localhost:8000/docs/course-application/create`,
				{
					manager_id: managerData.id,
					director_id: directorData.id,
					administrator_id: adminData.id,
					autor_id: userName.id,
					members_id: memberID,
					course: {
						title: courseData.title,
						description: courseData.description,
						cost: courseCost,
						start_date: startDate,
						end_date: endDate,
						goal: courseGoal,
						type: courseData.type,
						category: courseData.category,
						education_center: courseData.education_center,
					},
				},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			navigate('/my-application');
		} catch (error) {
			return;
		}
	};

	const isFormValid = () => {
		return (
			courseGoal.trim() !== '' &&
			startDate.trim() !== '' &&
			endDate.trim() !== '' &&
			courseCost.trim() !== '' &&
			courseID !== 0 &&
			memberID !== 0
		);
	};

	return (
		<div>
			<Drawer PageID={2} />
			<Header />
			<div className={style.create_application_container}>
				<h1 className={style.create_application_title}>
					Создание новой заявки
				</h1>
				<div className={style.create_application_section}>
					<form
						className={style.create_application_first_section}
						onSubmit={e => create_application(e)}
					>
						<div>
							<div className={style.create_application_course_select_group}>
								<label className={style.create_application_course_select_label}>
									Курс
									<div
										className={
											courseID === 0
												? style.attention_figure
												: style.attention_figure_none
										}
									></div>
								</label>
								<div
									className={style.create_application_course_select_container}
								>
									<Select
										classNamePrefix='custom-select'
										options={coursesOptionsSelect}
										placeholder='Выберите курс'
										className={style.create_application_course_select}
										onChange={onChangeSelect}
										value={getCourseID()}
									/>
								</div>
								{/* <div>{courseID ? coursesOptionsSelect.find(c => c.value === courseID).label : ''}</div> */}
							</div>
							<div className={style.create_application_date_container}>
								<label className={style.create_application_date_label}>
									Желаемые сроки обучения
									<div
										className={
											startDate === '' || endDate === ''
												? style.attention_figure
												: style.attention_figure_none
										}
									></div>
								</label>
								<div className={style.create_application_date_group}>
									<div className={style.create_application_date_start_group}>
										<label
											className={style.create_application_date_start_label}
										>
											Начальная дата
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
										<label className={style.create_application_date_end_label}>
											Конечная дата
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
							<div className={style.create_application_member_group}>
								<label className={style.create_application_member_label}>
									Сотрудники
									<div
										className={
											memberID === 0
												? style.attention_figure
												: style.attention_figure_none
										}
									></div>
								</label>
								<div
									className={style.create_application_member_select_container}
								>
									<Select
										classNamePrefix='custom-select'
										options={membersOptionsSelect}
										className={style.create_application_course_select}
										isMulti
										placeholder='Выберите сотрудников'
										onChange={onChangeMultiSelect}
										value={getMembersID()}
									/>
								</div>
							</div>
							<div className={style.create_application_price_container}>
								<label className={style.create_application_price_label}>
									Стоимость курса
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
									placeholder='Введите стоимость курса'
									className={style.create_application_price_input}
									value={courseCost}
									onChange={e => setCourseCost(e.target.value)}
								/>
							</div>
							<div
								className={style.create_application_object_teaching_container}
							>
								<label
									className={style.create_application_object_teaching_label}
								>
									Цель обучения
									<div
										className={
											courseGoal === ''
												? style.attention_figure
												: style.attention_figure_none
										}
									></div>
								</label>
								<input
									type='text'
									placeholder='Введите цель обучения'
									className={style.create_application_object_teaching_input}
									value={courseGoal}
									onChange={e => setCourseGoal(e.target.value)}
								/>
							</div>
						</div>
						<div className={style.create_application_button_container}>
							<Button disabled={!isFormValid()}>Создать заявку</Button>
						</div>
					</form>
					<div className={style.create_application_second_section}>
						<div>
							<h2 className={style.create_application_title_h2}>
								Информация о курсе
							</h2>
							{courseData.length === 0 ? (
								<h2 className={style.create_application_title_h2_error}>
									Нет данных
								</h2>
							) : (
								<div>
									<div>
										<ul className={style.create_application_tags_group}>
											<li className={style.create_application_tags}>
												{courseData.type}
											</li>
											<li className={style.create_application_tags}>
												{courseData.category}
											</li>
										</ul>
										<div
											className={style.create_application_course_description}
										>
											<div
												className={
													style.create_application_course_description_title_group
												}
											>
												<p
													className={
														style.create_application_course_description_title
													}
												>
													Описание курса
												</p>
												<button>
													<img src='/img/edit.svg' alt='edit' />
												</button>
											</div>
											<div
												className={
													style.create_application_course_description_text
												}
											>
												<p>{courseData.description}</p>
											</div>
										</div>
										<ul className={style.create_application_course_info}>
											<li
												className={style.create_application_course_info_price}
											>
												<div
													className={
														style.create_application_course_info_price_group
													}
												>
													<p
														className={
															style.create_application_course_info_price_group_title
														}
													>
														Стоимость курса
													</p>
													<button>
														<img src='/img/edit.svg' alt='edit' />
													</button>
												</div>
												<div
													className={
														style.create_application_course_info_price_text
													}
												>
													<p>Не указана</p>
												</div>
											</li>
											<li
												className={
													style.create_application_course_info_training_center
												}
											>
												<div
													className={
														style.create_application_course_info_training_center_group
													}
												>
													<p
														className={
															style.create_application_course_info_training_center_group_title
														}
													>
														Учебный центр
													</p>
													<button>
														<img src='/img/edit.svg' alt='edit' />
													</button>
												</div>
												<div
													className={
														style.create_application_course_info_training_center_text
													}
												>
													<p>{courseData.education_center}</p>
												</div>
											</li>
										</ul>
									</div>
								</div>
							)}
							<div className={style.create_application_stages_section}>
								<h2 className={style.create_application_title_h2}>
									Этапы заявки
								</h2>
								<div>
									<div className={style.create_application_stages_figure}>
										<img src='/img/stages_figure.svg' alt='stages_figure' />
									</div>
									<ul className={style.create_application_stages_info_group}>
										<li>
											<div
												className={style.create_application_stages_agreed_group}
											>
												<p
													className={
														style.create_application_stages_agreed_group_title
													}
												>
													Согласование
												</p>
												<button>
													<img src='/img/edit.svg' alt='edit' />
												</button>
											</div>
											<div
												className={style.create_application_stages_agreed_text}
											>
												<p>
													{managerData.length === 0
														? 'Нет данных'
														: `${
																managerData.surname +
																' ' +
																managerData.name +
																' ' +
																managerData.patronymic
														  }`}
												</p>
											</div>
										</li>
										<li>
											<div
												className={
													style.create_application_stages_finance_group
												}
											>
												<p
													className={
														style.create_application_stages_finance_group_title
													}
												>
													Одобрение финансовых затрат
												</p>
												<button>
													<img src='/img/edit.svg' alt='edit' />
												</button>
											</div>
											<div
												className={style.create_application_stages_finance_text}
											>
												<p>
													{directorData.length === 0
														? 'Нет данных'
														: `${
																directorData.surname +
																' ' +
																directorData.name +
																' ' +
																directorData.patronymic
														  }`}
												</p>
											</div>
										</li>
										<li>
											<div
												className={
													style.create_application_stages_processing_group
												}
											>
												<p
													className={
														style.create_application_stages_processing_group_title
													}
												>
													Обработка
												</p>
												<button>
													<img src='/img/edit.svg' alt='edit' />
												</button>
											</div>
											<div
												className={
													style.create_application_stages_processing_text
												}
											>
												<p>
													{adminData.length === 0
														? 'Нет данных'
														: `${
																adminData.surname +
																' ' +
																adminData.name +
																' ' +
																adminData.patronymic
														  }`}
												</p>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
