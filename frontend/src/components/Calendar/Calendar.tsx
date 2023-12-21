
import React, { useState, useEffect } from 'react';
import {CardCalendar} from "../CardCalendar";
import styles from './Calendar.module.scss';
import axios from 'axios';
interface Course {
    id: string;
    title: string;
    description: string;
    cost: number;
    category: string;
    education_center: string;
    goal: string;
    type: string;
    startDate: Date;
    endDate: Date;
    members: string[];
}



export function Calendar({currentDate}) {
    const [courses, setCourses] = useState<Course[]>([]);

    const [currentYear, setCurrentYear] = useState(0)
    const [currentMonth, setCurrentMonth] = useState(0)

    useEffect(() => {
        // Здесь вы бы сделали запрос на сервер за данными о курсах,
        // но сейчас мы используем фиктивные данные для примера.
        setCurrentMonth(currentDate.getMonth())
        setCurrentYear(currentDate.getFullYear())

        const getCourseData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/docs/course-application`,
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const t = ParseCourses(response.data)
                setCourses(validateCourses(t.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())));
            } catch (error) {

            }
        };

        function ParseCourses(resp) {
            let parsedCourses = []
            resp.forEach(course => {
                let startDate = course.course.start_date.split('.')
                let endDate = course.course.end_date.split('.')
                parsedCourses.push({
                    id: course.id,
                    title: course.course.title,
                    description: course.course.description,
                    cost: course.course.cost,
                    category: course.course.category,
                    education_center: course.course.education_center,
                    goal: course.course.goal,
                    type: course.course.type,
                    startDate: new Date(`${startDate[2]}-${startDate[1]}-${startDate[0]}`),
                    endDate: new Date(`${endDate[2]}-${endDate[1]}-${endDate[0]}`),
                    members: course.members_id
                })
            })

            return parsedCourses
        }

        getCourseData()

        // ParseCourses(getCourseData())

        const fetchedCourses = [
            {
                id: '1',
                title: 'Курс по программированию',
                // Сюда передаем срез строки без времени (вынужденная мера)
                startDate: new Date('2023-10-15',),
                endDate: new Date('2024-01-20'),
            },
            {
                id: '1',
                title: 'Курс по программированию',
                // Сюда передаем срез строки без времени (вынужденная мера)
                startDate: new Date('2023-10-05',),
                endDate: new Date('2023-10-05'),
            },
            {
                id: '1',
                title: 'Курс по программированию',
                // Сюда передаем срез строки без времени (вынужденная мера)
                startDate: new Date('2023-10-07',),
                endDate: new Date('2023-10-10'),
            },
            {
                id: '1',
                title: 'Курс по программированию',
                // Сюда передаем срез строки без времени (вынужденная мера)
                startDate: new Date('2023-10-01',),
                endDate: new Date('2023-10-17'),
            },
            {
                id: '1',
                title: 'Курс по программированию',
                // Сюда передаем срез строки без времени (вынужденная мера)
                startDate: new Date('2023-10-09',),
                endDate: new Date('2023-10-22'),
            },

            // Добавьте больше курсов здесь
        ];
        // setCourses(validateCourses(fetchedCourses.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())));
        // setCourses(fetchedCourses)
        // console.log(validateCourses(fetchedCourses))


    }, [currentMonth, currentYear]);

    function validateCourses(fetchedCourses: Course[]): Course[] {
        let resultCourses: Course[] = []

        fetchedCourses.forEach(course => {
            let currentStartMonth = course.startDate.getMonth()
            let currentEndMonth = course.endDate.getMonth()

            let currentStartYear = course.startDate.getFullYear()
            let currentEndYear = course.endDate.getFullYear()

            const isStartBeforeOrInSelectedMonth = (currentStartYear < currentYear) ||
                (currentStartYear === currentYear && currentStartMonth <= currentMonth);

            const isEndAfterOrInSelectedMonth = (currentEndYear > currentYear) ||
                (currentEndYear === currentYear && currentEndMonth >= currentMonth);

            if (isStartBeforeOrInSelectedMonth && isEndAfterOrInSelectedMonth) {
                resultCourses.push(course)
            }
        })
        return resultCourses
    }


    const generateDayHeaders = () => {
        return Array.from({length: new Date(currentYear, currentMonth + 1, 0).getDate()}, (_, i) => (
            <div key={i} className={styles.dayHeader}>
                {i + 1}
            </div>
        ));
    };

    const handleCardClick = (courseId: string) => {
        console.log(`Карточка курса с ID ${courseId} была кликнута.`);
        // Вызовите здесь функцию, которая будет вызвана при клике на карточку
    };

    const generateOccupiedIntervals = (courses: Course[]) => {
        let intervals: { start: number, end: number }[][] = [];
        courses.forEach(course => {
            placeCourse(intervals, course);
            // Функция placeCourse уже обновляет интервалы, ничего больше делать не нужно
        });
        return intervals;
    };

    const occupiedIntervals = generateOccupiedIntervals(courses); // Вызывается до того, как мы пофиксили даты, нужно исправить

    function placeCourse(occupiedIntervals: { start: number, end: number }[][], course: Course): number {
        const startDay = course.startDate.getDate();
        const endDay = course.endDate.getDate();

        // Check each row to see if we can place the course without overlapping
        for (let rowIndex = 0; rowIndex < occupiedIntervals.length; rowIndex++) {
            let row = occupiedIntervals[rowIndex];
            // Assume we can place the course here until we find an overlap
            let canPlace = true;

            for (let interval of row) {
                if (startDay <= interval.end && endDay >= interval.start) {
                    // We found an overlap, so we can't place the course here
                    canPlace = false;
                    break;
                }
            }

            // If there's no overlap, place the course in the current row
            if (canPlace) {
                row.push({start: startDay, end: endDay});
                return rowIndex + 1; // +1 because rows are 1-indexed in the grid
            }
        }

        // If we get here, it means we couldn't place the course in any existing row,
        // so we need to create a new row
        occupiedIntervals.push([{start: startDay, end: endDay}]);
        return occupiedIntervals.length; // Return the new row number
    }


    function fixDate(course: Course, currentMonth: number, currentYear: number): Course {
        let currentCourse = structuredClone(course)
        let currentStartMonth = course.startDate.getMonth()
        let currentEndMonth = course.endDate.getMonth()

        if (currentStartMonth !== currentMonth) {
            currentCourse.startDate.setMonth(currentMonth)
            currentCourse.startDate.setDate(1)
        }

        if (currentEndMonth !== currentMonth) {
            currentCourse.endDate.setMonth(currentMonth)
            currentCourse.endDate.setDate(new Date(currentYear, currentMonth + 1, 0).getDate())
        }
        return currentCourse
    }

    return (
        <div>
            <div className={styles.container}>
                <div
                    className={styles.calendar}
                    style={{
                        gridTemplateColumns: `repeat(${new Date(currentYear, currentMonth + 1, 0).getDate()}, 1fr)`
                    }}>
                    <div
                        className={styles.courseRowHeader}
                        style={{
                            gridTemplateColumns: `repeat(${new Date(currentYear, currentMonth + 1, 0).getDate()}, minmax(20px, 1fr))`
                        }}>
                        {generateDayHeaders()} {/* Заголовки для дней месяца */}
                    </div>
                    <div
                        className={styles.courseRow}
                        style={{
                            gridTemplateColumns: `repeat(${new Date(currentYear, currentMonth + 1, 0).getDate()}, minmax(20px, 1fr))`
                        }}> {/* Ряд для курсов */}
                        <div
                            className={styles.columnLine}
                            style={{
                                gridTemplateColumns: `repeat(${new Date(currentYear, currentMonth + 1, 0).getDate()}, 1fr)`
                            }}>
                            {Array.from({length: new Date(currentYear, currentMonth + 1, 0).getDate()}, (_) => (
                                <span></span>
                            ))}
                        </div>

                        {courses.map((course) => {
                            const fixedCourse = fixDate(course, currentMonth, currentYear)
                            const row = placeCourse(occupiedIntervals, fixedCourse);

                            return (
                                <CardCalendar
                                    key={course.id}
                                    course={course}
                                    onCardClick={handleCardClick}
                                    style={{
                                        gridColumnStart: fixedCourse.startDate.getDate(),
                                        gridColumnEnd: fixedCourse.endDate.getDate() + 1,
                                        gridRowStart: row,
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
