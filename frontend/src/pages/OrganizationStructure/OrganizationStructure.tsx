import axios from 'axios';
import { useState, useEffect } from 'react';

import style from './OrganizationStructure.module.scss';

import { Drawer } from '../../components/Drawer';
import { Header } from '../../components/Header';
import { OrgStructureSidebarChildren } from '../../components/OrgStructureSidebar/OrgStructureSidebarChildren';
import { OrgStructureSidebarUser } from '../../components/OrgStructureSidebar/OrgStructureSidebarUser';


export function OrganizationStructure() {
	const [treeData, setTreeData] = useState([{}]);
	const [userData, setUserData] = useState([{}]);
	const [showChildrenSidebar, setShowChildrenSidebar] = useState(false);
	const [showUserSidebar, setShowUserSidebar] = useState(false);
	const [nodeElementID, setNodeElementID] = useState(0);

	const openChildrenSidebar = children_ID => {
		setNodeElementID(children_ID);
		setShowUserSidebar(false);
		setShowChildrenSidebar(true);
	};

	const openUserSidebar = (user_ID, user_data) => {
		setNodeElementID(user_ID);
		setUserData(user_data);
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
			<Drawer PageID={8} />
			{showChildrenSidebar && (
				<OrgStructureSidebarChildren
					children_ID={nodeElementID}
					onClose={() => setShowChildrenSidebar(false)}
				/>
			)}
			{showUserSidebar && (
				<OrgStructureSidebarUser
					user_ID={nodeElementID}
					onClose={() => setShowUserSidebar(false)}
					user_data={userData}
				/>
			)}
			<Header />
			<div className={style.organization_structure_container}>
				<h1 className={style.organization_structure_title}>
					Структура организации
				</h1>
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
			{treeData !== null ? (
				treeData.map(treeData => (
					<TreeNodeChildren
						node={treeData}
						openChildrenSidebar={openChildrenSidebar}
						openUserSidebar={openUserSidebar}
					/>
				))
			) : (
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
				`http://localhost:8000/org/get_child?division_id=${id}`,
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
	const userData = node
	return (
		<>
			<div className={style.organization_structure_tree_element_container}>
				<div className={style.organization_structure_tree_user_icon}>
					<img src='/img/user_icon.svg' alt='user_icon' />
				</div>
				<div
					className={style.organization_structure_tree_element_text_container}
					onClick={() => openUserSidebar(id, userData)}
				>
					<div>
						<p className={style.organization_structure_tree_element_title}>
							{name} {surname} {patronymic}
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
