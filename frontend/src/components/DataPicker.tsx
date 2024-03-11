import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../store/store"
import Chevron from "../img/chevron_left.svg?react"
import { getPrevMonth, getNextMonth, getStartStudy,
        getFinishStudy} from "../store/features/datapickerSlice"

export const DataPicker = ({type}: {type: string}) => {
    const dispatch = useDispatch()

    const days = ["Пн", "Вт", "Ср", "Чт",
    "Пт", "Сб", "Вс"]

    const currentDate = useSelector((state: RootState) => state.datapicker.currentDate)
    const date = useSelector((state: RootState) => state.datapicker.date)

    //делаем первую букву большой
    function capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    //для месяца: получаем месяц и год
    const monthNumber = date.getMonth() // месяц числом
    const month = capitalizeFirstLetter(date.toLocaleString('ru-RU', {month: 'long'})) //месяц строкой
    const year = date.getFullYear()
    // получаем дни месяца
    const renderCalendar = () => {
        let firstDayOfMonth = new Date(year, monthNumber, 0).getDay(),
        lastDateOfMonth = new Date(year, monthNumber + 1, 0).getDate(),
        lastDayOfMonth = new Date(year, monthNumber, lastDateOfMonth - 1).getDay(),
        lastDateOfLastMonth = new Date(year, monthNumber, 0).getDate();

        let daysOfLastMonth = []
        let daysOfCurrentMonth = []
        let daysOfNextMonth = []
        // несколько дней предыдущего месяца
        for (let i = firstDayOfMonth; i > 0; i--) {
            daysOfLastMonth.push(<li onClick={() => {
                type == "start" 
                    ? dispatch(getStartStudy(new Date(year, monthNumber-1,
                        lastDateOfLastMonth - i + 1)))
                    : dispatch(getFinishStudy(new Date(year, monthNumber-1,
                        lastDateOfLastMonth - i + 1)))
            }}
                className="text-[#aaa] p-[5px_8px] text-[14px]">
                    {lastDateOfLastMonth - i + 1}
                </li>)
        }
        // дни текущего месяца
        for (let i = 1; i <= lastDateOfMonth; i++) {
            let isToday = i === currentDate.getDate() && monthNumber === new Date().getMonth()
                           && year === new Date().getFullYear() ? "p-[5px_8px] text-[14px] text-red-600" : "p-[5px_8px] text-[14px]";
            daysOfCurrentMonth.push(<li onClick={() => {
                type == "start"
                    ? dispatch(getStartStudy(new Date(year, monthNumber, i)))
                    : dispatch(getFinishStudy(new Date(year, monthNumber, i)))
            }}
            className={isToday}>
                {i}
            </li>);
        }
        // несколько дней следующего месяца
        for (let i = lastDayOfMonth; i < 6; i++) {
            daysOfNextMonth.push(<li onClick={() => {
                type == "start"
                    ? dispatch(getStartStudy(new Date(year, monthNumber+1, i - lastDayOfMonth + 1)))
                    : dispatch(getFinishStudy(new Date(year, monthNumber+1, i - lastDayOfMonth + 1)))
            }}
            className="text-[#aaa] p-[5px_8px] text-[14px]">
                {i - lastDayOfMonth + 1}
            </li>);
        }

        const result = daysOfLastMonth.concat(daysOfCurrentMonth, daysOfNextMonth)
        return result
    }

    return (
        <div className="w-[280px] h-auto p-4 bg-white rounded-2xl text-black
        shadow-[0_5px_13px_0_rgba(0,0,0,0.11),0_1px_3px_0_rgba(0,0,0,0.25)]">
            <div className="mb-1 flex items-center">
                <button onClick={() => dispatch(getPrevMonth())}
                title="prev" className="mr-auto">
                    <Chevron fill="#323232" />
                </button>
                <span className="font-semibold text-[14px] mr-auto">
                    {month} {year}
                </span>
                <button onClick={() => dispatch(getNextMonth())}
                title="next">
                    <Chevron className="rotate-180" fill="#323232" />
                </button>
            </div>
            <div className="flex flex-col">
                <div className="flex mb-1">
                    {days.map((day) => (
                        <div className="flex-[1] p-[5px_8px]
                        items-center justify-center flex text-[14px]">
                            {day}
                        </div>
                    ))}
                </div>
                <ul className="grid grid-cols-7 justify-items-center">
                    {renderCalendar()}
                </ul>
            </div>
        </div>
    )
}