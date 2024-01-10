import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import style from './OrganizationStructure.module.scss';

import { Drawer } from '../../components/Drawer';
import { Header } from '../../components/Header';
import { OrgStructureSidebarChildren } from '../../components/OrgStructureSidebar/OrgStructureSidebarChildren';
import { OrgStructureSidebarUser } from '../../components/OrgStructureSidebar/OrgStructureSidebarUser';

export function OrganizationStructure() {
	const [treeData, setTreeData] = useState([{}]);
	const [showChildrenSidebar, setShowChildrenSidebar] = useState(false);
	const [showUserSidebar, setShowUserSidebar] = useState(false);
	const [nodeElementID, setNodeElementID] = useState(0);
	const [selectedFile, setSelectedFile] = useState(null);
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
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	const navigate = useNavigate();

	const handleFileChange = file => {
		setSelectedFile(file);
	};

	const handleExport = event => {
		axios
			.get('http://localhost:8000/org/structure-export', {
				withCredentials: true,
				responseType: 'blob',
			})
			.then(response => {
				let fileName = `OrgStructure ${new Date(
					Date.now()
				).toLocaleString()}.xlsx`;
				const url = window.URL.createObjectURL(response.data);
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', fileName);
				document.body.appendChild(link);
				link.click();
				link.remove();
			});
	};

	const openChildrenSidebar = children_ID => {
		setNodeElementID(children_ID);
		setShowUserSidebar(false);
		setShowChildrenSidebar(true);
	};

	const openUserSidebar = user_ID => {
		setNodeElementID(user_ID);
		setShowChildrenSidebar(false);
		setShowUserSidebar(true);
	};

	useEffect(() => {
		const getTree = async () => {
			try {
				const responseData = await axios.get(
					`http://localhost:8000/org/get-tree`,
					{
						withCredentials: true,
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				if (Object.keys(responseData).length === 0) {
					setTreeData(null);
				} else {
					setTreeData([responseData.data]);
				}
			} catch (err) {
				setTreeData(null);
			}
		};
		getTree();
	}, []);
	return (
		<div>
			<Drawer />
			{showChildrenSidebar && (
				<OrgStructureSidebarChildren
					children_ID={nodeElementID}
					onClose={() => setShowChildrenSidebar(false)}
					isAdmin={isAdmin}
				/>
			)}
			{showUserSidebar && (
				<OrgStructureSidebarUser
					user_ID={nodeElementID}
					onClose={() => setShowUserSidebar(false)}
					isAdmin={isAdmin}
				/>
			)}
			<Header PageID={1} />
			{!loading && (
				<div className={style.organization_structure_container}>
					<div className={style.organization_structure_title_container}>
						<h1 className={style.organization_structure_title}>
							Структура организации
						</h1>
						{isAdmin && (
							<div
								className={style.organization_structure_file_button_container}
							>
								<div
									className={
										style.organization_structure_file_download_button_container
									}
								>
									<CustomFileInput onChange={handleFileChange} />
								</div>
								<div
									className={
										style.organization_structure_file_upload_button_container
									}
								>
									<button
										className={style.organization_structure_file_upload_button}
										onClick={handleExport}
									>
										<img src='/img/file_upload.svg' alt='file_upload' />
										Экспорт
									</button>
								</div>
							</div>
						)}
					</div>
					{isAdmin && (
						<ul className={style.organization_structure_action_button_group}>
							<li
								className={style.organization_structure_action_button_container}
							>
								<button
									className={style.organization_structure_action_button}
									onClick={() =>
										navigate('/organization-structure-create-user')
									}
								>
									<img src='/img/add_black.svg' alt='add' />
									Добавить сотрудника
								</button>
							</li>
							<li
								className={style.organization_structure_action_button_container}
							>
								<button
									className={style.organization_structure_action_button}
									onClick={() =>
										navigate('/organization-structure-create-children')
									}
								>
									<img src='/img/add_black.svg' alt='add' />
									Добавить подразделение
								</button>
							</li>
							<li
								className={style.organization_structure_action_button_container}
							>
								<button
									className={style.organization_structure_action_button}
									onClick={() => navigate('/organization-structure-staff-unit')}
								>
									<img src='/img/assignment_ind.svg' alt='assignment_ind' />
									Должности
								</button>
							</li>
						</ul>
					)}
					<div className={style.organization_structure_tree_container}>
						{treeData !== null ? (
							<Tree
								treeData={treeData}
								openChildrenSidebar={openChildrenSidebar}
								openUserSidebar={openUserSidebar}
							/>
						) : (
							<h2 className={style.organization_structure_title_h2_error}>
								Нет данных
							</h2>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

function Tree({
	employees = null,
	treeData = null,
	openChildrenSidebar,
	openUserSidebar,
}) {
	return (
		<ul>
			{treeData !== null &&
				treeData.map(treeData => (
					<TreeNodeChildren
						node={treeData}
						openChildrenSidebar={openChildrenSidebar}
						openUserSidebar={openUserSidebar}
					/>
				))}
			{treeData === null && (employees === null || employees.length === 0) && (
				<h2 className={style.organization_structure_title_h2_error}>
					Нет данных
				</h2>
			)}
			{employees !== null &&
				employees.map(employees => (
					<TreeNodeEmployees
						node={employees}
						openUserSidebar={openUserSidebar}
					/>
				))}
		</ul>
	);
}

function TreeNodeChildren({ node, openChildrenSidebar, openUserSidebar }) {
	const { title, name, id } = node;

	// const [treeData, setTreeData] = useState([{}]);
	const [employeesData, setEmployeesData] = useState([{}]);
	const [childrenData, setChildrenData] = useState([{}]);
	const [showChildren, setShowChildren] = useState(false);

	const getChildrenClick = id => {
		setShowChildren(!showChildren);
		getChildren(id);
	};

	const getChildren = async id => {
		try {
			const responseData = await axios.post(
				`http://localhost:8000/org/get-child?division_id=${id}`,
				{},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			// setTreeData(responseData.data);
			setChildrenData(responseData.data.children);
			setEmployeesData(responseData.data.employees);
		} catch (err) {
			return;
		}
	};
	return (
		<>
			<div className={style.organization_structure_tree_element_container}>
				<div
					className={style.organization_structure_tree_arrow}
					onClick={() => getChildrenClick(id)}
				>
					<img
						src='/img/keyboard_arrow.svg'
						alt='keyboard_arrow'
						style={{
							transform: `rotate(${!showChildren ? 0 : '0.25turn'})`,
						}}
					/>
				</div>
				<div
					className={style.organization_structure_tree_element_text_container}
					onClick={() => openChildrenSidebar(id)}
				>
					<div>
						<p className={style.organization_structure_tree_element_title}>
							{title} {name}
						</p>
					</div>
					<div>
						<p
							className={style.organization_structure_tree_element_description}
						>
							Описание отсутствует
						</p>
					</div>
				</div>
			</div>
			<ul className={style.organization_structure_tree_children}>
				{showChildren ? (
					<Tree
						treeData={childrenData}
						employees={employeesData}
						openChildrenSidebar={openChildrenSidebar}
						openUserSidebar={openUserSidebar}
					/>
				) : null}
			</ul>
		</>
	);
}

function TreeNodeEmployees({ node, openUserSidebar }) {
	const { name, surname, patronymic, id } = node;
	return (
		<>
			<div className={style.organization_structure_tree_element_container}>
				<div className={style.organization_structure_tree_user_icon}>
					<img src='/img/user_icon.svg' alt='user_icon' />
				</div>
				<div
					className={style.organization_structure_tree_element_text_container}
					onClick={() => openUserSidebar(id)}
				>
					<div>
						<p className={style.organization_structure_tree_element_title}>
							{surname} {name} {patronymic}
						</p>
					</div>
					<div>
						<p
							className={style.organization_structure_tree_element_description}
						>
							Описание отсутствует
						</p>
					</div>
				</div>
			</div>
			<ul className={style.organization_structure_tree_children}></ul>
		</>
	);
}

const CustomFileInput = ({ onChange }) => {
	const fileInputRef = useRef(null);

	const handleChange = e => {
		const file = e.target.files[0];
		if (onChange) {
			onChange(file);
			handleUpload(file);
		}
	};

	const handleUpload = file => {
		if (file.length === 0) {
			return;
		}

		const formData = new FormData();
		formData.append('file', file);
		axios.post('http://localhost:8000/org/structure-upload', formData, {
			withCredentials: true,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		window.location.reload();
	};

	const handleClick = () => {
		fileInputRef.current.click();
	};

	return (
		<div>
			<input
				type='file'
				ref={fileInputRef}
				style={{ display: 'none' }}
				onChange={handleChange}
			/>
			<button
				className={style.organization_structure_file_download_button}
				onClick={handleClick}
			>
				<img src='/img/file_download.svg' alt='file_download' />
				Импорт
			</button>
		</div>
	);
};
