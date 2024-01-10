import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import style from './Administration.module.scss';

import { Drawer } from '../../components/Drawer';
import { Header } from '../../components/Header';
import { ConfirmationWindow } from '../../components/ConfirmationWindow';
import { CourseTemplateSidebar } from '../../components/CourseTemplateSidebar';

export function Administration() {
	const [currentNavPage, setCurrentNavPage] = useState('Шаблоны курсов');
	const [showConfirmationDeleteWindow, setShowConfirmationDeleteWindow] =
		useState(false);
	const [confirmationDelete, setConfirmationDelete] = useState();
	const [courseTemplateData, setCourseTemplateData] = useState([]);
	const [currentCourseTemplateID, setCurrentCourseTemplateID] = useState();
	const getCourseTemplateRef = useRef();
	const [showActionButtonCourseTemplate, setShowActionButtonCourseTemplate] =
		useState();
	const [showActionButton, setShowActionButton] = useState(false);
	const [showSidebar, setShowSidebar] = useState(false);
	const [sidebarAction, setSidebarAction] = useState('');
	const [templateID, setTemplateID] = useState('');
	const [isAdmin, setIsAdmin] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await axios.get(`http://localhost:8000/users/me`, {
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				});

				if (response.data.role.id === 2) {
					setIsAdmin(true);
				} else {
					setIsAdmin(false);
				}
			} catch (error) {
				setIsAdmin(false);
			} finally {
				setLoading(false); // Устанавливаем loading в false после получения ответа (в любом случае)
			}
		}
		fetchData();
	}, []);

	const handleExport = event => {
		axios
			.post(
				'http://localhost:8000/document-report/courses',
				{},
				{
					withCredentials: true,
					responseType: 'blob',
				}
			)
			.then(response => {
				let fileName = `Report ${new Date(Date.now()).toLocaleString()}.xlsx`;
				const url = window.URL.createObjectURL(response.data);
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', fileName);
				document.body.appendChild(link);
				link.click();
				link.remove();
			});
	};

	useEffect(() => {
		const getCourseTemplateData = async () => {
			if (!loading && isAdmin) {
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
					setCourseTemplateData(response.data);
					getCourseTemplateRef.current = getCourseTemplateData;
				} catch (error) {
					setCourseTemplateData(null);
				}
			}
		};
		getCourseTemplateData();
	}, [loading]);

	useEffect(() => {
		if (confirmationDelete) {
			deleteAdministrationCourseTemplate();
		} else if (confirmationDelete === false) {
			setShowConfirmationDeleteWindow(false);
		}
	}, [confirmationDelete]);

	const deleteAdministrationCourseTemplate = async () => {
		try {
			const responseData = await axios.delete(
				`http://localhost:8000/docs/course-template/delete?template_id=${currentCourseTemplateID}`,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			if (getCourseTemplateRef.current) {
				getCourseTemplateRef.current();
			}
			setConfirmationDelete(false);
		} catch (err) {
			return;
		}
	};

	return (
		<div>
			<Drawer />
			{showSidebar && (
				<CourseTemplateSidebar
					template_id={templateID}
					action={sidebarAction}
					onClose={() => setShowSidebar(false)}
				/>
			)}
			<Header PageID={3} />
			{!loading && !isAdmin && (
				<div className={style.administration_container}>
					<h1 className={style.administration_title}>
						Вы не являетесь администратором
					</h1>
				</div>
			)}
			{!loading && isAdmin && (
				<div className={style.administration_container}>
					<div>
						<div className={style.administration_title_container}>
							<h1 className={style.administration_title}>Администрирование</h1>
							<div>
								<ul className={style.administration_navigate_button_container}>
									<li>
										<button
											onClick={() => setCurrentNavPage('Шаблоны курсов')}
											className={
												currentNavPage === 'Шаблоны курсов'
													? style.administration_navigate_button_active
													: style.administration_navigate_button
											}
										>
											Шаблоны курсов
										</button>
									</li>
									{/* <li>
									<button
										onClick={() => {
											setCurrentNavPage('Должности');
											// getStagesResponsibleData(
											// 	courseData.manager_id,
											// 	courseData.director_id,
											// 	courseData.administrator_id
											// );
										}}
										className={
											currentNavPage === 'Должности'
												? style.administration_navigate_button_active
												: style.administration_navigate_button
										}
									>
										Должности
									</button>
								</li> */}
									<li>
										<button
											onClick={() => {
												setCurrentNavPage('Экспорт отчётов');
												// getMemberData(courseData.members_id);
											}}
											className={
												currentNavPage === 'Экспорт отчётов'
													? style.administration_navigate_button_active
													: style.administration_navigate_button
											}
										>
											Экспорт отчётов
										</button>
									</li>
								</ul>
							</div>
						</div>
						{currentNavPage === 'Шаблоны курсов' && (
							<div>
								<div
									className={
										style.administration_course_template_create_button_container
									}
								>
									<button
										className={
											style.administration_course_template_create_button
										}
										onClick={() => {
											setShowSidebar(true);
											setSidebarAction('create');
											setTemplateID('');
										}}
									>
										<img src='/img/add_gray.svg' alt='add' />
										Добавить
									</button>
								</div>
								<div className={style.administration_table_container}>
									<table
										className={style.administration_table}
										cellPadding={0}
										cellSpacing={0}
									>
										<thead>
											<tr className={style.administration_table_column}>
												<td className={style.administration_table_column_title}>
													<p>Название курса</p>
												</td>
												{/* <td
												className={style.administration_table_column_create_date_title}
											>
												<p>Дата создания</p>
											</td> */}
												<td
													className={style.administration_table_column_action}
												>
													{/* <p>Действия</p> */}
												</td>
											</tr>
										</thead>
										{courseTemplateData !== null &&
											courseTemplateData.map(data => (
												<tr
													className={style.administration_table_content}
													onMouseEnter={() => {
														setShowActionButton(true);
														setShowActionButtonCourseTemplate(data.id);
													}}
													onMouseLeave={() => setShowActionButton(false)}
												>
													<td
														className={style.administration_table_column_title}
														onClick={() => {
															setShowSidebar(true);
															setSidebarAction('view');
															setTemplateID(data.id);
														}}
													>
														<p>{data.title}</p>
													</td>
													{/* <td
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
												</td> */}
													<td
														className={style.administration_table_column_action}
													>
														<div>
															{showActionButton &&
																showActionButtonCourseTemplate === data.id && (
																	<ul
																		className={
																			style.administration_table_action_button_container
																		}
																	>
																		<li>
																			<button
																				className={
																					style.administration_table_action_button
																				}
																				onClick={() => {
																					setShowSidebar(true);
																					setSidebarAction('editing');
																					setTemplateID(data.id);
																				}}
																			>
																				<img src='/img/edit.svg' alt='edit' />
																			</button>
																		</li>
																		<li>
																			<button
																				className={
																					style.administration_table_action_button
																				}
																				onClick={() => {
																					setCurrentCourseTemplateID(data.id);
																					setShowConfirmationDeleteWindow(true);
																				}}
																			>
																				<img
																					src='/img/delete.svg'
																					alt='delete'
																				/>
																			</button>
																		</li>
																	</ul>
																)}
														</div>
													</td>
												</tr>
											))}
									</table>
									{courseTemplateData === null && (
										<h2 className={style.administration_title_h2_error}>
											Нет данных
										</h2>
									)}
								</div>
							</div>
						)}
						{currentNavPage === 'Экспорт отчётов' && (
							<div className={style.administration_upload_button_container}>
								<p className={style.administration_upload_title}>
									Отчет по заявкам на обучение
								</p>
								<button
									className={style.administration_upload_button}
									onClick={handleExport}
								>
									<img
										src='/img/file_upload.svg'
										alt='file_upload'
										className={style.administration_upload_button_img}
									/>
									Экспорт
								</button>
							</div>
						)}
					</div>
				</div>
			)}

			{showConfirmationDeleteWindow && (
				<ConfirmationWindow
					setConfirmation={setConfirmationDelete}
					setShowConfirmationWindow={setShowConfirmationDeleteWindow}
					confirmationWindowStyle={{ height: `100vh` }}
				/>
			)}
		</div>
	);
}
