import React, { useEffect, useState } from 'react';

import styles from './CalendarPage.module.scss';

import { Calendar } from '../../components/Calendar';
import { Drawer } from '../../components/Drawer';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';


export function CalendarPage() {
	const [currentDate, setCurrentDate] = useState(new Date(Date.now()));
	const [showSidebar, setShowSidebar] = useState(false);
	const [courseID, setCourseID] = useState(0);
	const ChangeDate = (e: { target: { value: string | number | Date } }) => {
		setCurrentDate(new Date(e.target.value));
	};

	const LoadCalendar = () => {
		return (
			<Calendar
				currentDate={currentDate}
				setShowSidebar={setShowSidebar}
				setCourseID={setCourseID}
			/>
		);
	};

	useEffect(() => {
		LoadCalendar();
	}, [currentDate]);

	return (
		<div>
			<Drawer />
			{showSidebar && (
				<Sidebar course_id={courseID} onClose={() => setShowSidebar(false)} />
			)}
			<Header PageID={2} />
			<div className={styles.CalendarContainer}>
				<div>
					<input
						className={styles.CalendarInput}
						type='month'
						onChange={ChangeDate}
						defaultValue={`${currentDate.getFullYear()}-${
							currentDate.getMonth() + 1 < 10
								? `0${currentDate.getMonth() + 1}`
								: `${currentDate.getMonth() + 1}`
						}`}
					/>
				</div>
				<LoadCalendar />
			</div>
		</div>
	);
}
