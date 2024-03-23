import Chevron from "../../img/chevron_left.svg?react"
import { Button } from "../Button";
import FiltersSvg from "../../img/filters.svg?react"
import { Switch } from "../Switch";
import { useDispatch, useSelector } from "react-redux";
import { getNextMonth, getPrevMonth, getNextWeek, getPrevWeek } from "../../store/features/calendarSlice";
import type { RootState } from "../../store/store";

export const CalendarHeader = ({date}: {date: Date}) => {
    const handleClick = () => {
        alert('Button Clicked!');
    };

    const dispatch = useDispatch()
    const calendarType = useSelector((state: RootState) => state.calendar.calendarType)

    //делаем первую букву большой
    function capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    //для месяца: получаем месяц и год
    const month = capitalizeFirstLetter(date.toLocaleString('ru-RU', {month: 'long'}))
    const year = date.getFullYear()

    //для недели: получаем число понедельника и воскресенья
    // Получаем день недели (0 - воскресенье, 1 - понедельник, ..., 6 - суббота)
    const currentDayOfWeek = date.getDay();
    // Вычисляем разницу между текущим днем недели и понедельником (если текущий день - воскресенье, то разница -6 дней)
    const mondayDifference = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    // Вычисляем дату понедельника текущей недели
    const monday = (new Date(date.getFullYear(), date.getMonth(), date.getDate() + mondayDifference)).getDate();
    // Вычисляем дату воскресенья текущей недели
    const sunday = (new Date(date.getFullYear(), date.getMonth(), date.getDate() + (7 - currentDayOfWeek))).getDate();

    return (
        <div className="flex items-center pt-[45px] mb-[45px]">
            <div className="text-[32px] font-semibold text-s-gray-900 mr-3">
                {calendarType == "month"
                    ? `${month} ${year}` 
                    : ` ${month} ${monday} - ${sunday}`
                }
            </div>
            <div className="flex mr-auto">
                <button title="prev" className="mr-1" onClick={() => {
                    calendarType == "month" 
                        ? dispatch(getPrevMonth())
                        : dispatch(getPrevWeek())
                    }}>
                    <Chevron className="svg-button" />
                </button>
                <button title="next" className=""  onClick={() => {
                    calendarType == "month"
                        ? dispatch(getNextMonth())
                        : dispatch(getNextWeek())
                    }}>
                    <Chevron className="svg-button rotate-180" />
                </button>
            </div>
            <div className="flex mr-4">
                <Switch  />
            </div>
            {/* <Button onClick={handleClick} size="small"
            text={"Фильтры"} type={"black"} styles="max-w-[280px]" /> */}
            <button title="filters" className="border-button" 
            style={{paddingTop: "16px", paddingBottom: "16px"}}>
                <FiltersSvg className="svg-button" />
            </button>
        </div>
    )
}