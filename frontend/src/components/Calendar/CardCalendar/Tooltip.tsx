type Course = {
	startDate: Date;
    endDate: Date;
    title: string;
    type: string;
    category: string;
    membersData: object[];
}

export const Tooltip = ({course}: {course: Course}) => {
    return (
        <div className="absolute shadow-[0_4px_13px_0_rgba(0,0,0,0.15)]
        rounded-lg bg-[#fff] p-4 z-10 top-[calc(50%+26px)] left-[50%]
        translate-x-[-50%] text-s-gray-900">
            <p className="text-[14px] font-bold mb-1">
                {course.title}
            </p>
            <div className="flex items-start gap-1 mb-2">
                <div className="p-[2px_8px] rounded bg-s-accent-150">
                    {course.type}
                </div>
                <div className="p-[2px_8px] rounded bg-s-accent-150">
                    {course.category}
                </div>
            </div>
            <p className="text-[14px] font-bold mb-1">
                Дата проведения
            </p>
            <p className="text-[12px] mb-2">
                {course.startDate.toLocaleDateString()} -{' '}
                {course.endDate.toLocaleDateString()}
            </p>
            <p className="text-[14px] font-bold mb-1">
                Участники
            </p>
            <ul>
                {course.membersData.map((member) => (
                    <li className="text-[12px] mb-1">
                        {member.surname} {member.name} {member.patronymic}
                    </li>
                ))}
            </ul>
        </div>
    )
}