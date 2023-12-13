from enum import Enum

import openpyxl
from typing import Dict, List, Any, BinaryIO

from fastapi import HTTPException
from openpyxl.worksheet.worksheet import Worksheet
from sqlalchemy.dialects.postgresql import insert as pg_insert

from company.models.db import Employee, Assignment, StaffUnit, Division, Acting
from database import async_session_maker
from utils.repository import SQLALchemyRepository


class SheetType(Enum):
    EMPLOYEE = 'EMPLOYEE'
    STAFF_UNIT = 'STAFF_UNIT'
    DIVISION = 'DIVISION'
    ACTING = 'ACTING'
    ASSIGNMENT = 'ASSIGNMENT'


column_check = {
    'EMPLOYEE': [
        'id',
        'email',
        'name',
        'surname',
        'patronymic',
        'role_id',
        'employee_status_id',
    ],
    'STAFF_UNIT': [
        'id',
        'name',
        'division_id',
    ],
    'DIVISION': [
        'id',
        'name',
        'parent_division_id',
        'head_employee_id',
        'status',
    ],
    'ACTING': [
        'id',
        'replacement_id',
        'substitute_id',
        'division_id',
        'start_date',
        'end_date',
    ],
    'ASSIGNMENT': [
        'id',
        'start_date',
        'end_date',
        'employee_id',
        'staff_units_id',
        'is_acting',
    ]
}


def parse_xlsx(file_path: BinaryIO) -> Dict[str, Worksheet]:
    """
    Функция для подготовки к парсингу файла XLSX.
    Здесь указываются листы, которые необходимо обработать в этом файле.

    :param file_path: Передаваемый файл XLSX.
    """
    workbook = openpyxl.load_workbook(file_path)
    sheet_division = workbook["Подразделения"]
    sheet_employees = workbook["Сотрудники"]
    sheet_staff_units = workbook["Штатные единицы"]
    sheet_assignment = workbook["Назначения"]
    sheet_acting = workbook["ВрИО"]
    workbook.close()
    return {
        'sheet_division': sheet_division,
        'sheet_employees': sheet_employees,
        'sheet_staff_units': sheet_staff_units,
        'sheet_assignment': sheet_assignment,
        'sheet_acting': sheet_acting,
    }


def parse_sheet(sheet: Worksheet, sheet_type: SheetType) -> List[Dict]:
    """
    Функция для парсинга листа таблицы.
    Преобразует данные в словари с ключами, соответствующими заголовкам в листе.

    :param sheet: Лист таблицы XLSX.
    :param sheet_type: Тип листа таблицы.
    """

    headers = [cell.value for cell in sheet[1]]
    if not sorted(headers) == sorted(column_check[sheet_type.value]):
        raise HTTPException(status_code=400, detail={
            'code': 'INVALID_IMPORT_COLUMNS',
            'reason': 'Columns in .xlsx file are invalid.'
        })
    column_map = {index: header for index, header in enumerate(headers)}

    results = []
    for row in sheet.rows:
        record = {}
        for index, cell in enumerate(row):
            # if cell.value is not None:
            record[column_map[index]] = cell.value
        if any(value is not None for value in record.values()):
            results.append(record)

    del results[0]
    return results


async def insert_or_update_db(data: List[Dict[str, Any]], model) -> None:
    """
    Функция добавления новых и обновления уже существующих строк в БД.

    :param data: Список словарей, соответствующий строкам таблицы структуры организации.
    :param model: Модель базы данных, в которую будет доавлена строка.
    """
    async with async_session_maker() as session:
        repository = SQLALchemyRepository()
        repository.model = model
        entities = await repository.find_all()
        data_id_list = [data_id['id'] for data_id in data]
        if entities:
            for entity in entities:
                if entity.id not in data_id_list:
                    await repository.delete_one(entity.id)

        insert_stmt = pg_insert(model).values(data)
        print(insert_stmt)
        update_columns = {col.name: col for col in insert_stmt.excluded if col.name not in ('id')}
        update_statement = insert_stmt.on_conflict_do_update(index_elements=['id'], set_=update_columns)

        await session.execute(update_statement)
        await session.commit()


async def import_org_structure(filename: BinaryIO) -> dict[str, list[dict]]:
    """
    Функция для вызова в API импорта структуры организации.

    В функции указываются, какие листы XLSX будут обрабатываться,
    а к каждому листу указывается ограничение количества колонок.

    :param filename: Передаваемый файл формата XLSX, содержащий структуру организации
    """
    parsed_table = parse_xlsx(file_path=filename)
    employees = parse_sheet(sheet=parsed_table['sheet_employees'], sheet_type=SheetType.EMPLOYEE)
    divisions = parse_sheet(sheet=parsed_table['sheet_division'], sheet_type=SheetType.DIVISION)
    staff_units = parse_sheet(sheet=parsed_table['sheet_staff_units'], sheet_type=SheetType.STAFF_UNIT)
    assignments = parse_sheet(sheet=parsed_table['sheet_assignment'], sheet_type=SheetType.ASSIGNMENT)
    acting = parse_sheet(sheet=parsed_table['sheet_acting'], sheet_type=SheetType.ACTING)
    try:
        await insert_or_update_db(data=employees, model=Employee)
        await insert_or_update_db(data=divisions, model=Division)
        await insert_or_update_db(data=staff_units, model=StaffUnit)
        await insert_or_update_db(data=assignments, model=Assignment)
        await insert_or_update_db(data=acting, model=Acting)
    except:
        raise HTTPException(status_code=400, detail={
            'code': 'INVALID_IMPORT_DATA',
            'reason': 'Your .xlsx file has invalid data.'
        })

    return {
        'employees': employees,
        'divisions': divisions,
        'staff_units': staff_units,
        'assignments': assignments,
        'acting': acting,
    }
