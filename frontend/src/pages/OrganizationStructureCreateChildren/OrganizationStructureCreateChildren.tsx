import axios from 'axios';
import { useState, useEffect } from 'react';
import Select from 'react-select';

import style from './OrganizationStructureCreateChildren.module.scss';

import { Drawer } from '../../components/Drawer';
import { Header } from '../../components/Header';
import { useDebounce } from '../../hooks/UseDebounce';
import { Input } from '../../components/UI/Input';
import { InputCheckbox } from '../../components/UI/InputCheckbox';
import { ConfirmationWindow } from '../../components/ConfirmationWindow';

export function OrganizationStructureCreateChildren() {
	const [childrenName, setChildrenName] = useState('');
	const [childrenStatus, setChildrenStatus] = useState(true);
	const [showConfirmationWindow, setShowConfirmationWindow] = useState(false);
	const [confirmation, setConfirmation] = useState();
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

	useEffect(() => {
		if (confirmation) {
			createDivision();
		} else if (confirmation === false) {
			setShowConfirmationWindow(false);
		}
	}, [confirmation]);

	const createDivision = async () => {
		try {
			const responseData = await axios.post(
				`http://localhost:8000/org/division`,
				{
					name: childrenName,
					parent_division_id: childrenParentDivisionSelectedValue.value,
					status: childrenStatus,
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
	};

	const isValid = () => {
		return (
			childrenName.trim() !== '' &&
			(childrenStatus === false || childrenStatus === true) &&
			childrenParentDivisionSelectedValue !== null
		);
	};
	return (
		<div>
			<Drawer />
			<Header />
			<div className={style.organization_structure_create_children_container}>
				<div>
					<div className={style.organization_structure_create_children_content}>
						<div className={style.organization_structure_create_children_title_group}>
							<h1 className={style.organization_structure_create_children_title}>Создание подразделения</h1>
						</div>
						<div className={style.organization_structure_create_children_description_group}>
							<h2 className={style.organization_structure_create_children_title_h2}>
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
						<div className={style.organization_structure_create_children_description_group}>
							<h2 className={style.organization_structure_create_children_title_h2}>Название подразделения</h2>
							<Input
								type='text'
								value={childrenName}
								onChange={e => setChildrenName(e.target.value)}
								placeholder='Введите название подразделения'
								maxLength='41'
							/>
						</div>
						<div className={style.organization_structure_create_children_description_group}>
							<h2 className={style.organization_structure_create_children_title_h2}>Статус подразделения</h2>
							<InputCheckbox
								type='checkbox'
								checked={childrenStatus}
								onChange={() => setChildrenStatus(!childrenStatus)}
							/>
						</div>
						<ul className={style.organization_structure_create_children_button_group}>
							<li>
								<button
									onClick={() => setShowConfirmationWindow(true)}
									className={style.organization_structure_create_children_button_affirmative}
									disabled={!isValid()}
								>
									Создать подразделение
								</button>
							</li>
						</ul>
					</div>
				</div>
				{showConfirmationWindow && (
					<ConfirmationWindow
						setConfirmation={setConfirmation}
						setShowConfirmationWindow={setShowConfirmationWindow}
					/>
				)}
			</div>
		</div>
	);
}
