import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

import style from './OrgStructureSidebarUser.module.scss';

import { useDebounce } from '../../../hooks/UseDebounce';
import { Input } from '../../UI/Input';
import { ConfirmationWindow } from '../../ConfirmationWindow';

export function OrgStructureSidebarUser({ user_ID, onClose }) {
	const [userData, setUserData] = useState([{}]);
	const [userStaffUnitData, setUserStaffUnitData] = useState([{}]);
	const [editingUserData, setEditingUserData] = useState(false);
	const [userName, setUserName] = useState();
	const [userSurname, setUserSurname] = useState();
	const [userPatronymic, setUserPatronymic] = useState();
	const [userEmail, setUserEmail] = useState();
	const [editingUserName, setEditingUserName] = useState();
	const [editingUserSurname, setEditingUserSurname] = useState();
	const [editingUserPatronymic, setEditingUserPatronymic] = useState();
	const [editingUserEmail, setEditingUserEmail] = useState();
	const [showConfirmationEditingWindow, setShowConfirmationEditingWindow] =
		useState(false);
	const [confirmationEditing, setConfirmationEditing] = useState();
	const [showConfirmationDeleteWindow, setShowConfirmationDeleteWindow] =
		useState(false);
	const [confirmationDelete, setConfirmationDelete] = useState();
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [editingStartDate, setEditingStartDate] = useState('');
	const [editingEndDate, setEditingEndDate] = useState('');
	const [statusDate, setStatusDate] = useState({});
	const [editingStatusDate, setEditingStatusDate] = useState({});
	const [userDivisionData, setUserDivisionData] = useState();
	const [editingUserDivisionData, setEditingUserDivisionData] = useState({});
	const [editingUserStaffUnitData, setEditingUserStaffUnitData] = useState({});
	const [userDivisionOptions, setUserDivisionOptions] = useState([]);
	const [userDivisionInputValue, setUserDivisionInputValue] = useState('');
	const [
		selectedEditingUserDivisionValue,
		setEditingUserDivisionSelectedValue,
	] = useState(null);
	const [userStaffUnitOptions, setUserStaffUnitOptions] = useState([]);
	const [userStaffUnitInputValue, setUserStaffUnitInputValue] = useState('');
	const [
		selectedEditingUserStaffUnitValue,
		setEditingUserStaffUnitSelectedValue,
	] = useState(null);

	useEffect(() => {
		const getUserData = async () => {
			try {
				const responseData = await axios.get(
					`http://localhost:8000/org/employee/${user_ID}`,
					{
						withCredentials: true,
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				setEditingUserDivisionData(responseData.data.division);
				setUserData(responseData.data);
				setUserStaffUnitData(responseData.data.staff_unit);
				setUserName(responseData.data.name);
				setUserSurname(responseData.data.surname);
				setUserPatronymic(responseData.data.patronymic);
				setUserEmail(responseData.data.email);
				setStartDate(responseData.data.assignment.start_date.split('T')[0]);
				setEndDate(responseData.data.assignment.end_date.split('T')[0]);
				setEditingUserName(responseData.data.name);
				setEditingUserSurname(responseData.data.surname);
				setEditingUserPatronymic(responseData.data.patronymic);
				setEditingUserEmail(responseData.data.email);
				setEditingEndDate(responseData.data.assignment.end_date.split('T')[0]);
				setEditingStartDate(
					responseData.data.assignment.start_date.split('T')[0]
				);
				setStatusDate(responseData.data.employee_status);
				setEditingStatusDate(responseData.data.employee_status);
				setUserDivisionData(responseData.data.division);
				setEditingUserStaffUnitData(responseData.data.staff_unit);
			} catch (err) {
				return;
			}
		};
		getUserData();
	}, [user_ID]);

	useEffect(() => {
		if (confirmationEditing) {
			editingUser();
		} else if (confirmationEditing === false) {
			setShowConfirmationEditingWindow(false);
		}
	}, [confirmationEditing]);

	useEffect(() => {
		if (confirmationDelete) {
			deleteUser();
		} else if (confirmationDelete === false) {
			setShowConfirmationDeleteWindow(false);
		}
	}, [confirmationDelete]);

	const editingUser = async () => {
		try {
			const responseData = await axios.patch(
				`http://localhost:8000/org/employee`,
				{
					employee_id: `${user_ID}`,
					name: editingUserName,
					email: editingUserEmail,
					surname: editingUserSurname,
					patronymic: editingUserPatronymic,
					employee_status_id: editingStatusDate.id,
					start_date: new Date(editingStartDate),
					end_date: new Date(editingEndDate),
					staff_units_id: selectedEditingUserStaffUnitValue.value,
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

	const statusOptionsSelect = [
		{ value: 1, label: 'test' },
		{ value: 2, label: 'test2' },
	];

	const onChangeStatusSelect = newValue => {
		setEditingStatusDate(prevUserData => ({
			...prevUserData,
			id: newValue.value,
		}));
	};

	const getStatus = () => {
		return editingStatusDate.id
			? statusOptionsSelect.find(e => e.value === editingStatusDate.id)
			: '';
	};

	useEffect(() => {
		const initialEditingUserDivisionSelectedValue = {
			value: editingUserDivisionData.id,
			label: editingUserDivisionData.name,
		};
		setEditingUserDivisionSelectedValue(
			initialEditingUserDivisionSelectedValue
		);
	}, [editingUserDivisionData]);

	const debouncedEditingUserDivisionInputValue = useDebounce(
		userDivisionInputValue,
		100
	);

	const searchDivisionData = async userDivisionInputValue => {
		try {
			const response = await axios.get(
				`http://localhost:8000/org/division-search?term=${userDivisionInputValue}&limit=5`
			);
			const responseData = response.data;

			const transformedResponseData = responseData.map(item => ({
				value: item.id,
				label: item.name,
			}));

			setUserDivisionOptions(transformedResponseData);
		} catch (error) {
			return;
		}
	};

	useEffect(() => {
		if (debouncedEditingUserDivisionInputValue) {
			searchDivisionData(debouncedEditingUserDivisionInputValue);
		} else {
			setUserDivisionOptions([]);
		}
	}, [debouncedEditingUserDivisionInputValue]);

	const handleUserDivisionInputChange = newValue => {
		setUserDivisionInputValue(newValue);
	};

	const handleUserDivisionSelectChange = selectedOption => {
		setEditingUserDivisionSelectedValue(selectedOption);
		setEditingUserStaffUnitSelectedValue(null);
	};

	useEffect(() => {
		const initialEditingUserStaffUnitSelectedValue = {
			value: editingUserStaffUnitData.id,
			label: editingUserStaffUnitData.name,
		};
		setEditingUserStaffUnitSelectedValue(
			initialEditingUserStaffUnitSelectedValue
		);
	}, [editingUserStaffUnitData]);

	const debouncedEditingUserStaffUnitInputValue = useDebounce(
		userStaffUnitInputValue,
		100
	);

	const searchStaffUnitData = async userStaffUnitInputValue => {
		try {
			const response = await axios.get(
				`http://localhost:8000/org/staff-unit-search?division_id=${selectedEditingUserDivisionValue.value}&term=${userStaffUnitInputValue}&limit=5`
			);
			const responseData = response.data;

			const transformedResponseData = responseData.map(item => ({
				value: item.id,
				label: item.name,
			}));

			setUserStaffUnitOptions(transformedResponseData);
		} catch (error) {
			return;
		}
	};

	useEffect(() => {
		if (debouncedEditingUserStaffUnitInputValue) {
			searchStaffUnitData(debouncedEditingUserStaffUnitInputValue);
		} else {
			setUserStaffUnitOptions([]);
		}
	}, [debouncedEditingUserStaffUnitInputValue]);

	const handleUserStaffUnitInputChange = newValue => {
		setUserStaffUnitInputValue(newValue);
	};

	const handleUserStaffUnitSelectChange = selectedOption => {
		setEditingUserStaffUnitSelectedValue(selectedOption);
	};

	const isValid = () => {
		return (
			editingUserSurname.trim() !== '' &&
			editingUserName.trim() !== '' &&
			editingUserPatronymic.trim() !== '' &&
			editingEndDate.trim() !== '' &&
			editingStartDate.trim() !== '' &&
			editingUserEmail.trim() !== '' &&
			editingStatusDate.id !== null &&
			selectedEditingUserDivisionValue !== null &&
			selectedEditingUserStaffUnitValue !== null
		);
	};

	const deleteUser = async () => {
		try {
			const responseData = await axios.delete(
				`http://localhost:8000/org/employee?employee_id=${user_ID}`,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			window.location.reload();
		} catch (error) {
			return;
		}
	};

	return (
		<div className={style.main}>
			<div className={style.sidebar_container}>
				{!editingUserData && (
					<div className={style.sidebar_content}>
						<div className={style.sidebar_title_group}>
							<h1 className={style.sidebar_title}>
								{userSurname} {userName} {userPatronymic}
							</h1>
							<button onClick={onClose}>
								<img src='/img/close_button.svg' alt='close_button' />
							</button>
						</div>
						<div className={style.sidebar_button_group}>
							<ul className={style.sidebar_button_group}>
								<li>
									<button
										onClick={() => setEditingUserData(true)}
										className={style.sidebar_button_affirmative}
									>
										Редактировать
									</button>
								</li>
								<li>
									<button
										onClick={() => {
											setShowConfirmationDeleteWindow(true);
										}}
										className={style.sidebar_button_reject}
									>
										Удалить
									</button>
								</li>
								<li>
									<button className={style.sidebar_button_more}>
										<img src='/img/more_horiz.svg' alt='more_horiz' />
									</button>
								</li>
							</ul>
						</div>
						<div className={style.sidebar_description_group}>
							<h2 className={style.sidebar_title_h2}>Email</h2>
							<p className={style.sidebar_description}>{userEmail}</p>
						</div>
						<div className={style.sidebar_description_group}>
							<h2 className={style.sidebar_title_h2}>Должность</h2>
							<p className={style.sidebar_description}>
								{userStaffUnitData.name}
							</p>
						</div>
					</div>
				)}
				{editingUserData && (
					<div className={style.sidebar_content}>
						<div className={style.sidebar_title_group}>
							<h1 className={style.sidebar_title}>Редактирование сотрудника</h1>
							<button onClick={onClose}>
								<img src='/img/close_button.svg' alt='close_button' />
							</button>
						</div>
						<div className={style.sidebar_description_group}>
							<h2 className={style.sidebar_title_h2}>Фамилия</h2>
							<Input
								type='text'
								value={editingUserSurname}
								onChange={e => setEditingUserSurname(e.target.value)}
								placeholder='Введите фамилию'
							/>
						</div>
						<div className={style.sidebar_description_group}>
							<h2 className={style.sidebar_title_h2}>Имя</h2>
							<Input
								type='text'
								value={editingUserName}
								onChange={e => setEditingUserName(e.target.value)}
								placeholder='Введите имя'
							/>
						</div>
						<div className={style.sidebar_description_group}>
							<h2 className={style.sidebar_title_h2}>Отчество</h2>
							<Input
								type='text'
								value={editingUserPatronymic}
								onChange={e => setEditingUserPatronymic(e.target.value)}
								placeholder='Введите отчество'
							/>
						</div>
						<div className={style.sidebar_description_group}>
							<h2 className={style.sidebar_title_h2}>Email</h2>
							<Input
								type='text'
								value={editingUserEmail}
								onChange={e => setEditingUserEmail(e.target.value)}
								placeholder='Введите email'
							/>
						</div>
						<div className={style.sidebar_description_group}>
							<h2 className={style.sidebar_title_h2}>Статус</h2>
							<div>
								<Select
									classNamePrefix='custom-select'
									options={statusOptionsSelect}
									placeholder='Выберите статус'
									defaultValue={[
										{
											value: editingStatusDate.id,
											label: editingStatusDate.status_name,
										},
									]}
									onChange={onChangeStatusSelect}
									value={getStatus()}
								/>
							</div>
						</div>
						<div className={style.sidebar_description_group}>
							<h2 className={style.sidebar_title_h2}>Сроки назначения</h2>
							<div className={style.sidebar_date_group}>
								<div className={style.sidebar_date_start_group}>
									<h2 className={style.sidebar_title_h2}>Начальная дата</h2>
									<div className={style.sidebar_date_start_input_container}>
										<input
											type='date'
											className={style.sidebar_date_start_input}
											value={editingStartDate}
											onChange={e => setEditingStartDate(e.target.value)}
										/>
									</div>
								</div>
								<div className={style.sidebar_date_line}>
									<img src='/img/date_line.svg' alt='date_line' />
								</div>
								<div className={style.sidebar_date_end_group}>
									<h2 className={style.sidebar_title_h2}>Конечная дата</h2>
									<div className={style.sidebar_date_end_input_container}>
										<input
											type='date'
											className={style.sidebar_date_end_input}
											value={editingEndDate}
											onChange={e => setEditingEndDate(e.target.value)}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className={style.sidebar_description_group}>
							<h2 className={style.sidebar_title_h2}>Подразделение</h2>
							<div>
								<Select
									classNamePrefix='custom-select'
									placeholder='Выберите подразделение'
									onChange={handleUserDivisionSelectChange}
									options={userDivisionOptions}
									onInputChange={handleUserDivisionInputChange}
									value={selectedEditingUserDivisionValue}
								/>
							</div>
						</div>
						<div className={style.sidebar_description_group}>
							<h2 className={style.sidebar_title_h2}>Должность</h2>
							<div>
								<Select
									classNamePrefix='custom-select'
									placeholder='Выберите должность'
									onChange={handleUserStaffUnitSelectChange}
									options={userStaffUnitOptions}
									onInputChange={handleUserStaffUnitInputChange}
									value={selectedEditingUserStaffUnitValue}
								/>
							</div>
						</div>
						<ul className={style.sidebar_button_group}>
							<li>
								<button
									onClick={() => setShowConfirmationEditingWindow(true)}
									className={style.sidebar_button_affirmative}
									disabled={!isValid()}
								>
									Сохранить изменения
								</button>
							</li>
							<li>
								<button
									onClick={() => setEditingUserData(false)}
									className={style.sidebar_button_reject}
								>
									Отменить
								</button>
							</li>
						</ul>
					</div>
				)}
			</div>
			{showConfirmationEditingWindow && (
				<ConfirmationWindow
					setConfirmation={setConfirmationEditing}
					setShowConfirmationWindow={setShowConfirmationEditingWindow}
				/>
			)}
			{showConfirmationDeleteWindow && (
				<ConfirmationWindow
					setConfirmation={setConfirmationDelete}
					setShowConfirmationWindow={setShowConfirmationDeleteWindow}
				/>
			)}
		</div>
	);
}
