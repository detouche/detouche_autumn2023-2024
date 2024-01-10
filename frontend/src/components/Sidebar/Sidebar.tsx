import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

import style from './Sidebar.module.scss';

import { ConfirmationWindow } from '../ConfirmationWindow';
import { useDebounce } from '../../hooks/UseDebounce';

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
	const [showConfirmationEditingWindow, setShowConfirmationEditingWindow] =
		useState(false);
	const [confirmationEditing, setConfirmationEditing] = useState();
	const [educationCenter, setEducationCenter] = useState('');
	const [courseCost, setCourseCost] = useState('');
	const [courseGoal, setCourseGoal] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [categoryDate, setCategoryDate] = useState({});
	const [typeDate, setTypeDate] = useState({});
	const [courseDescription, setCourseDescription] = useState('');
	const [courseTitle, setCourseTitle] = useState('');
	const [memberID, setMemberID] = useState(0);
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
	const [membersOptionsSelect, setMembersOptionsSelect] = useState([]);
	const isMulti = true;
	const [userName, setUserName] = useState({
		id: '',
		title: '',
	});
	const [managerData, setManagerData] = useState({});
	const [directorData, setDirectorData] = useState({});
	const [administratorData, setAdministratorData] = useState({});

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
				setTypeDate({
					id: response.data.course.type,
					type_name: response.data.course.type,
				});
				setCategoryDate({
					id: response.data.course.category,
					category_name: response.data.course.category,
				});
				setCourseDescription(response.data.course.description);
				setCourseTitle(response.data.course.title);
			} catch (error) {}
		};
		getData();
	}, [course_id]);

	const formatterDate = date => {
		const dateComponents = date.split('T')[0].split('-');
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

	useEffect(() => {
		getStagesResponsibleData(
			courseData.manager_id,
			courseData.director_id,
			courseData.administrator_id
		);
	}, [course_id, editingCourseDate]);

	const getStagesResponsibleData = async (
		managerID,
		directorID,
		administratorID
	) => {
		if (
			managerID !== undefined &&
			directorID !== undefined &&
			administratorID !== undefined
		) {
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
				setManagerData(responseManager.data);
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
				setDirectorData(responseDirector.data);
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
				setAdministratorData(responseAdministrator.data);
			} catch (error) {
				return;
			}
		}
	};

	useEffect(() => {
		getMemberData(courseData.members_id);
	}, [course_id, editingCourseDate]);

	const getMemberData = async memberID => {
		if (memberID !== undefined) {
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
					manager_id: memberManagerSelectedValue.value,
					director_id: memberDirectorSelectedValue.value,
					administrator_id: memberAdminSelectedValue.value,
					members_id: [memberID],
					title: courseTitle,
					description: courseDescription,
					cost: courseCost,
					start_date: new Date(startDate),
					end_date: new Date(endDate),
					goal: courseGoal,
					type: typeDate.id,
					category: categoryDate.id,
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

	const isValid = () => {
		return (
			courseTitle.trim() !== '' &&
			courseGoal.trim() !== '' &&
			startDate.trim() !== '' &&
			endDate.trim() !== '' &&
			courseCost !== '' &&
			memberID !== 0 &&
			memberAdminSelectedValue !== null &&
			memberDirectorSelectedValue !== null &&
			memberManagerSelectedValue !== null &&
			typeDate.id !== undefined &&
			categoryDate.id !== undefined &&
			courseDescription.trim() !== '' &&
			educationCenter.trim() !== ''
		);
	};

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

	const getMembersID = () => {
		if (memberID === 0) {
			setMemberID(memberData.id);
			return membersOptionsSelect[0];
		}
		if (memberID) {
			return isMulti
				? membersOptionsSelect.filter(e => memberID.indexOf(e.value) >= 0)
				: membersOptionsSelect.find(e => e.value === memberID);
			// return memberID ? membersOptionsSelect.find(e => e.value === memberID) : '';
		} else {
			return isMulti ? [] : '';
		}
	};

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
				// setMembersOptionsSelect(
				// 	responseData.data.map(data => ({
				// 		value: data.id,
				// 		label: data.title,
				// 	}))
				// );
				setMembersOptionsSelect([
					{
						value: memberData.id,
						label: `${memberData.surname} ${memberData.name} ${memberData.patronymic}`,
					},
				]);
			} catch (error) {
				setMembersOptionsSelect([
					{
						value: memberData.id,
						label: `${memberData.surname} ${memberData.name} ${memberData.patronymic}`,
					},
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
	}, [memberData]);

	const onChangeMultiSelect = newValue => {
		setMemberID(isMulti ? newValue.map(e => e.value) : newValue.value);
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
		if (managerData !== null) {
			const initialChildrenHeadEmployeeSelectedValue = {
				value: managerData.id,
				label: `${managerData.surname} ${managerData.name} ${managerData.patronymic}`,
			};
			handleMemberManagerSelectChange(initialChildrenHeadEmployeeSelectedValue);
		} else handleMemberManagerSelectChange(null);
	}, [managerData]);

	useEffect(() => {
		if (directorData !== null) {
			const initialChildrenHeadEmployeeSelectedValue = {
				value: directorData.id,
				label: `${directorData.surname} ${directorData.name} ${directorData.patronymic}`,
			};
			handleMemberDirectorSelectChange(
				initialChildrenHeadEmployeeSelectedValue
			);
		} else handleMemberDirectorSelectChange(null);
	}, [directorData]);

	useEffect(() => {
		if (administratorData !== null) {
			const initialChildrenHeadEmployeeSelectedValue = {
				value: administratorData.id,
				label: `${administratorData.surname} ${administratorData.name} ${administratorData.patronymic}`,
			};
			handleMemberAdminSelectChange(initialChildrenHeadEmployeeSelectedValue);
		} else handleMemberAdminSelectChange(null);
	}, [administratorData]);

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
								{courseData.state === 'ON_CONFIRMATION' &&
									editingCourseDate === false && (
										<li>
											<button
												className={style.sidebar_button_more}
												onClick={() => {
													setEditingCourseDate(true);
													getMemberData(courseData.members_id);
													setMemberID(memberData.id);
													getStagesResponsibleData(
														courseData.manager_id,
														courseData.director_id,
														courseData.administrator_id
													);
												}}
											>
												<img src='/img/edit.svg' alt='edit' />
											</button>
										</li>
									)}
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
											disabled={!isValid()}
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
							<li>
								<button
									onClick={() => {
										setCurrentNavPage('О курсе');
									}}
									className={
										currentNavPage === 'О курсе'
											? style.sidebar_navigate_button_active
											: style.sidebar_navigate_button
									}
								>
									О курсе
								</button>
							</li>
							<li>
								<button
									onClick={() => {
										setCurrentNavPage('Этапы заявки');
										getMemberData(courseData.members_id);
										setMemberID(memberData.id);
										getStagesResponsibleData(
											courseData.manager_id,
											courseData.director_id,
											courseData.administrator_id
										);
									}}
									className={
										currentNavPage === 'Этапы заявки'
											? style.sidebar_navigate_button_active
											: style.sidebar_navigate_button
									}
								>
									Этапы заявки
								</button>
							</li>
							<li>
								<button
									onClick={() => {
										setCurrentNavPage('Сотрудники');
										getMemberData(courseData.members_id);
									}}
									className={
										currentNavPage === 'Сотрудники'
											? style.sidebar_navigate_button_active
											: style.sidebar_navigate_button
									}
								>
									Сотрудники
								</button>
							</li>
						</ul>
					</div>
					{currentNavPage === 'О курсе' && (
						<div>
							{editingCourseDate && (
								<div className={style.sidebar_course_info_training_center}>
									<label className={style.sidebar_description_label}>
										Название курса
										<div
											className={
												courseTitle.trim() === ''
													? style.attention_figure
													: style.attention_figure_none
											}
										></div>
									</label>
									<div
										className={style.sidebar_education_center_input_container}
									>
										<input
											type='text'
											placeholder='Введите название курса'
											className={style.sidebar_course_info_input}
											value={courseTitle}
											onChange={e => setCourseTitle(e.target.value)}
										/>
									</div>
								</div>
							)}
							{editingCourseDate ? (
								<ul className={style.sidebar_course_info}>
									<li className={style.sidebar_course_info_type}>
										<div>
											<label className={style.sidebar_description_label}>
												Тип курса
											</label>
											<div
												className={style.sidebar_course_type_selector_container}
											>
												<Select
													classNamePrefix='custom-select'
													options={typeOptionsSelect}
													placeholder='Выберите тип курса'
													onChange={onChangeTypeSelect}
													value={getType()}
													defaultValue={[
														{
															value: categoryDate.id,
															label: categoryDate.type_name,
														},
													]}
												/>
											</div>
										</div>
									</li>
									<li className={style.sidebar_course_info_category}>
										<div>
											<label className={style.sidebar_description_label}>
												Категория курса
											</label>
											<div
												className={
													style.sidebar_course_category_selector_container
												}
											>
												<Select
													classNamePrefix='custom-select'
													options={categoryOptionsSelect}
													placeholder='Выберите категорию'
													onChange={onChangeCategorySelect}
													value={getCategory()}
													defaultValue={[
														{
															value: categoryDate.id,
															label: categoryDate.category_name,
														},
													]}
												/>
											</div>
										</div>
									</li>
								</ul>
							) : (
								// <div></div>
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
								<div className={style.sidebar_object_teaching_container}>
									<label className={style.sidebar_description_label}>
										Описание курса
										<div
											className={
												courseDescription.trim() === ''
													? style.attention_figure
													: style.attention_figure_none
											}
										></div>
									</label>
									<div className={style.sidebar_description_input_container}>
										<textarea
											placeholder='Введите описание курса'
											className={style.sidebar_course_info_input}
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
								<div className={style.sidebar_course_info_training_center}>
									<label className={style.sidebar_description_label}>
										Центр обучения
										<div
											className={
												educationCenter.trim() === ''
													? style.attention_figure
													: style.attention_figure_none
											}
										></div>
									</label>
									<div
										className={style.sidebar_education_center_input_container}
									>
										<input
											type='text'
											placeholder='Введите центр обучения'
											className={style.sidebar_course_info_input}
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
								<div className={style.sidebar_price_container}>
									<label className={style.sidebar_description_label}>
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
										className={style.sidebar_course_info_input}
										value={courseCost}
										onChange={e => {
											const inputValue = e.target.value;
											const regex = /^[0-9\b]+$/; // Регулярное выражение, позволяющее вводить только цифры

											if (inputValue === '' || regex.test(inputValue)) {
												setCourseCost(inputValue);
											}
										}}
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
								<div className={style.sidebar_date_container}>
									<div className={style.sidebar_editing_date_group}>
										<div className={style.sidebar_date_start_group}>
											<label className={style.sidebar_description_label}>
												Дата начала обучения
												<div
													className={
														startDate === ''
															? style.attention_figure
															: style.attention_figure_none
													}
												></div>
											</label>
											<div className={style.sidebar_date_start_input_container}>
												<input
													type='date'
													className={style.sidebar_date_start_input}
													value={startDate}
													onChange={e => setStartDate(e.target.value)}
												/>
											</div>
										</div>
										<div className={style.sidebar_date_line}>
											<img src='/img/date_line.svg' alt='date_line' />
										</div>
										<div className={style.sidebar_date_end_group}>
											<label className={style.sidebar_description_label}>
												Дата конца обучения
												<div
													className={
														endDate === ''
															? style.attention_figure
															: style.attention_figure_none
													}
												></div>
											</label>
											<div className={style.sidebar_date_end_input_container}>
												<input
													type='date'
													className={style.sidebar_date_end_input}
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
								<div className={style.sidebar_object_teaching_container}>
									<label className={style.sidebar_description_label}>
										Цель обучения
										<div
											className={
												courseGoal.trim() === ''
													? style.attention_figure
													: style.attention_figure_none
											}
										></div>
									</label>
									<div className={style.sidebar_description_input_container}>
										<textarea
											placeholder='Введите цель обучения'
											value={courseGoal}
											onChange={e => setCourseGoal(e.target.value)}
											onInput={objectTeachingInputAutoResize}
											className={style.sidebar_course_info_input}
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
								<ul
									className={
										editingCourseDate
											? style.sidebar_stages_info_group_editing
											: style.sidebar_stages_info_group
									}
								>
									{editingCourseDate ? (
										<li>
											<div className={style.sidebar_stages_agreed_group}>
												<p className={style.sidebar_stages_agreed_group_title}>
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
											<div className={style.sidebar_stages_agreed_text}>
												<div className={style.sidebar_stages_select_container}>
													<Select
														classNamePrefix='custom-select'
														placeholder='Выберите сотрудника'
														className={style.sidebar_course_select}
														isDisabled={memberID === 0}
														onChange={handleMemberManagerSelectChange}
														options={memberManagerOptions}
														onInputChange={handleMemberManagerInputChange}
														value={memberManagerSelectedValue}
													/>
												</div>
											</div>
										</li>
									) : (
										<li>
											<p className={style.sidebar_stages_group_title}>
												Согласование
											</p>
											<div className={style.sidebar_stages_group_text}>
												<p>{managerName}</p>
											</div>
										</li>
									)}
									{editingCourseDate ? (
										<li>
											<div className={style.sidebar_stages_finance_group}>
												<p className={style.sidebar_stages_finance_group_title}>
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
											<div className={style.sidebar_stages_finance_text}>
												<div className={style.sidebar_stages_select_container}>
													<Select
														classNamePrefix='custom-select'
														placeholder='Выберите сотрудника'
														className={style.sidebar_course_select}
														isDisabled={memberID === 0}
														onChange={handleMemberDirectorSelectChange}
														options={memberDirectorOptions}
														onInputChange={handleMemberDirectorInputChange}
														value={memberDirectorSelectedValue}
													/>
												</div>
											</div>
										</li>
									) : (
										<li>
											<p className={style.sidebar_stages_group_title}>
												Одобрение финансовых затрат
											</p>
											<div className={style.sidebar_stages_group_text}>
												<p>{directorName}</p>
											</div>
										</li>
									)}
									{editingCourseDate ? (
										<li>
											<div className={style.sidebar_stages_processing_group}>
												<p
													className={
														style.sidebar_stages_processing_group_title
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
											<div className={style.sidebar_stages_processing_text}>
												<p>
													<div
														className={style.sidebar_stages_select_container}
													>
														<Select
															classNamePrefix='custom-select'
															placeholder='Выберите сотрудника'
															className={style.sidebar_course_select}
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
									) : (
										<li>
											<p className={style.sidebar_stages_group_title}>
												Обработка
											</p>
											<div className={style.sidebar_stages_group_text}>
												<p>{administratorName}</p>
											</div>
										</li>
									)}
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
								{editingCourseDate ? (
									<li className={style.sidebar_member_group}>
										<label className={style.sidebar_member_label}>
											Сотрудники
											<div
												className={
													memberID === 0
														? style.attention_figure
														: style.attention_figure_none
												}
											></div>
										</label>
										<div className={style.sidebar_member_select_container}>
											<Select
												classNamePrefix='custom-select'
												options={membersOptionsSelect}
												className={style.sidebar_course_select}
												isMulti
												placeholder='Выберите сотрудников'
												onChange={onChangeMultiSelect}
												value={getMembersID()}
											/>
										</div>
									</li>
								) : (
									<li className={style.sidebar_member_content_container}>
										<div className={style.sidebar_member_name}>
											{memberData.surname} {memberData.name}{' '}
											{memberData.patronymic}
										</div>
										<div className={style.sidebar_member_description}>
											Описание сотрудника
										</div>
									</li>
								)}
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
