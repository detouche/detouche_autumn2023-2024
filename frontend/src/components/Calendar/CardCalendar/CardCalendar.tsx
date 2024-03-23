import { useState } from "react";
import { Tooltip } from "./Tooltip";
import ManageSvg from "../../../img/manage.svg?react"
import HardSvg from "../../../img/computer.svg?react"
import SoftSvg from "../../../img/soft.svg?react"

type Course = {
	startDate: Date;
    endDate: Date;
    title: string;
    type: string;
    category: string;
    membersData: object[];
}

export const CardCalendar = ({course, width, type}:
	{course: Course, width: number, type: string}) => {
	// Вычисляем ширину карточки в зависимости от длительности курса
	const getDurationInDays = (start: Date, end: Date) => {
		return (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
	};
	const duration = getDurationInDays(course.startDate, course.endDate);
	const cardWidth = (duration / 30) * width - 20;

	//решаем, показывать ли тултип
	const [showTooltip, setShowTooltip] = useState(false);


	return (
		<div onMouseEnter={() => setShowTooltip(true)}
		onMouseLeave={() => setShowTooltip(false)}
		style={{width: `${cardWidth}px`}} className={`flex rounded-md
		p-[4px_6px] items-center cursor-pointer ${cardWidth < 40 && "justify-center"}
		${type === "manage" ? "bg-[#FFF5E0] hover:shadow-[0_0_6.5px_0_rgba(237,184,74,0.75)]" : 
		(type === "soft" ? "bg-[#C5FFE0] hover:shadow-[0_0_6.5px_0_rgba(43,206,117,0.75)]" : 
		(type === "hard" && "bg-[#F3DBFF] hover:shadow-[0_0_6.5px_0_rgba(189,98,230,0.75)]"))}`}>
			{duration === 1 ? (
				<div className="text-[12px] font-semibold text-black">
					{type === "manage" ? <ManageSvg /> 
					: (type === "soft" ? <SoftSvg /> 
					: (type === "hard" && <HardSvg />))}
				</div>
			) : (
				<>
					{type === "manage" ? <ManageSvg className="min-w-[12px] mr-1" /> 
					: (type === "soft" ? <SoftSvg className="min-w-[12px] mr-1" /> 
					: (type === "hard" && <HardSvg className="min-w-[12px] mr-1" />))}
					{/* <Cast className="min-w-[12px] mr-1" /> */}
					<div className="mr-1 text-[12px] font-semibold text-black whitespace-nowrap
					text-ellipsis overflow-hidden flex">
						{course.title}
					</div>
				</>
			)}
			{duration > 3 && (
				<div className={`p-[2px_8px] rounded mr-1 text-[10px] text-s-gray-900
				whitespace-nowrap
				${type === "manage" ? "bg-[#FFE5B4]" : 
				(type === "soft" ? "bg-[#9AEBBF]" : 
				(type === "hard" && "bg-[#E0BEF1]"))}
				`}>
					{course.type}
				</div>
			)}
			{duration > 4 && (
				<div className={`p-[2px_8px] rounded text-[10px] text-s-gray-900
				whitespace-nowrap
				${type === "manage" ? "bg-[#FFE5B4]" : 
				(type === "soft" ? "bg-[#9AEBBF]" : 
				(type === "hard" && "bg-[#E0BEF1]"))}
				`}>
					{course.category}
				</div>
			)}
			{showTooltip && <Tooltip course={course} />}	
		</div>
	)
}