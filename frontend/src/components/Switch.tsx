import { useState } from "react"
import { useDispatch } from "react-redux"
import { switchCalendarType } from "../store/features/calendarSlice"

export const Switch = () => {
    const [active, setActive] = useState(true)
    const dispatch = useDispatch()

    return (
        <>
            <button onClick={() => {
                setActive(true)
                dispatch(switchCalendarType("month"))
            }}
            className="p-[10px] text-s-gray-900 bg-[#E6E6E6]
            rounded-l-lg disabled:bg-[#F8F8F8] disabled:border disabled:border-[#E6E6E6]"
            disabled={active}>
                Месяц
            </button>
            <button onClick={() => {
                setActive(false)
                dispatch(switchCalendarType("week"))
            }}
            className="p-[10px] text-s-gray-900 bg-[#E6E6E6]
            rounded-r-lg disabled:bg-[#F8F8F8] disabled:border disabled:border-[#E6E6E6]"
            disabled={!active}>
                Неделя
            </button>
        </>
    )
}