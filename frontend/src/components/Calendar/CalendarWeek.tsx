export const CalendarWeek = ({date}: {date: Date}) => {
    const days = ["Понедельник", "Вторник", "Среда", "Четверг",
    "Пятница", "Суббота", "Воскресенье"]
    // узнаём дату понедельника этой недели 
    const dayOfWeek = date.getDay(); // Получаем текущий день недели (0 - воскресенье, 1 - понедельник и т.д.)
    const mondayDate = new Date(date.setDate(date.getDate() - dayOfWeek + (dayOfWeek == 0 ? -6 : 1))); // Вычисляем дату понедельника
    const monday = mondayDate.getDate(); // Получаем число понедельника
    // узнаём последний день месяца
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    // делаем массив из чисел месяца
    let monthDates = [monday];
    for (let i = 1; i < 7; i++) {
        let num = (monthDates[i - 1] + 1) % (lastDayOfMonth+1);
        if (num === 0) {
            num = 1;
        }
        monthDates.push(num);
    }
    let futureDate = new Date(date.getTime() + 6 * 24 * 60 * 60 * 1000);
    let futureDateString = futureDate.toLocaleDateString();
    console.log(date.toLocaleDateString())
    console.log(futureDateString)
    
    return (
        <div className="flex flex-col">
            <div className="flex">
                {days.map((day) => (
                    <div className="flex-[1] border border-gray-100 h-[51px]
                    items-center justify-center flex text-[19px]">
                        {day}
                    </div>
                ))}
            </div>
            <div className="flex">
                {monthDates.map((date) => (
                    <div className="flex-[1] border border-gray-100
                    h-[calc(100vh-221px)]">
                        <div className="flex justify-end mr-[10px] mt-[10px]
                        text-[18px] text-[#B9B9B9]">
                            {date}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}