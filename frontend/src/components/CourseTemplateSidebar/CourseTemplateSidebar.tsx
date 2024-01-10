import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

import style from './CourseTemplateSidebar.module.scss';

import { useDebounce } from '../../hooks/UseDebounce';
import { Input } from '../UI/Input';
import { ConfirmationWindow } from '../ConfirmationWindow';
import { Button } from '../../components/UI/Button';

export function CourseTemplateSidebar({ template_id = '', action, onClose }) {
	const [courseName, setCourseName] = useState('');
	const [typeDate, setTypeDate] = useState({});
	const [categoryDate, setCategoryDate] = useState({});
	const [courseDescription, setCourseDescription] = useState('');
	// const [courseCost, setCourseCost] = useState('');
	const [educationCenter, setEducationCenter] = useState('');
	const [courseEditingName, setCourseEditingName] = useState('');
	const [courseEditingDescription, setCourseEditingDescription] = useState('');
	// const [courseEditingCost, setCourseEditingCost] = useState('');
	const [editingEducationCenter, setEditingEducationCenter] = useState('');
	const [showConfirmationCreateWindow, setShowConfirmationCreateWindow] =
		useState(false);
	const [confirmationCreate, setConfirmationCreate] = useState();

	const [showConfirmationEditingWindow, setShowConfirmationEditingWindow] =
		useState(false);
	const [confirmationEditing, setConfirmationEditing] = useState();
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

	const objectTeachingInputAutoResize = event => {
		event.target.style.height = 'auto';
		event.target.style.height = `${event.target.scrollHeight}px`;
	};

	const isFormValid = () => {
		return (
			// courseCost.trim() !== '' &&
			courseName.trim() !== '' &&
			typeDate.id !== undefined &&
			categoryDate.id !== undefined &&
			courseDescription.trim() !== '' &&
			educationCenter.trim() !== ''
		);
	};

	const createCourseTemplate = async () => {
		try {
			const response = await axios.post(
				`http://localhost:8000/docs/course-template/create`,
				{
					title: courseName,
					description: courseDescription,
					// cost: courseCost,
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
		} catch (error) {
			return;
		}
	};

	const isEditingFormValid = () => {
		return (
			// courseEditingCost.trim() !== '' &&
			courseEditingName.trim() !== '' &&
			typeDate.id !== undefined &&
			categoryDate.id !== undefined &&
			courseEditingDescription.trim() !== '' &&
			editingEducationCenter.trim() !== ''
		);
	};

	const editingCourseTemplate = async () => {
		try {
			const response = await axios.post(
				`http://localhost:8000/docs/course-template/update`,
				{
					title: courseEditingName,
					description: courseEditingDescription,
					// cost: courseEditingCost,
					type: typeDate.id,
					category: categoryDate.id,
					education_center: editingEducationCenter,
					id: `${template_id}`,
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
			return;
		}
	};

	const [courseTemplateData, setCourseTemplateData] = useState([{}]);
	useEffect(() => {
		const getCourseTemplateData = async () => {
			if (template_id !== '') {
				try {
					const responseData = await axios.get(
						`http://localhost:8000/docs/course-template/${template_id}`,
						{
							withCredentials: true,
							headers: {
								'Content-Type': 'application/json',
							},
						}
					);
					setCourseTemplateData(responseData.data);
					setCourseEditingName(responseData.data.title);
					setCourseEditingDescription(responseData.data.description);
					// setCourseEditingCost(responseData.data.cost);
					setEditingEducationCenter(responseData.data.education_center);
					setTypeDate({
						id: responseData.data.type,
						type_name: responseData.data.type,
					});
					setCategoryDate({
						id: responseData.data.category,
						category_name: responseData.data.category,
					});
				} catch (err) {
					return;
				}
			}
		};
		getCourseTemplateData();
	}, [template_id]);

	useEffect(() => {
		if (confirmationCreate) {
			createCourseTemplate();
		} else if (confirmationCreate === false) {
			setShowConfirmationCreateWindow(false);
		}
	}, [confirmationCreate]);

	useEffect(() => {
		if (confirmationEditing) {
			editingCourseTemplate();
		} else if (confirmationEditing === false) {
			setShowConfirmationEditingWindow(false);
		}
	}, [confirmationEditing]);

	return (
		<div className={style.main}>
			<div className={style.sidebar_container}>
				{action === 'create' && (
					<div className={style.sidebar_content}>
						<div className={style.sidebar_title_group}>
							<h1 className={style.sidebar_title}>Новый курс</h1>
							<button onClick={onClose}>
								<img src='/img/close_button.svg' alt='close_button' />
							</button>
						</div>
						<form
							onSubmit={e => {
								e.preventDefault();
								setShowConfirmationCreateWindow(true);
							}}
						>
							<div className={style.sidebar_course_name}>
								<label className={style.sidebar_course_label}>
									Название курса
									<div
										className={
											courseName.trim() === ''
												? style.attention_figure
												: style.attention_figure_none
										}
									></div>
								</label>
								<div className={style.sidebar_course_name_input_container}>
									<input
										type='text'
										placeholder='Введите название курса'
										className={style.sidebar_course_info_input}
										value={courseName}
										onChange={e => setCourseName(e.target.value)}
									/>
								</div>
							</div>
							<ul className={style.sidebar_selector_course_info_container}>
								<li className={style.sidebar_course_info_type}>
									<div>
										<label className={style.sidebar_course_label}>
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
											className={style.sidebar_course_type_selector_container}
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
								<li className={style.sidebar_course_info_category}>
									<div>
										<label className={style.sidebar_course_label}>
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
												style.sidebar_course_category_selector_container
											}
										>
											<Select
												classNamePrefix='custom-select'
												options={categoryOptionsSelect}
												placeholder='Выберите категорию курса'
												onChange={onChangeCategorySelect}
												value={getCategory()}
											/>
										</div>
									</div>
								</li>
							</ul>
							<div className={style.sidebar_course_description_container}>
								<label className={style.sidebar_course_label}>
									Описание курса
									<div
										className={
											courseDescription.trim() === ''
												? style.attention_figure
												: style.attention_figure_none
										}
									></div>
								</label>
								<div>
									<textarea
										placeholder='Введите описание курса'
										className={style.sidebar_course_info_input}
										value={courseDescription}
										onChange={e => setCourseDescription(e.target.value)}
										onInput={objectTeachingInputAutoResize}
									></textarea>
								</div>
							</div>
							<div className={style.sidebar_course_education_center}>
								<label className={style.sidebar_course_label}>
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
									className={
										style.sidebar_course_education_center_input_container
									}
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
							{/* <div className={style.sidebar_course_price}>
								<label className={style.sidebar_course_label}>
									Стоимость обучения
									<div
										className={
											courseCost.trim() === ''
												? style.attention_figure
												: style.attention_figure_none
										}
									></div>
								</label>
								<div className={style.sidebar_course_price_input_container}>
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
							</div> */}
							<div className={style.sidebar_course_button_container}>
								<div className={style.sidebar_course_button_submit_container}>
									<Button disabled={!isFormValid()} type='submit'>
										Создать
									</Button>
								</div>
								<button
									className={style.sidebar_course_button_cancel}
									type='button'
									onClick={onClose}
								>
									Отменить
								</button>
							</div>
						</form>
					</div>
				)}
				{action === 'editing' && (
					<div className={style.sidebar_content}>
						<div className={style.sidebar_title_group}>
							<h1 className={style.sidebar_title}>Редактирование курса</h1>
							<button onClick={onClose}>
								<img src='/img/close_button.svg' alt='close_button' />
							</button>
						</div>
						<form
							onSubmit={e => {
								e.preventDefault();
								setShowConfirmationEditingWindow(true);
							}}
						>
							<div className={style.sidebar_course_name}>
								<label className={style.sidebar_course_label}>
									Название курса
									<div
										className={
											courseEditingName.trim() === ''
												? style.attention_figure
												: style.attention_figure_none
										}
									></div>
								</label>
								<div className={style.sidebar_course_name_input_container}>
									<input
										type='text'
										placeholder='Введите название курса'
										className={style.sidebar_course_info_input}
										value={courseEditingName}
										onChange={e => setCourseEditingName(e.target.value)}
									/>
								</div>
							</div>
							<ul className={style.sidebar_selector_course_info_container}>
								<li className={style.sidebar_course_info_type}>
									<div>
										<label className={style.sidebar_course_label}>
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
											className={style.sidebar_course_type_selector_container}
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
								<li className={style.sidebar_course_info_category}>
									<div>
										<label className={style.sidebar_course_label}>
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
												style.sidebar_course_category_selector_container
											}
										>
											<Select
												classNamePrefix='custom-select'
												options={categoryOptionsSelect}
												placeholder='Выберите категорию курса'
												onChange={onChangeCategorySelect}
												value={getCategory()}
											/>
										</div>
									</div>
								</li>
							</ul>
							<div className={style.sidebar_course_description_container}>
								<label className={style.sidebar_course_label}>
									Описание курса
									<div
										className={
											courseEditingDescription.trim() === ''
												? style.attention_figure
												: style.attention_figure_none
										}
									></div>
								</label>
								<div>
									<textarea
										placeholder='Введите описание курса'
										className={style.sidebar_course_info_input}
										value={courseEditingDescription}
										onChange={e => setCourseEditingDescription(e.target.value)}
										onInput={objectTeachingInputAutoResize}
									></textarea>
								</div>
							</div>
							<div className={style.sidebar_course_education_center}>
								<label className={style.sidebar_course_label}>
									Центр обучения
									<div
										className={
											editingEducationCenter.trim() === ''
												? style.attention_figure
												: style.attention_figure_none
										}
									></div>
								</label>
								<div
									className={
										style.sidebar_course_education_center_input_container
									}
								>
									<input
										type='text'
										placeholder='Введите центр обучения'
										className={style.sidebar_course_info_input}
										value={editingEducationCenter}
										onChange={e => setEditingEducationCenter(e.target.value)}
									/>
								</div>
							</div>
							{/* <div className={style.sidebar_course_price}>
								<label className={style.sidebar_course_label}>
									Стоимость обучения
									<div
										className={
											courseCost.trim() === ''
												? style.attention_figure
												: style.attention_figure_none
										}
									></div>
								</label>
								<div className={style.sidebar_course_price_input_container}>
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
							</div> */}
							<div className={style.sidebar_course_button_container}>
								<div className={style.sidebar_course_button_submit_container}>
									<Button disabled={!isEditingFormValid()} type='submit'>
										Сохранить изменения
									</Button>
								</div>
								<button
									className={style.sidebar_course_button_cancel}
									type='button'
									onClick={onClose}
								>
									Отменить
								</button>
							</div>
						</form>
					</div>
				)}
				{action === 'view' && (
					<div className={style.sidebar_content}>
						<div className={style.sidebar_title_group}>
							<h1 className={style.sidebar_title}>
								{courseTemplateData.title}
							</h1>
							<button onClick={onClose}>
								<img src='/img/close_button.svg' alt='close_button' />
							</button>
						</div>
						<ul className={style.sidebar_selector_course_info_container}>
							<li className={style.sidebar_course_info_type}>
								<div>
									<label className={style.sidebar_course_label_view}>
										Тип курса
									</label>
									<div className={style.sidebar_course_type_selector_container}>
										{courseTemplateData.type}
									</div>
								</div>
							</li>
							<li className={style.sidebar_course_info_category}>
								<div>
									<label className={style.sidebar_course_label_view}>
										Категория курса
									</label>
									<div
										className={style.sidebar_course_category_selector_container}
									>
										{courseTemplateData.category}
									</div>
								</div>
							</li>
						</ul>
						<div className={style.sidebar_course_description_container}>
							<label className={style.sidebar_course_label_view}>
								Описание курса
							</label>
							<div className={style.sidebar_course_description_view_container}>
								{courseTemplateData.description}
							</div>
						</div>
						<div className={style.sidebar_course_education_center}>
							<label className={style.sidebar_course_label_view}>
								Центр обучения
							</label>
							<div
								className={style.sidebar_course_education_center_view_container}
							>
								{courseTemplateData.education_center}
							</div>
						</div>
						{/* <div className={style.sidebar_course_price}>
							<label className={style.sidebar_course_label_view}>
								Стоимость обучения
							</label>
							<div className={style.sidebar_course_price_view_container}>
								{courseTemplateData.price}
							</div>
						</div> */}
					</div>
				)}
			</div>
			{showConfirmationEditingWindow && (
				<ConfirmationWindow
					setConfirmation={setConfirmationEditing}
					setShowConfirmationWindow={setShowConfirmationEditingWindow}
				/>
			)}
			{/* {showConfirmationDeleteWindow && (
				<ConfirmationWindow
					setConfirmation={setConfirmationDelete}
					setShowConfirmationWindow={setShowConfirmationDeleteWindow}
				/>
			)} */}
			{showConfirmationCreateWindow && (
				<ConfirmationWindow
					setConfirmation={setConfirmationCreate}
					setShowConfirmationWindow={setShowConfirmationCreateWindow}
				/>
			)}
		</div>
	);
}
