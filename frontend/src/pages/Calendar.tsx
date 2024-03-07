import { CalendarHeader } from "../components/Calendar/CalendarHeader"
import { CalendarMonth } from "../components/Calendar/CalendarMonth"
import { CalendarWeek } from "../components/Calendar/CalendarWeek"
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

export const Calendar = () => {
    //узнаём сегодняшнее число
    const date = useSelector((state: RootState) => state.calendar.date)
    //узнаём тип календаря
    const calendarType = useSelector((state: RootState) => state.calendar.calendarType)

    return (
        <>
            <CalendarHeader date={date}  />
            {calendarType == "month" 
                ? <CalendarMonth date={date} />
                : <CalendarWeek date={date} />}
        </>
    )
}