import axios from 'axios';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

import style from './CreateApplication.module.scss';
import './react-select.scss';

import { Drawer } from '../../components/Drawer';
import { Header } from '../../components/Header';
import { Button } from '../../components/UI/Button';
import { useDebounce } from '../../hooks/UseDebounce';

export function CreateApplication() {
	const [courseID, setCourseID] = useState(0);
	const [courseCost, setCourseCost] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [courseGoal, setCourseGoal] = useState('');
	const [memberID, setMemberID] = useState(0);
	const [courseData, setCourseData] = useState([]);
	const [membersOptionsSelect, setMembersOptionsSelect] = useState([]);
	const [coursesOptionsSelect, setCoursesOptionsSelect] = useState([]);
	const [userName, setUserName] = useState({
		id: '',
		title: '',
	});
	const isMulti = true;
	const navigate = useNavigate();
	const [memberAdminOptions, setMemberAdminOptions] = useState([]);
	const [memberAdminInputValue, setMemberAdminInputValue] = useState('');
	const [memberAdminSelectedValue, setMemberAdminSelectedValue] =
		useState(null);
	const [memberManagerOptions, setMemberManagerOptions] = useState([]);
	const [memberManagerInputValue, setMemberManagerInputValue] = useState('');
	const [memberManagerSelectedValue, setMemberManagerSelectedValue] =
		useState(null);
	const [memberDirectorOptions, setMemberDirectorOptions] = useState([]);
	const [memberDirectorInputValue, setMemberDirectorInputValue] = useState('');
	const [memberDirectorSelectedValue, setMemberDirectorSelectedValue] =
		useState(null);
	const [courseName, setCourseName] = useState('');
	const [courseDescription, setCourseDescription] = useState('');
	const [educationCenter, setEducationCenter] = useState('');

	const [typeDate, setTypeDate] = useState({});
	const [categoryDate, setCategoryDate] = useState({});

	const debouncedMemberAdminInputValue = useDebounce(
		memberAdminInputValue,
		100
	);

	const searchAdminData = async userEmployeeInputValue => {
		try {
			const response = await axios.get(
				`http://localhost:8000/org/employee-search?term=${userEmployeeInputValue}&limit=5&option=ADMIN`
			);
			const responseData = response.data;
			const transformedResponseData = responseData.map(item => ({
				value: item.id,
				label: `${item.surname} ${item.name} ${item.patronymic}`,
			}));

			setMemberAdminOptions(transformedResponseData);
		} catch (error) {
			return;
		}
	};

	useEffect(() => {
		if (debouncedMemberAdminInputValue) {
			searchAdminData(debouncedMemberAdminInputValue);
		} else {
			setMemberAdminOptions([]);
		}
	}, [debouncedMemberAdminInputValue]);

	const handleMemberAdminInputChange = newValue => {
		setMemberAdminInputValue(newValue);
	};

	const handleMemberAdminSelectChange = selectedOption => {
		setMemberAdminSelectedValue(selectedOption);
		// setEditingUserStaffUnitSelectedValue(null);
	};

	const debouncedMemberManagerInputValue = useDebounce(
		memberManagerInputValue,
		100
	);

	const searchManagerData = async userEmployeeInputValue => {
		try {
			const response = await axios.get(
				`http://localhost:8000/org/employee-search?term=${userEmployeeInputValue}&limit=5&option=HEAD_EMPLOYEE&member_id=${memberID}`
			);
			const responseData = response.data;
			const transformedResponseData = responseData.map(item => ({
				value: item.id,
				label: `${item.surname} ${item.name} ${item.patronymic}`,
			}));

			setMemberManagerOptions(transformedResponseData);
		} catch (error) {
			return;
		}
	};

	useEffect(() => {
		if (debouncedMemberManagerInputValue) {
			searchManagerData(debouncedMemberManagerInputValue);
		} else {
			setMemberManagerOptions([]);
		}
	}, [debouncedMemberManagerInputValue]);

	const handleMemberManagerInputChange = newValue => {
		setMemberManagerInputValue(newValue);
	};

	const handleMemberManagerSelectChange = selectedOption => {
		setMemberManagerSelectedValue(selectedOption);
		// setEditingUserStaffUnitSelectedValue(null);
	};

	const debouncedMemberDirectorInputValue = useDebounce(
		memberDirectorInputValue,
		100
	);

	const searchDirectorData = async userEmployeeInputValue => {
		try {
			const response = await axios.get(
				`http://localhost:8000/org/employee-search?term=${userEmployeeInputValue}&limit=5&option=HEAD_EMPLOYEE&member_id=${memberID}`
			);
			const responseData = response.data;
			const transformedResponseData = responseData.map(item => ({
				value: item.id,
				label: `${item.surname} ${item.name} ${item.patronymic}`,
			}));

			setMemberDirectorOptions(transformedResponseData);
		} catch (error) {
			return;
		}
	};

	useEffect(() => {
		if (debouncedMemberDirectorInputValue) {
			searchDirectorData(debouncedMemberDirectorInputValue);
		} else {
			setMemberDirectorOptions([]);
		}
	}, [debouncedMemberDirectorInputValue]);

	const handleMemberDirectorInputChange = newValue => {
		setMemberDirectorInputValue(newValue);
	};

	const handleMemberDirectorSelectChange = selectedOption => {
		setMemberDirectorSelectedValue(selectedOption);
		// setEditingUserStaffUnitSelectedValue(null);
	};

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
				const response = await axios.get(
					`http://localhost:8000/docs/course-template`,
					{
						withCredentials: true,
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				const responseData = response.data;
				const coursesOptions = [
					{ id: -1, title: 'Свой курс' },
					...responseData,
				];
				setCoursesOptionsSelect(
					coursesOptions.map(data => ({
						value: data.id,
						label: data.title,
					}))
				);
			} catch (error) {
				setCoursesOptionsSelect({ value: -1, label: 'Свой курс' });
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
				setCourseData([]);
			}
		};
		getCourseData();
	}, [courseID]);

	// useEffect(() => {
	// 	const getHeadsData = async () => {
	// 		try {
	// 			const responseData = await axios.get(
	// 				`http://localhost:8000/docs/define-heads/${memberID}`,
	// 				{
	// 					withCredentials: true,
	// 					headers: {
	// 						'Content-Type': 'application/json',
	// 					},
	// 				}
	// 			);
	// 			setAdminData(responseData.data.admin);
	// 			setManagerData(responseData.data.manager);
	// 			setDirectorData(responseData.data.director);
	// 		} catch (err) {
	// 			return;
	// 		}
	// 	};
	// 	getHeadsData();
	// }, [memberID]);

	const create_application = async e => {
		e.preventDefault();
		try {
			if (courseID !== -1) {
				const response = await axios.post(
					`http://localhost:8000/docs/course-application/create`,
					{
						manager_id: memberManagerSelectedValue.value,
						director_id: memberDirectorSelectedValue.value,
						administrator_id: memberAdminSelectedValue.value,
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
			} else {
				const response = await axios.post(
					`http://localhost:8000/docs/course-application/create`,
					{
						manager_id: memberManagerSelectedValue.value,
						director_id: memberDirectorSelectedValue.value,
						administrator_id: memberAdminSelectedValue.value,
						autor_id: userName.id,
						members_id: memberID,
						course: {
							title: courseName,
							description: courseDescription,
							cost: courseCost,
							start_date: startDate,
							end_date: endDate,
							goal: courseGoal,
							type: typeDate.id,
							category: categoryDate.id,
							education_center: educationCenter,
						},
					},
					{
						withCredentials: true,
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
			}
			navigate('/my-application');
		} catch (error) {
			return;
		}
	};

	const isFormValid = () => {
		if (courseID !== -1) {
			return (
				courseGoal.trim() !== '' &&
				startDate.trim() !== '' &&
				endDate.trim() !== '' &&
				courseCost.trim() !== '' &&
				courseID !== 0 &&
				memberID !== 0 &&
				memberAdminSelectedValue !== null &&
				memberDirectorSelectedValue !== null &&
				memberManagerSelectedValue !== null
			);
		} else
			return (
				courseGoal.trim() !== '' &&
				startDate.trim() !== '' &&
				endDate.trim() !== '' &&
				courseCost.trim() !== '' &&
				courseID !== 0 &&
				memberID !== 0 &&
				memberAdminSelectedValue !== null &&
				memberDirectorSelectedValue !== null &&
				memberManagerSelectedValue !== null &&
				courseName.trim() !== '' &&
				typeDate.id !== undefined &&
				categoryDate.id !== undefined &&
				courseDescription.trim() !== '' &&
				educationCenter.trim() !== ''
			);
	};

	const objectTeachingInputAutoResize = event => {
		event.target.style.height = 'auto';
		event.target.style.height = `${event.target.scrollHeight}px`;
	};

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

	const getCategory = () => {
		return categoryDate.id
			? categoryOptionsSelect.find(e => e.value === categoryDate.id)
			: '';
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
								<div className={style.create_application_date_group}>
									<div className={style.create_application_date_start_group}>
										<label
											className={style.create_application_date_start_label}
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
										<label className={style.create_application_date_end_label}>
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
								<textarea
									placeholder='Введите цель обучения'
									className={style.create_application_object_teaching_input}
									value={courseGoal}
									onChange={e => setCourseGoal(e.target.value)}
									onInput={objectTeachingInputAutoResize}
								></textarea>
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
									className={style.create_application_price_input}
									value={courseCost}
									onChange={e => setCourseCost(e.target.value)}
								/>
							</div>
							<div className={style.create_application_stages_section}>
								<h2 className={style.create_application_title_h2}>
									Этапы заявки
								</h2>
								<div
									className={style.create_application_stages_section_container}
								>
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
												<div
													className={
														memberManagerSelectedValue === null
															? style.attention_figure
															: style.attention_figure_none
													}
												></div>
											</div>
											<div
												className={style.create_application_stages_agreed_text}
											>
												{/* <p>
													{managerData.length === 0
														? 'Нет данных'
														: `${
																managerData.surname +
																' ' +
																managerData.name +
																' ' +
																managerData.patronymic
														  }`}
												</p> */}
												<div
													className={
														style.create_application_stages_select_container
													}
												>
													<Select
														classNamePrefix='custom-select'
														placeholder='Выберите сотрудника'
														className={style.create_application_course_select}
														isDisabled={memberID === 0}
														onChange={handleMemberManagerSelectChange}
														options={memberManagerOptions}
														onInputChange={handleMemberManagerInputChange}
														value={memberManagerSelectedValue}
													/>
												</div>
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
												<div
													className={
														memberDirectorSelectedValue === null
															? style.attention_figure
															: style.attention_figure_none
													}
												></div>
											</div>
											<div
												className={style.create_application_stages_finance_text}
											>
												{/* <p>
													{directorData.length === 0
														? 'Нет данных'
														: `${
																directorData.surname +
																' ' +
																directorData.name +
																' ' +
																directorData.patronymic
														  }`}
												</p> */}
												<div
													className={
														style.create_application_stages_select_container
													}
												>
													<Select
														classNamePrefix='custom-select'
														placeholder='Выберите сотрудника'
														className={style.create_application_course_select}
														isDisabled={memberID === 0}
														onChange={handleMemberDirectorSelectChange}
														options={memberDirectorOptions}
														onInputChange={handleMemberDirectorInputChange}
														value={memberDirectorSelectedValue}
													/>
												</div>
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
												<div
													className={
														memberAdminSelectedValue === null
															? style.attention_figure
															: style.attention_figure_none
													}
												></div>
											</div>
											<div
												className={
													style.create_application_stages_processing_text
												}
											>
												<p>
													{/* {adminData.length === 0
														? 'Нет данных'
														: `${
																adminData.surname +
																' ' +
																adminData.name +
																' ' +
																adminData.patronymic
														  }`} */}
													<div
														className={
															style.create_application_stages_select_container
														}
													>
														<Select
															classNamePrefix='custom-select'
															placeholder='Выберите сотрудника'
															className={style.create_application_course_select}
															isDisabled={memberID === 0}
															onChange={handleMemberAdminSelectChange}
															options={memberAdminOptions}
															onInputChange={handleMemberAdminInputChange}
															value={memberAdminSelectedValue}
														/>
													</div>
												</p>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div className={style.create_application_button_container}>
							<Button disabled={!isFormValid()}>Создать заявку</Button>
						</div>
					</form>
					<div className={style.create_application_second_section}>
						<h2 className={style.create_application_title_h2}>
							Информация о курсе
						</h2>
						<div className={style.create_application_second_section_content}>
							{courseData.length === 0 && courseID !== -1 ? (
								<h2 className={style.create_application_title_h2_error}>
									Выберите курс, чтобы увидеть информацию о нем
								</h2>
							) : (
								<div>
									<div>
										{courseID !== -1 ? (
											<div className={style.create_application_course_name}>
												<div
													className={
														style.create_application_course_name_title_group
													}
												>
													<p
														className={
															style.create_application_course_name_title
														}
													>
														Название курса
													</p>
												</div>
												<div
													className={style.create_application_course_name_text}
												>
													<p>{courseData.title}</p>
												</div>
											</div>
										) : (
											<div className={style.create_application_course_name}>
												<label
													className={style.create_application_description_label}
												>
													Название курса
													<div
														className={
															courseName === ''
																? style.attention_figure
																: style.attention_figure_none
														}
													></div>
												</label>
												<div
													className={
														style.create_application_course_name_input_container
													}
												>
													<input
														type='text'
														placeholder='Введите название курса'
														className={
															style.create_application_course_info_input
														}
														value={courseName}
														onChange={e => setCourseName(e.target.value)}
													/>
												</div>
											</div>
										)}
										{/* <ul className={style.create_application_tags_group}>
											<li className={style.create_application_tags}>
												{courseData.type}
											</li>
											<li className={style.create_application_tags}>
												{courseData.category}
											</li>
										</ul> */}
										<ul className={style.create_application_course_info}>
											{courseID !== -1 ? (
												<li
													className={style.create_application_course_info_type}
												>
													<div
														className={
															style.create_application_course_info_type_group
														}
													>
														<p
															className={
																style.create_application_course_info_type_group_title
															}
														>
															Тип курса
														</p>
													</div>
													<div
														className={
															style.create_application_course_info_type_text
														}
													>
														<p>{courseData.type}</p>
													</div>
												</li>
											) : (
												<li
													className={style.create_application_course_info_type}
												>
													<div>
														<label
															className={
																style.create_application_description_label
															}
														>
															Тип курса
															<div
																className={
																	typeDate.id === undefined
																		? style.attention_figure
																		: style.attention_figure_none
																}
															></div>
														</label>
														<div
															className={
																style.create_application_course_type_selector_container
															}
														>
															<Select
																classNamePrefix='custom-select'
																options={typeOptionsSelect}
																placeholder='Выберите тип курса'
																onChange={onChangeTypeSelect}
																value={getType()}
															/>
														</div>
													</div>
												</li>
											)}
											{courseID !== -1 ? (
												<li
													className={
														style.create_application_course_info_category
													}
												>
													<div
														className={
															style.create_application_course_info_category_group
														}
													>
														<p
															className={
																style.create_application_course_info_category_group_title
															}
														>
															Категория курса
														</p>
													</div>
													<div
														className={
															style.create_application_course_info_category_text
														}
													>
														<p>{courseData.category}</p>
													</div>
												</li>
											) : (
												<li
													className={
														style.create_application_course_info_category
													}
												>
													<div>
														<label
															className={
																style.create_application_description_label
															}
														>
															Категория курса
															<div
																className={
																	categoryDate.id === undefined
																		? style.attention_figure
																		: style.attention_figure_none
																}
															></div>
														</label>
														<div
															className={
																style.create_application_course_category_selector_container
															}
														>
															<Select
																classNamePrefix='custom-select'
																options={categoryOptionsSelect}
																placeholder='Выберите тип курса'
																onChange={onChangeCategorySelect}
																value={getCategory()}
															/>
														</div>
													</div>
												</li>
											)}
										</ul>
										{courseID !== -1 ? (
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
												</div>
												<div
													className={
														style.create_application_course_description_text
													}
												>
													<p>{courseData.description}</p>
												</div>
											</div>
										) : (
											<div
												className={
													style.create_application_object_teaching_container
												}
											>
												<label
													className={style.create_application_description_label}
												>
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
														className={
															style.create_application_course_info_input
														}
														value={courseDescription}
														onChange={e => setCourseDescription(e.target.value)}
														onInput={objectTeachingInputAutoResize}
													></textarea>
												</div>
											</div>
										)}
										<ul className={style.create_application_course_info}>
											{courseID !== -1 ? (
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
															Центр обучения
														</p>
													</div>
													<div
														className={
															style.create_application_course_info_training_center_text
														}
													>
														<p>{courseData.education_center}</p>
													</div>
												</li>
											) : (
												<li
													className={
														style.create_application_course_info_training_center
													}
												>
													<label
														className={
															style.create_application_description_label
														}
													>
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
															className={
																style.create_application_course_info_input
															}
															value={educationCenter}
															onChange={e => setEducationCenter(e.target.value)}
														/>
													</div>
												</li>
											)}
											{/* {courseID !== -1 ? (
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
															Стоимость обучения
														</p>
													</div>
													<div
														className={
															style.create_application_course_info_price_text
														}
													>
														<p>Не указана</p>
													</div>
												</li>
											) : (
												<li
													className={style.create_application_course_info_price}
												>
													<label
														className={style.create_application_price_label}
													>
														Стоимость обучения
														<div
															className={
																courseCost === ''
																	? style.attention_figure
																	: style.attention_figure_none
															}
														></div>
													</label>
													<div
														className={
															style.create_application_course_price_input_container
														}
													>
														<input
															type='text'
															placeholder='Введите стоимость обучения'
															className={
																style.create_application_course_info_input
															}
															value={courseCost}
															onChange={e => setCourseCost(e.target.value)}
														/>
													</div>
												</li>
											)} */}
										</ul>
									</div>
								</div>
							)}
							{/* <div className={style.create_application_stages_section}>
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
							</div> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
