
import React, {useState} from 'react';
import styles from './CardCalendar.module.scss';

export function CardCalendar({course, onCardClick, style}) {
    const [showTooltip, setShowTooltip] = useState(false);
    const handleClick = () => {
        onCardClick(course.id);
    };

    // Вычисляем ширину карточки в зависимости от длительности курса
    const getDurationInDays = (start: Date, end: Date) => {
        return (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
    };

    const duration = getDurationInDays(course.startDate, course.endDate);

    // Предполагаем, что календарь имеет фиксированную ширину, скажем 600px.
    // Если курс идет весь месяц, он займет всю ширину.
    const cardWidth = (duration / 30) * 600; // Это упрощение, реальная логика может быть сложнее.

    return (
        <div
            className={styles.cardContainer}
            onClick={handleClick}
            style={style} // Применяем переданные стили
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div className={styles.title}>{course.title}</div>
            {/*<div className={styles.dates}>*/}
            {/*    {course.startDate.toISOString().substring(0, 10)} -*/}
            {/*    {course.endDate.toISOString().substring(0, 10)}*/}
            {/*</div>*/}
            {showTooltip && (
                <div className={styles.tooltip}>
                    <p className={styles.CourseTitle}>
                        {course.title}
                    </p>
                    <div className={styles.CourseTags}>
                        <p>{course.type}</p>
                        <p>{course.category}</p>
                    </div>
                    <p className={styles.CourseTitle}>
                        Дата проведения
                    </p>
                    <p className={styles.CourseDates}>
                        {course.startDate.toLocaleDateString()} - {course.endDate.toLocaleDateString()}
                    </p>
                    <p className={styles.CourseTitle}>Участники</p>
                    <ul>
                        {course.members.map((member) => {
                            return (
                                <li className={styles.CourseMember}>{member}</li>
                            )
                        })}

                    </ul>
                </div>
            )}
        </div>
    );
};