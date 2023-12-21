import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

import { useDebounce } from '../../../hooks/UseDebounce';
import { Input } from '../../UI/Input';
import { ConfirmationWindow } from '../../ConfirmationWindow';
import { InputCheckbox } from '../../UI/InputCheckbox';

import style from './OrgStructureSidebarChildren.module.scss';

export function OrgStructureSidebarChildren({ children_ID, onClose }) {
	const [childrenData, setChildrenData] = useState([{}]);
	const [childrenName, setChildrenName] = useState();
	const [editingChildrenName, setEditingChildrenName] = useState();
	const [childrenStatus, setChildrenStatus] = useState();
	const [editingChildrenStatus, setEditingChildrenStatus] = useState();
	const [editingChildrenData, setEditingChildrenData] = useState(false);
		const [showConfirmationEditingWindow, setShowConfirmationEditingWindow] =
			useState(false);
		const [confirmationEditing, setConfirmationEditing] = useState();
		const [showConfirmationDeleteWindow, setShowConfirmationDeleteWindow] =
			useState(false);
		const [confirmationDelete, setConfirmationDelete] = useState();
	const [childrenParentDivision, setChildrenParentDivision] = useState({});
	const [editingChildrenParentDivision, setEditingChildrenParentDivision] =
		useState({});
	const [childrenHeadEmployee, setChildrenHeadEmployee] = useState({});
	const [editingChildrenHeadEmployee, setEditingChildrenHeadEmployee] =
		useState({});
	const [childrenParentDivisionOptions, setChildrenParentDivisionOptions] =
		useState([]);
	const [
		childrenParentDivisionInputValue,
		setChildrenParentDivisionInputValue,
	] = useState('');
	const [
		childrenParentDivisionSelectedValue,
		setChildrenParentDivisionSelectedValue,
	] = useState(null);
	const [childrenHeadEmployeeOptions, setChildrenHeadEmployeeOptions] =
		useState([]);
	const [childrenHeadEmployeeInputValue, setChildrenHeadEmployeeInputValue] =
		useState('');
	const [
		childrenHeadEmployeeSelectedValue,
		setChildrenHeadEmployeeSelectedValue,
	] = useState(null);
	useEffect(() => {
		const getChildrenData = async () => {
			try {
				const responseData = await axios.get(
					`http://localhost:8000/org/division/${children_ID}`,
					{
						withCredentials: true,
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				setChildrenData(responseData.data);
				setChildrenName(responseData.data.name);
				setEditingChildrenName(responseData.data.name);
				setChildrenStatus(responseData.data.status);
				setEditingChildrenStatus(responseData.data.status);
				setChildrenParentDivision(responseData.data.parent_division);
				setEditingChildrenParentDivision(responseData.data.parent_division);
				setChildrenHeadEmployee(responseData.data.head_employee);
				setEditingChildrenHeadEmployee(responseData.data.head_employee);
			} catch (err) {
				return;
			}
		};
		getChildrenData();
	}, [children_ID]);

	useEffect(() => {
		if (confirmationEditing) {
			editingDivision();
		} else if (confirmationEditing === false) {
			setShowConfirmationEditingWindow(false);
		}
	}, [confirmationEditing]);

	useEffect(() => {
		if (confirmationDelete) {
			deleteChildren();
		} else if (confirmationDelete === false) {
			setShowConfirmationDeleteWindow(false);
		}
	}, [confirmationDelete]);

	const editingDivision = async () => {
		try {
			const responseData = await axios.patch(
				`http://localhost:8000/org/division`,
				{
					id: `${children_ID}`,
					name: editingChildrenName,
					parent_division_id: childrenParentDivisionSelectedValue.value,
					head_employee_id: childrenHeadEmployeeSelectedValue.value,
					status: editingChildrenStatus,
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

	useEffect(() => {
		if (editingChildrenParentDivision !== null) {
			const initialChildrenParentDivisionSelectedValue = {
				value: editingChildrenParentDivision.id,
				label: editingChildrenParentDivision.name,
			};
			setChildrenParentDivisionSelectedValue(
				initialChildrenParentDivisionSelectedValue
			);
		} else setChildrenParentDivisionSelectedValue(null);
	}, [editingChildrenParentDivision]);

	const debouncedEditingChildrenParentDivisionInputValue = useDebounce(
		childrenParentDivisionInputValue,
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

			setChildrenParentDivisionOptions(transformedResponseData);
		} catch (error) {
			return;
		}
	};

	useEffect(() => {
		if (debouncedEditingChildrenParentDivisionInputValue) {
			searchDivisionData(debouncedEditingChildrenParentDivisionInputValue);
		} else {
			setChildrenParentDivisionOptions([]);
		}
	}, [debouncedEditingChildrenParentDivisionInputValue]);

	const handleChildrenParentDivisionInputChange = newValue => {
		setChildrenParentDivisionInputValue(newValue);
	};

	const handleChildrenParentDivisionSelectChange = selectedOption => {
		setChildrenParentDivisionSelectedValue(selectedOption);
		// setEditingUserStaffUnitSelectedValue(null);
	};

	useEffect(() => {
		if (editingChildrenHeadEmployee !== null) {
			const initialChildrenHeadEmployeeSelectedValue = {
				value: editingChildrenHeadEmployee.id,
				label: `${editingChildrenHeadEmployee.surname} ${editingChildrenHeadEmployee.name} ${editingChildrenHeadEmployee.patronymic}`,
			};
			setChildrenHeadEmployeeSelectedValue(
				initialChildrenHeadEmployeeSelectedValue
			);
		} else setChildrenHeadEmployeeSelectedValue(null);
	}, [editingChildrenHeadEmployee]);

	const debouncedEditingChildrenHeadEmployeeInputValue = useDebounce(
		childrenHeadEmployeeInputValue,
		100
	);

	const searchHeadEmployeeData = async userEmployeeInputValue => {
		try {
			const response = await axios.get(
				`http://localhost:8000/org/employee-search?term=${userEmployeeInputValue}&limit=5`
			);
			const responseData = response.data;
			const transformedResponseData = responseData.map(item => ({
				value: item.id,
				label: `${item.surname} ${item.name} ${item.patronymic}`,
			}));

			setChildrenHeadEmployeeOptions(transformedResponseData);
		} catch (error) {
			return;
		}
	};

	useEffect(() => {
		if (debouncedEditingChildrenHeadEmployeeInputValue) {
			searchHeadEmployeeData(debouncedEditingChildrenHeadEmployeeInputValue);
		} else {
			setChildrenHeadEmployeeOptions([]);
		}
	}, [debouncedEditingChildrenHeadEmployeeInputValue]);

	const handleChildrenHeadEmployeeInputChange = newValue => {
		setChildrenHeadEmployeeInputValue(newValue);
	};

	const handleChildrenHeadEmployeeSelectChange = selectedOption => {
		setChildrenHeadEmployeeSelectedValue(selectedOption);
		// setEditingUserStaffUnitSelectedValue(null);
	};

	const isValid = () => {
		return (
			editingChildrenName.trim() !== '' &&
			(editingChildrenStatus === false || editingChildrenStatus === true) &&
			editingChildrenParentDivision !== null &&
			childrenHeadEmployeeSelectedValue !== null
		);
	};

	const deleteChildren = async () => {
		try {
			const responseData = await axios.delete(
				`http://localhost:8000/org/division?division_id=${children_ID}`,
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
				{!editingChildrenData && (
					<div className={style.sidebar_content}>
						<div className={style.sidebar_title_group}>
							<h1 className={style.sidebar_title}>{childrenName} </h1>
							<button onClick={onClose}>
								<img src='/img/close_button.svg' alt='close_button' />
							</button>
						</div>
						<div className={style.sidebar_button_group}>
							<ul className={style.sidebar_button_group}>
								<li>
									<button
										onClick={() => setEditingChildrenData(true)}
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
					</div>
				)}
				{editingChildrenData && (
					<div className={style.sidebar_content}>
						<div className={style.sidebar_title_group}>
							<h1 className={style.sidebar_title}>
								Редактирование подразделения
							</h1>
							<button onClick={onClose}>
								<img src='/img/close_button.svg' alt='close_button' />
							</button>
						</div>
						<div className={style.sidebar_description_group}>
							<h2 className={style.sidebar_title_h2}>
								Родительское подразделения
							</h2>
							<div>
								<Select
									classNamePrefix='custom-select'
									placeholder='Выберите родительское подразделения'
									onChange={handleChildrenParentDivisionSelectChange}
									options={childrenParentDivisionOptions}
									onInputChange={handleChildrenParentDivisionInputChange}
									value={childrenParentDivisionSelectedValue}
								/>
							</div>
						</div>
						<div className={style.sidebar_description_group}>
							<h2 className={style.sidebar_title_h2}>Название подразделения</h2>
							<Input
								type='text'
								value={editingChildrenName}
								onChange={e => setEditingChildrenName(e.target.value)}
								placeholder='Введите название подразделения'
								maxLength='41'
							/>
						</div>
						<div className={style.sidebar_description_group}>
							<h2 className={style.sidebar_title_h2}>Статус подразделения</h2>
							<InputCheckbox
								type='checkbox'
								checked={editingChildrenStatus}
								onChange={() =>
									setEditingChildrenStatus(!editingChildrenStatus)
								}
							/>
						</div>
						<div className={style.sidebar_description_group}>
							<h2 className={style.sidebar_title_h2}>
								Руководитель подразделения
							</h2>
							<div>
								<Select
									classNamePrefix='custom-select'
									placeholder='Выберите руководителя подразделения'
									onChange={handleChildrenHeadEmployeeSelectChange}
									options={childrenHeadEmployeeOptions}
									onInputChange={handleChildrenHeadEmployeeInputChange}
									value={childrenHeadEmployeeSelectedValue}
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
									onClick={() => setEditingChildrenData(false)}
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
