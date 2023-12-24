import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import style from './Administration.module.scss';

import { Drawer } from '../../components/Drawer';
import { Header } from '../../components/Header';
import { Button } from '../../components/UI/Button';

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

export function Administration() {
	return (
		<div>
			<Drawer />
			<Header />
			<div className={style.administration_container}>
				<div className={style.administration_title_container}>
					<h1 className={style.administration_title}>Администрирование</h1>
					<div className={style.administration_upload_button_container}>
						<p className={style.administration_upload_title}>Отчет по заявкам на обучение</p>
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
				</div>
			</div>
		</div>
	);
}
