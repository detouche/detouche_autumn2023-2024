import io

import pandas as pd
from sqlalchemy import select

from company.models.db import StaffUnit, Employee, Division, Acting, Assignment
from database import async_session_maker


async def export_org_structure() -> io.BytesIO:
    """
    Функция для экспорта структуры организации в XLSX файл, совместимый для повторного импорта

    :returns: BytesIO буфер с файлом XLSX
    """
    async with async_session_maker() as session:
        staff_units = await session.execute(select(StaffUnit.__table__.columns))
        employees = await session.execute(select(Employee.__table__.columns))
        divisions = await session.execute(select(Division.__table__.columns))
        actings = await session.execute(select(Acting.__table__.columns))
        assignments = await session.execute(select(Assignment.__table__.columns))
        await session.commit()

    staff_units_df = pd.DataFrame(staff_units.fetchall())
    employees_df = pd.DataFrame(employees.fetchall())
    divisions_df = pd.DataFrame(divisions.fetchall())
    actings_df = pd.DataFrame(actings.fetchall())
    assignments_df = pd.DataFrame(assignments.fetchall())

    date_columns = actings_df.select_dtypes(include=['datetime64[ns, UTC]']).columns
    for date_column in date_columns:
        actings_df[date_column] = actings_df[date_column].dt.date

    date_columns = assignments_df.select_dtypes(include=['datetime64[ns, UTC]']).columns
    for date_column in date_columns:
        assignments_df[date_column] = assignments_df[date_column].dt.date

    buffer = io.BytesIO()
    with pd.ExcelWriter(buffer, engine='openpyxl', ) as writer:
        # engine_kwargs={'options': {'constant_memory': True, 'in_memory': True, }}
        staff_units_df.to_excel(writer, sheet_name='Штатные единицы', index=False, )
        employees_df.to_excel(writer, sheet_name='Сотрудники', index=False, )
        divisions_df.to_excel(writer, sheet_name='Подразделения', index=False, )
        actings_df.to_excel(writer, sheet_name='ВрИО', index=False, )
        assignments_df.to_excel(writer, sheet_name='Назначения', index=False, )

    buffer.seek(0)

    return buffer
