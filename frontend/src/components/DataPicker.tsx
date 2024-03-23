import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../store/store"
import Chevron from "../img/chevron_left.svg?react"
import { getPrevMonth, getNextMonth, getStartStudy, getMonth,
        getFinishStudy, getNextYear, getPrevYear} from "../store/features/datapickerSlice"
import { useState } from "react"

export const DataPicker = ({type}: {type: string}) => {
    const [datapickerStage, setDatapickerStage] = useState(0)

    const dispatch = useDispatch()

    const days = ["Пн", "Вт", "Ср", "Чт",
    "Пт", "Сб", "Вс"]

    const months = [
        { name: "Янв", count: 0 },
        { name: "Фев", count: 1 },
        { name: "Март", count: 2 },
        { name: "Апр", count: 3 },
        { name: "Май", count: 4 },
        { name: "Июнь", count: 5 },
        { name: "Июль", count: 6 },
        { name: "Авг", count: 7 },
        { name: "Сен", count: 8 },
        { name: "Окт", count: 9 },
        { name: "Нояб", count: 10 },
        { name: "Дек", count: 11 },
    ]

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
                className="text-[#aaa] p-[5px_8px] text-[14px] cursor-pointer
                hover:bg-s-accent-300 hover:text-white hover:rounded">
                    {lastDateOfLastMonth - i + 1}
                </li>)
        }
        // дни текущего месяца
        for (let i = 1; i <= lastDateOfMonth; i++) {
            let isWeekday = new Date(year, monthNumber, i).getDay() === 6 || new Date(year, monthNumber, i).getDay() === 0
             ? "text-s-error-300 p-[5px_8px] text-[14px] hover:bg-s-accent-300 hover:text-white hover:rounded cursor-pointer" 
             : "p-[5px_8px] text-[14px] hover:bg-s-accent-300 hover:text-white hover:rounded cursor-pointer"
            let isToday = i === currentDate.getDate() && monthNumber === new Date().getMonth()
                           && year === new Date().getFullYear() 
                           ? "p-[5px_8px] font-bold text-[14px] text-s-accent-300 hover:bg-s-accent-300 hover:text-white hover:rounded cursor-pointer" 
                           : "p-[5px_8px] text-[14px] hover:bg-s-accent-300 hover:text-white hover:rounded cursor-pointer";
            daysOfCurrentMonth.push(<li onClick={() => {
                type == "start"
                    ? dispatch(getStartStudy(new Date(year, monthNumber, i)))
                    : dispatch(getFinishStudy(new Date(year, monthNumber, i)))
            }}
            className={`${isWeekday} ${isToday}`}>
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
            className="text-[#aaa] p-[5px_8px] text-[14px] cursor-pointer
            hover:bg-s-accent-300 hover:text-white hover:rounded">
                {i - lastDayOfMonth + 1}
            </li>);
        }

        const result = daysOfLastMonth.concat(daysOfCurrentMonth, daysOfNextMonth)

        return result
    }

    return (
        <div className="w-[inherit] h-auto p-4 bg-white rounded-2xl text-black
        shadow-[0_5px_13px_0_rgba(0,0,0,0.11),0_1px_3px_0_rgba(0,0,0,0.25)]">
            <div className="mb-1 flex items-center">
                <button onClick={() => {
                   datapickerStage == 0 ? dispatch(getPrevMonth()) : dispatch(getPrevYear()) 
                }}
                title="prev" className="mr-auto">
                    <Chevron fill="#323232" />
                </button>
                {datapickerStage == 0 &&
                    <div onClick={() => setDatapickerStage(datapickerStage+1)}
                    className="text-[14px] mr-auto cursor-pointer">
                        <span className="font-semibold text-s-gray-900 mr-1">{month}</span>
                        <span className="font-bold text-s-gray-300">{year}</span>   
                    </div>
                }
                {datapickerStage == 1 &&
                    <span className="font-bold text-s-gray-300 
                    text-[14px] mr-auto cursor-pointer">
                        {year}
                    </span>
                }
                <button onClick={() => {
                   datapickerStage == 0 ? dispatch(getNextMonth()) : dispatch(getNextYear())
                }}
                title="next">
                    <Chevron className="rotate-180" fill="#323232" />
                </button>
            </div>
            {datapickerStage == 0
                ? <div className="flex flex-col">
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
                : <div className="flex flex-col">
                    <div className="grid grid-cols-3 gap-1">
                        {months.map((month, index) => {
                            let isCurrentMonth = currentDate.getMonth() === index
                            && year === currentDate.getFullYear()
                            return (
                                <div onClick={() => {
                                    dispatch(getMonth(new Date(year, month.count, 1)))
                                    setDatapickerStage(0)
                                }}
                                className={`flex-[1] p-[7px_10px] cursor-pointer
                                items-center justify-center flex text-[14px]
                                hover:bg-s-accent-300 hover:text-white hover:rounded
                                ${isCurrentMonth && 'text-s-accent-300 font-bold'}`}>
                                    {month.name}
                                </div>
                            )
                        })}
                    </div>
                  </div>
            }
            
        </div>
    )
}