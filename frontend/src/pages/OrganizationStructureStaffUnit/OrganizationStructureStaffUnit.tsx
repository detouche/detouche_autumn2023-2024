import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import Select from 'react-select';

import style from './OrganizationStructureStaffUnit.module.scss';

import { Drawer } from '../../components/Drawer';
import { Header } from '../../components/Header';
import { useDebounce } from '../../hooks/UseDebounce';
import { Input } from '../../components/UI/Input';
import { ConfirmationWindow } from '../../components/ConfirmationWindow';

export function OrganizationStructureStaffUnit() {
	const [staffUnitDivisionOptions, setStaffUnitDivisionOptions] = useState([]);
	const [staffUnitDivisionInputValue, setStaffUnitDivisionInputValue] =
		useState('');
	const [selectedStaffUnitDivisionValue, setStaffUnitDivisionSelectedValue] =
		useState(null);
	const [staffUnitName, setStaffUnitName] = useState('');
	const [showConfirmationCreateWindow, setShowConfirmationCreateWindow] =
		useState(false);
	const [confirmationCreate, setConfirmationCreate] = useState();
	const [showConfirmationDeleteWindow, setShowConfirmationDeleteWindow] =
		useState(false);
	const [confirmationDelete, setConfirmationDelete] = useState();
	const [showConfirmationEditingWindow, setShowConfirmationEditingWindow] =
		useState(false);
	const [confirmationEditing, setConfirmationEditing] = useState();
	const [staffUniteData, setStaffUniteData] = useState([]);
	const [currentStaffUnitID, setCurrentStaffUnitID] = useState();
	const getStaffUniteDataRef = useRef();
	const [editingStaffUniteDate, setEditingStaffUniteDate] = useState([]);
	const [currentEditingStaffUnitID, setCurrentEditingStaffUnitID] = useState();

	const debouncedStaffUnitDivisionInputValue = useDebounce(
		staffUnitDivisionInputValue,
		100
	);

	useEffect(() => {
		const getStaffUniteData = async () => {
			try {
				const response = await axios.get(
					`http://localhost:8000/org/staff-unit/all/${selectedStaffUnitDivisionValue.value}`,
					{
						withCredentials: true,
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				setStaffUniteData(response.data);
				setEditingStaffUniteDate(response.data);
				getStaffUniteDataRef.current = getStaffUniteData;
			} catch (error) {
				setStaffUniteData(null);
			}
		};
		getStaffUniteData();
	}, [selectedStaffUnitDivisionValue]);

	useEffect(() => {
		if (debouncedStaffUnitDivisionInputValue) {
			searchDivisionData(debouncedStaffUnitDivisionInputValue);
		} else {
			setStaffUnitDivisionOptions([]);
		}
	}, [debouncedStaffUnitDivisionInputValue]);

	const handleStaffUnitDivisionInputChange = newValue => {
		setStaffUnitDivisionInputValue(newValue);
	};

	const handleStaffUnitDivisionSelectChange = selectedOption => {
		setStaffUnitDivisionSelectedValue(selectedOption);
	};

	const searchDivisionData = async staffUnitDivisionInputValue => {
		try {
			const response = await axios.get(
				`http://localhost:8000/org/division-search?term=${staffUnitDivisionInputValue}&limit=5`
			);
			const responseData = response.data;

			const transformedResponseData = responseData.map(item => ({
				value: item.id,
				label: item.name,
			}));

			setStaffUnitDivisionOptions(transformedResponseData);
		} catch (error) {
			return;
		}
	};

	useEffect(() => {
		if (confirmationCreate) {
			createStaffUnit();
		} else if (confirmationCreate === false) {
			setShowConfirmationCreateWindow(false);
		}
	}, [confirmationCreate]);

	useEffect(() => {
		if (confirmationDelete) {
			deleteStaffUnit();
		} else if (confirmationDelete === false) {
			setShowConfirmationDeleteWindow(false);
		}
	}, [confirmationDelete]);

	useEffect(() => {
		if (confirmationEditing) {
			editingStaffUnit();
		} else if (confirmationEditing === false) {
			setShowConfirmationEditingWindow(false);
		}
	}, [confirmationEditing]);

	const createStaffUnit = async () => {
		try {
			const responseData = await axios.post(
				`http://localhost:8000/org/staff-unit`,
				{
					division_id: selectedStaffUnitDivisionValue.value,
					staff_unit_name: staffUnitName,
				},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			if (getStaffUniteDataRef.current) {
				getStaffUniteDataRef.current();
			}
			setStaffUnitName('');
			setConfirmationCreate(false);
		} catch (err) {
			return;
		}
	};

	const editingStaffUnit = async () => {
		try {
			const responseData = await axios.patch(
				`http://localhost:8000/org/staff-unit`,
				{
					id: currentStaffUnitID,
					name: editingStaffUniteDate.find(
						item => item.id === currentStaffUnitID
					).name,
					division_id: selectedStaffUnitDivisionValue.value,
				},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			if (getStaffUniteDataRef.current) {
				getStaffUniteDataRef.current();
			}
			setConfirmationEditing(false);
			setCurrentEditingStaffUnitID("");
		} catch (err) {
			return;
		}
	};

	const deleteStaffUnit = async () => {
		try {
			const responseData = await axios.delete(
				`http://localhost:8000/org/staff-unit?staff_unit_id=${currentStaffUnitID}`,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			if (getStaffUniteDataRef.current) {
				getStaffUniteDataRef.current();
			}
			setConfirmationDelete(false);
		} catch (err) {
			return;
		}
	};

	return (
		<div>
			<Drawer />
			<Header />
			<div className={style.organization_structure_staff_unit_container}>
				<h1 className={style.organization_structure_staff_unit_title}>
					Должности
				</h1>
				<div
					className={style.organization_structure_staff_unit_description_group}
				>
					<h2 className={style.organization_structure_staff_unit_title_h2}>
						Подразделение
					</h2>
					<div>
						<Select
							classNamePrefix='custom-select'
							placeholder='Выберите подразделение'
							onChange={handleStaffUnitDivisionSelectChange}
							options={staffUnitDivisionOptions}
							onInputChange={handleStaffUnitDivisionInputChange}
							value={selectedStaffUnitDivisionValue}
						/>
					</div>
				</div>
				{selectedStaffUnitDivisionValue !== null && (
					<div>
						<div
							className={
								style.organization_structure_staff_unit_description_group
							}
						>
							<h2 className={style.organization_structure_staff_unit_title_h2}>
								Название должности
							</h2>
							<Input
								type='text'
								value={staffUnitName}
								onChange={e => setStaffUnitName(e.target.value)}
								placeholder='Введите название должности'
								maxLength='41'
							/>
							<div
								className={style.organization_structure_staff_unit_button_group}
							>
								<button
									onClick={() => setShowConfirmationCreateWindow(true)}
									className={
										style.organization_structure_staff_unit_button_affirmative
									}
									disabled={staffUnitName.trim() === ''}
								>
									Создать должность
								</button>
							</div>
						</div>
						<div
							className={
								style.organization_structure_staff_unit_description_group
							}
						>
							<h2 className={style.organization_structure_staff_unit_title_h2}>
								Таблица должностей
							</h2>
							<div className={style.staff_unit_table_container}>
								<table
									className={style.staff_unit_table}
									cellPadding={0}
									cellSpacing={0}
								>
									<thead>
										<tr className={style.staff_unit_table_column}>
											<td className={style.staff_unit_table_column_title}>
												<p>Название должности</p>
											</td>
											<td
												className={style.staff_unit_table_column_division_title}
											>
												<p>Название подразделения</p>
											</td>
											<td className={style.staff_unit_table_column_action}>
												<p>Действия</p>
											</td>
										</tr>
									</thead>
									{staffUniteData !== null &&
										staffUniteData.map(data => (
											<tr className={style.staff_unit_table_content}>
												<td className={style.staff_unit_table_column_title}>
													{!(currentEditingStaffUnitID === data.id) ? (
														<p>{data.name}</p>
													) : (
														<input
															type='text'
															value={
																editingStaffUniteDate.find(
																	item => item.id === data.id
																).name
															}
															onChange={e => {
																const editingStaffUniteName =
																	editingStaffUniteDate.map(item => {
																		if (item.id === currentEditingStaffUnitID) {
																			return { ...item, name: e.target.value };
																		}
																		return item;
																	});
																setEditingStaffUniteDate(editingStaffUniteName);
															}}
															placeholder='Введите название должности'
															className={style.staff_unit_table_column_title_input}
														/>
													)}
												</td>
												<td
													className={
														style.staff_unit_table_column_division_title
													}
												>
													{!(currentEditingStaffUnitID === data.id) ? (
														<p>{data.division.name}</p>
													) : (
														<p>
															{
																editingStaffUniteDate.find(
																	item => item.id === data.id
																).division.name
															}
														</p>
													)}
												</td>
												<td className={style.staff_unit_table_column_action}>
													{!(currentEditingStaffUnitID === data.id) ? (
														<ul
															className={
																style.staff_unit_table_action_button_container
															}
														>
															<li>
																<button
																	className={
																		style.staff_unit_table_action_button
																	}
																	onClick={() => {
																		setCurrentEditingStaffUnitID(data.id);
																	}}
																>
																	<img src='/img/edit.svg' alt='edit' />
																</button>
															</li>
															<li>
																<button
																	className={
																		style.staff_unit_table_action_button
																	}
																	onClick={() => {
																		setCurrentStaffUnitID(data.id);
																		setShowConfirmationDeleteWindow(true);
																	}}
																>
																	<img src='/img/delete.svg' alt='delete' />
																</button>
															</li>
														</ul>
													) : (
														<ul
															className={
																style.staff_unit_table_action_button_container
															}
														>
															<li>
																<button
																	className={
																		style.staff_unit_table_action_button
																	}
																	onClick={() => {
																		setCurrentStaffUnitID(data.id);
																		setShowConfirmationEditingWindow(true);
																	}}
																>
																	<img src='/img/accept.svg' alt='accept' />
																</button>
															</li>
															<li>
																<button
																	className={
																		style.staff_unit_table_action_button
																	}
																	onClick={() =>
																		setCurrentEditingStaffUnitID('')
																	}
																>
																	<img src='/img/clear.svg' alt='clear' />
																</button>
															</li>
														</ul>
													)}
												</td>
											</tr>
										))}
								</table>
								{staffUniteData === null && (
									<div>
										<h2 className={style.staff_unit_title_h2_error}>
											Нет данных
										</h2>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
			{showConfirmationCreateWindow && (
				<ConfirmationWindow
					setConfirmation={setConfirmationCreate}
					setShowConfirmationWindow={setShowConfirmationCreateWindow}
				/>
			)}
			{showConfirmationDeleteWindow && (
				<ConfirmationWindow
					setConfirmation={setConfirmationDelete}
					setShowConfirmationWindow={setShowConfirmationDeleteWindow}
				/>
			)}
			{showConfirmationEditingWindow && (
				<ConfirmationWindow
					setConfirmation={setConfirmationEditing}
					setShowConfirmationWindow={setShowConfirmationEditingWindow}
				/>
			)}
		</div>
	);
}
