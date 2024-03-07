import { useState, useEffect, useRef } from "react";
import { useContainerDimensions} from "../../hooks/useContainerDimensions";

export const CalendarMonth = ({date}: {date: Date}) => {
    //узнаём размер календаря
    const componentRef = useRef()
    const { width, height } = useContainerDimensions(componentRef)

    //узнаём количество дней в месяце
    const currentYear = date.getFullYear()
	const currentMonth = date.getMonth()
    
    const days = Array.from({ length: new Date(currentYear, currentMonth+1, 0).getDate() },
    (_, index) => index + 1)

    return (
        <div className="flex flex-col"
        ref={componentRef}>
            <div className="flex">
                {days.map((day) => (
                    <div className="flex-[1] border border-gray-100 h-[51px]
                    items-center justify-center flex text-[19px]">
                        {day}
                    </div>
                ))}
            </div>
            <div className="flex">
                {days.map(() => (
                    <div className="flex-[1] border border-gray-100
                    h-[calc(100vh-221px)]">
                    </div>
                ))}
            </div>
        </div>
    )
}