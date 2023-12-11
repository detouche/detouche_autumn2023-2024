import axios from 'axios';
import {useState} from "react";


import { Drawer } from '../../components/Drawer';
import { Header } from '../../components/Header';
import { Button } from '../../components/UI/Button';

import style from './OrganizationStructureFile.module.scss';

export function OrganizationStructureFile() {
	const [selectedFile, setSelectedFile] = useState(null);

	const handleChange = event => {
		setSelectedFile(event.target.files[0]);
	};

	const handleUpload = event => {
		if (!selectedFile) {
			alert('Error');
		}

		const formData = new FormData();
		formData.append('file', selectedFile);
		axios.post('http://localhost:8000/org/structure-upload', formData, {
			withCredentials: true,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
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
	return (
		<div>
			<Drawer PageID={10} />
			<Header />
			<div className={style.organization_structure_file_container}>
				<h1 className={style.organization_structure_file_title}>
					Экспорт и импорт структуры организации
				</h1>
				<div className={style.organization_structure_file_content_container}>
					<div className={style.organization_structure_import_file_container}>
						<h2 className={style.organization_structure_file_title_h2}>
							Импортирование файла
						</h2>
						<div
							className={style.organization_structure_import_input_container}
						>
							<input type='file' onChange={handleChange} />
						</div>
						<div
							className={style.organization_structure_import_button_container}
						>
							<Button onClick={handleUpload}>Импортировать</Button>
						</div>
					</div>
					<div className={style.organization_structure_export_file_container}>
						<h2 className={style.organization_structure_file_title_h2}>
							Экспортирование файла
						</h2>
						<Button onClick={handleExport}>Экспортировать</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
