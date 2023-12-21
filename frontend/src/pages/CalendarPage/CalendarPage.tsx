import {Calendar} from "../../components/Calendar";
import {Drawer} from "../../components/Drawer";
import {Header} from "../../components/Header";
import styles from './CalendarPage.module.scss'
import React, {useEffect, useState} from "react";

export function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date(Date.now()));
    const ChangeDate = (e: { target: { value: string | number | Date; }; }) => {
        setCurrentDate(new Date(e.target.value))
    }

    const LoadCalendar = () => {
        return (
            <Calendar currentDate={currentDate}/>
        )
    }

    useEffect(() => {

        LoadCalendar()
    }, [currentDate]);


    return (
        <div>
            <Drawer PageID={1} />
            <Header/>
            <div className={styles.CalendarContainer}>
                <div>
                    <input
                        className={styles.CalendarInput}
                        type="month"
                        onChange={ChangeDate}
                        defaultValue={`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`}/>
                </div>
                <LoadCalendar/>
            </div>

        </div>
    )
}