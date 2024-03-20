import RedPoint from "../../img/red_point.svg?react"
import Calendar from "../../img/calendar.svg?react"
import { useState } from "react"
import { DataPicker } from "../DataPicker"
import { useSelector } from "react-redux"
import type { RootState } from "../../store/store"

type SelectDateProps = {
    label: string;
    type: string;
    placeholder: string;
    point: boolean;
    styles: string;
}

export const SelectDate = ({label, type, placeholder, point, styles}: SelectDateProps) => {
    const [calendar, setCalendar] = useState(false)

    const startStudyData = useSelector((state: RootState) => state.datapicker.startStudy)
    let startStudyDay = startStudyData.getDate().toString().padStart(2, '0')
    let startStudyMonth = (startStudyData.getMonth() + 1).toString().padStart(2, '0')
    let startStudyYear = startStudyData.getFullYear()
        
        

    const finishStudyData = useSelector((state: RootState) => state.datapicker.finishStudy)
    let finishStudyDay = finishStudyData.getDate().toString().padStart(2, '0')
    let finishStudyMonth = (finishStudyData.getMonth() + 1).toString().padStart(2, '0')
    let finishStudyYear = finishStudyData.getFullYear()

    const takeValue = (type: string) => {
        if (type == "start") {
            if (startStudyYear == 1970) {
                return ""
            } else {
                return `${startStudyDay}.${startStudyMonth}.${startStudyYear}`
            }
        } else {
            if (finishStudyYear == 1970) {
                return ""
            } else {
                return `${finishStudyDay}.${finishStudyMonth}.${finishStudyYear}`
            }
        }
    }

    return (
        <div className="float-left">
            <div className="flex items-baseline">
                <label className="block text-s-gray-900 text-base mr-1" 
                htmlFor="select">
                    {label}
                </label>
                {point && <RedPoint />}            
            </div>
            <div className="relative w-[280px]">
                <input
                value={takeValue(type)}
                onFocus={() => setCalendar(true)}
                className={`p-[12px_14px] outline-none border
                border-s-gray-150 placeholder:text-s-gray-200 placeholder:text-lg block
                text-lg text-s-gray-900 rounded-lg invalid:border-s-error-300 w-[inherit]
                ${styles}`}
                placeholder={placeholder}
                type="text" />
                <Calendar onClick={() => {
                    calendar ? setCalendar(false) : setCalendar(true)
                }}
                className="fill-s-gray-900 absolute top-3 cursor-pointer right-5" />
            </div>
            {calendar && <DataPicker type={type} />}
        </div>
    )
}