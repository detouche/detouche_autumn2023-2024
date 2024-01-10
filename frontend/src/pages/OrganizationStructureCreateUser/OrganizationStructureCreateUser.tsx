import axios from 'axios';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

import style from './OrganizationStructureCreateUser.module.scss';

import { useDebounce } from '../../hooks/UseDebounce';
import { Drawer } from '../../components/Drawer';
import { Header } from '../../components/Header';
import { Input } from '../../components/UI/Input';
import { useInput } from '../../hooks/UseInput';
import { ConfirmationWindow } from '../../components/ConfirmationWindow';

export function OrganizationStructureCreateUser() {
	const [userName, setUserName] = useState('');
	const [userSurname, setUserSurname] = useState('');
	const [userPatronymic, setUserPatronymic] = useState('');
	const [userEmail, setUserEmail] = useState('');
	const [showConfirmationWindow, setShowConfirmationWindow] = useState(false);
	const [confirmation, setConfirmation] = useState();
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [statusDate, setStatusDate] = useState({});
	const [userDivisionOptions, setUserDivisionOptions] = useState([]);
	const [userDivisionInputValue, setUserDivisionInputValue] = useState('');
	const [selectedUserDivisionValue, setUserDivisionSelectedValue] =
		useState(null);
	const [userStaffUnitOptions, setUserStaffUnitOptions] = useState([]);
	const [userStaffUnitInputValue, setUserStaffUnitInputValue] = useState('');
	const [selectedUserStaffUnitValue, setUserStaffUnitSelectedValue] =
		useState(null);
	const email = useInput('', {
		correctEmail: true,
	});
	const [errorText, setErrorText] = useState('');

	useEffect(() => {
		if (confirmation) {
			createUser();
		} else if (confirmation === false) {
			setShowConfirmationWindow(false);
		}
	}, [confirmation]);

	const createUser = async () => {
		try {
			const responseData = await axios.post(
				`http://localhost:8000/org/employee`,
				{
					employee: {
						email: email.value,
						name: userName,
						surname: userSurname,
						patronymic: userPatronymic,
						employee_status_id: statusDate.id,
					},
					assignment: {
						start_date: new Date(startDate),
						end_date: new Date(endDate),
					},
					staff_unit: {
						id: selectedUserStaffUnitValue.value,
					},
				},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			window.location.reload();
		} catch (error) {
			if (error.response.status === 400) {
				if (
					error.response.data.detail.code === 'EMPLOYEE_EMAIL_IS_ALREADY_EXISTS'
				) {
					setErrorText('Данная почта уже существует');
				}
			}
			setConfirmation(false);
		}
	};

	const statusOptionsSelect = [
		{ value: 1, label: 'test' },
		{ value: 2, label: 'test2' },
	];

	const onChangeStatusSelect = newValue => {
		setStatusDate(prevUserData => ({
			...prevUserData,
			id: newValue.value,
		}));
	};

	const getStatus = () => {
		return statusDate.id
			? statusOptionsSelect.find(e => e.value === statusDate.id)
			: '';
	};

	const debouncedUserDivisionInputValue = useDebounce(
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
		if (debouncedUserDivisionInputValue) {
			searchDivisionData(debouncedUserDivisionInputValue);
		} else {
			setUserDivisionOptions([]);
		}
	}, [debouncedUserDivisionInputValue]);

	const handleUserDivisionInputChange = newValue => {
		setUserDivisionInputValue(newValue);
	};

	const handleUserDivisionSelectChange = selectedOption => {
		setUserDivisionSelectedValue(selectedOption);
		setUserStaffUnitSelectedValue(null);
	};

	const debouncedUserStaffUnitInputValue = useDebounce(
		userStaffUnitInputValue,
		100
	);

	const searchStaffUnitData = async userStaffUnitInputValue => {
		try {
			const response = await axios.get(
				`http://localhost:8000/org/staff-unit-search?division_id=${selectedUserDivisionValue.value}&term=${userStaffUnitInputValue}&limit=5`
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
		if (debouncedUserStaffUnitInputValue) {
			searchStaffUnitData(debouncedUserStaffUnitInputValue);
		} else {
			setUserStaffUnitOptions([]);
		}
	}, [debouncedUserStaffUnitInputValue]);

	const handleUserStaffUnitInputChange = newValue => {
		setUserStaffUnitInputValue(newValue);
	};

	const handleUserStaffUnitSelectChange = selectedOption => {
		setUserStaffUnitSelectedValue(selectedOption);
	};

	const isValid = () => {
		return (
			userSurname.trim() !== '' &&
			userName.trim() !== '' &&
			userPatronymic.trim() !== '' &&
			endDate.trim() !== '' &&
			startDate.trim() !== '' &&
			email.inputValid &&
			statusDate.id !== undefined &&
			selectedUserDivisionValue !== null &&
			selectedUserStaffUnitValue !== null
		);
	};
	const navigate = useNavigate();
	return (
		<div>
			<Drawer />
			<Header PageID={1} />
			<div className={style.organization_structure_create_user_container}>
				<div className={style.organization_structure_create_user_title_group}>
					<button
						className={
							style.organization_structure_create_user_title_group_button
						}
						onClick={() => navigate('/organization-structure')}
					>
						<img src='/img/arrow_back.svg' alt='arrow_back' />
						Назад
					</button>
					<h1 className={style.organization_structure_create_user_title}>
						Создание сотрудника
					</h1>
				</div>
				<div className={style.organization_structure_create_user_content}>
					<div
						className={
							style.organization_structure_create_user_description_group
						}
					>
						<h2 className={style.organization_structure_create_user_title_h2}>
							Фамилия
						</h2>
						<Input
							type='text'
							value={userSurname}
							onChange={e => setUserSurname(e.target.value)}
							placeholder='Введите фамилию'
						/>
					</div>
					<div
						className={
							style.organization_structure_create_user_description_group
						}
					>
						<h2 className={style.organization_structure_create_user_title_h2}>
							Имя
						</h2>
						<Input
							type='text'
							value={userName}
							onChange={e => setUserName(e.target.value)}
							placeholder='Введите имя'
						/>
					</div>
					<div
						className={
							style.organization_structure_create_user_description_group
						}
					>
						<h2 className={style.organization_structure_create_user_title_h2}>
							Отчество
						</h2>
						<Input
							type='text'
							value={userPatronymic}
							onChange={e => setUserPatronymic(e.target.value)}
							placeholder='Введите отчество'
						/>
					</div>
					<div
						className={
							style.organization_structure_create_user_description_group
						}
					>
						<h2 className={style.organization_structure_create_user_title_h2}>
							Email
						</h2>
						<Input
							type='text'
							// value={userEmail}
							// onChange={e => setUserEmail(e.target.value)}
							placeholder='Введите email'
							maxLength='41'
							onChange={e => {
								email.onChange(e);
								setErrorText('');
							}}
							onBlur={() => email.onBlur()}
							value={email.value}
							name='email'
							errorValidation={email.isDirty && email.emailError}
						/>
						{email.isDirty && email.emailError && (
							<div className={style.organization_structure_error__validation}>
								Почта должна содержать корпоративный домен
							</div>
						)}
					</div>
					<div
						className={
							style.organization_structure_create_user_description_group
						}
					>
						<h2 className={style.organization_structure_create_user_title_h2}>
							Статус
						</h2>
						<div>
							<Select
								classNamePrefix='custom-select'
								options={statusOptionsSelect}
								placeholder='Выберите статус'
								defaultValue={[
									{
										value: statusDate.id,
										label: statusDate.status_name,
									},
								]}
								onChange={onChangeStatusSelect}
								value={getStatus()}
							/>
						</div>
					</div>
					<div
						className={
							style.organization_structure_create_user_description_group
						}
					>
						<h2 className={style.organization_structure_create_user_title_h2}>
							Сроки назначения
						</h2>
						<div
							className={style.organization_structure_create_user_date_group}
						>
							<div
								className={
									style.organization_structure_create_user_date_start_group
								}
							>
								<h2
									className={style.organization_structure_create_user_title_h2}
								>
									Начальная дата
								</h2>
								<div
									className={
										style.organization_structure_create_user_date_start_input_container
									}
								>
									<input
										type='date'
										className={
											style.organization_structure_create_user_date_start_input
										}
										value={startDate}
										onChange={e => setStartDate(e.target.value)}
									/>
								</div>
							</div>
							<div
								className={style.organization_structure_create_user_date_line}
							>
								<img src='/img/date_line.svg' alt='date_line' />
							</div>
							<div
								className={
									style.organization_structure_create_user_date_end_group
								}
							>
								<h2
									className={style.organization_structure_create_user_title_h2}
								>
									Конечная дата
								</h2>
								<div
									className={
										style.organization_structure_create_user_date_end_input_container
									}
								>
									<input
										type='date'
										className={
											style.organization_structure_create_user_date_end_input
										}
										value={endDate}
										onChange={e => setEndDate(e.target.value)}
									/>
								</div>
							</div>
						</div>
					</div>
					<div
						className={
							style.organization_structure_create_user_description_group
						}
					>
						<h2 className={style.organization_structure_create_user_title_h2}>
							Подразделение
						</h2>
						<div>
							<Select
								classNamePrefix='custom-select'
								placeholder='Выберите подразделение'
								onChange={handleUserDivisionSelectChange}
								options={userDivisionOptions}
								onInputChange={handleUserDivisionInputChange}
								value={selectedUserDivisionValue}
							/>
						</div>
					</div>
					<div
						className={
							style.organization_structure_create_user_description_group
						}
					>
						<h2 className={style.organization_structure_create_user_title_h2}>
							Должность
						</h2>
						<div>
							<Select
								classNamePrefix='custom-select'
								placeholder='Выберите должность'
								onChange={handleUserStaffUnitSelectChange}
								options={userStaffUnitOptions}
								onInputChange={handleUserStaffUnitInputChange}
								value={selectedUserStaffUnitValue}
							/>
						</div>
					</div>
					{errorText !== '' && (
						<div className={style.organization_structure_error__validation}>
							{<p>{errorText}</p>}
						</div>
					)}
					<ul className={style.organization_structure_create_user_button_group}>
						<li>
							<button
								onClick={() => setShowConfirmationWindow(true)}
								className={
									style.organization_structure_create_user_button_affirmative
								}
								disabled={!isValid()}
							>
								Создать сотрудника
							</button>
						</li>
					</ul>
				</div>
			</div>
			{showConfirmationWindow && (
				<ConfirmationWindow
					setConfirmation={setConfirmation}
					setShowConfirmationWindow={setShowConfirmationWindow}
					confirmationWindowStyle={{ height: `100vh` }}
				/>
			)}
		</div>
	);
}
