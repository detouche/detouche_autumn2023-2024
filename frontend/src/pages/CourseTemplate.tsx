import { useState } from "react";

import { CourseTemplateSidebar } from "../components/CourseTemplateSidebar.tsx";
import { Button } from "../components/Button";

import Edit from "../img/edit.svg?react";
import Delete from "../img/delete.svg?react";
import SortUp from "../img/sorting_up.svg?react";
import SortDown from "../img/sorting_down.svg?react";

import { ICourseTemplate } from "../models/ICourseTemplate.ts";

export const CourseTemplate = () => {
  const [showCourseTemplateSidebar, setShowCourseTemplateSidebar] =
    useState(false);
  const [showActionButtonCourseTemplate, setShowActionButtonCourseTemplate] =
    useState<number>();
  const [showActionButton, setShowActionButton] = useState(false);
  const [action, setAction] = useState<string>("");
  const [templateID, setTemplateID] = useState<number | null>(null);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const courseTemplateData: ICourseTemplate[] = [
    {
      id: 1,
      title:
        "Основы JavaScript Основы JavaScript Основы JavaScript Основы JavaScript Основы JavaScript Основы JavaScript",
      type: "Онлайн курс",
      category: "Программирование",
      date: new Date("2022-07-14"),
      author: "Алексей Иванов",
    },
    {
      id: 2,
      title: "Продвинутый CSS",
      type: "Оффлайн семинар",
      category: "Веб-дизайн",
      date: new Date("2022-09-01"),
      author: "Мария Семенова",
    },
    {
      id: 3,
      title: "React с нуля",
      type: "Онлайн курс",
      category: "Программирование",
      date: new Date("2023-01-15"),
      author: "Иван Петров",
    },
    {
      id: 4,
      title: "Принципы SOLID",
      type: "Вебинар",
      category: "Программирование",
      date: new Date("2022-11-20"),
      author: "Елена Васильева",
    },
  ];

  const openSidebarClick = (
    e: React.MouseEvent,
    templateID: number | null = null,
    action: string,
  ) => {
    e.stopPropagation();
    setShowCourseTemplateSidebar(true);
    setTemplateID(templateID);
    setAction(action);
  };

  /// Состояние для отслеживания активного столбца сортировки
  const [sortField, setSortField] = useState<string | null>(null);
  /// Состояние для направления сортировки
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "default">(
    "default",
  );
  /// Эта функция переключает состояние сортировки между возрастающим, убывающим и дефолтным порядком.
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(
        sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "default" : "asc",
      );
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  let sortedData = [...courseTemplateData];

  ///Модифиция courseTemplateData перед отображением в таблице, используя выбранные поля и направление сортировки.
  if (sortField && sortOrder !== "default") {
    sortedData.sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (a[sortField] > b[sortField]) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
  }
  return (
    <>
      <div className="h-[100vh] p-[96px_32px_32px_96px]">
        <div className="flex items-center">
          <h1
            className={`text-[32px] text-[#000000] font-semibold leading-[100%]`}
          >
            Шаблоны курсов
          </h1>
          <div
            onClick={(e) => {
              openSidebarClick(e, null, "create");
              setActiveRow(null);
            }}
          >
            <Button text={"Добавить"} type={"black"} styles={"ml-[24px]"} />
          </div>
        </div>
        <div className="mt-8 max-h-[75vh] overflow-y-auto">
          <table className="w-[100%]">
            <thead className="sticky top-[0] bg-[#F8F8F8] border-b-[1px] border-s-gray-150">
              <tr>
                <th className="text-left p-[4px_12px] max-w-[19%] w-[19%]">
                  <div className="flex justify-between items-center">
                    <p className="text-[14px] text-s-gray-900 font-semibold leading-[100%]">
                      Название
                    </p>
                    <div onClick={() => handleSort("title")}>
                      <SortUp
                        className={`${sortOrder === "desc" && sortField === "title" && "opacity-0"}`}
                      />
                      <SortDown className={`${sortOrder === "asc" && sortField === "title" && "opacity-0"}`}/>
                    </div>
                  </div>
                </th>
                <th className="text-left p-[4px_12px] max-w-[19%] w-[19%]">
                  <div className="flex justify-between items-center">
                    <p className="text-[14px] text-s-gray-900 font-semibold leading-[100%]">
                      Тип
                    </p>
                    <div></div>
                    <div onClick={() => handleSort("type")}>
                      <SortUp
                        className={`${sortOrder === "desc" && sortField === "type" && "opacity-0"}`}
                        />
                      <SortDown className={`${sortOrder === "asc" && sortField === "type" && "opacity-0"}`}/>
                    </div>
                  </div>
                </th>
                <th className="text-left p-[4px_12px] max-w-[19%] w-[19%]">
                  <div className="flex justify-between items-center">
                    <p className="text-[14px] text-s-gray-900 font-semibold leading-[100%]">
                      Категория
                    </p>
                    <div onClick={() => handleSort("category")}>
                      <SortUp
                          className={`${sortOrder === "desc" && sortField === "category" && "opacity-0"}`}
                      />
                      <SortDown className={`${sortOrder === "asc" && sortField === "category" && "opacity-0"}`}/>
                    </div>
                  </div>
                </th>
                <th className="text-left p-[4px_12px] max-w-[19%] w-[19%]">
                  <div className="flex justify-between items-center">
                    <p className="text-[14px] text-s-gray-900 font-semibold leading-[100%]">
                      Дата создания
                    </p>
                    <div onClick={() => handleSort("date")}>
                      <SortUp
                          className={`${sortOrder === "desc" && sortField === "date" && "opacity-0"}`}
                      />
                      <SortDown className={`${sortOrder === "asc" && sortField === "date" && "opacity-0"}`}/>
                    </div>
                  </div>
                </th>
                <th className="text-left p-[4px_12px] max-w-[17%] w-[17%]">
                  <div className="flex justify-between items-center">
                    <p className="text-[14px] text-s-gray-900 font-semibold leading-[100%]">
                      Автор
                    </p>
                    <div onClick={() => handleSort("author")}>
                      <SortUp
                          className={`${sortOrder === "desc" && sortField === "author" && "opacity-0"}`}
                      />
                      <SortDown className={`${sortOrder === "asc" && sortField === "author" && "opacity-0"}`}/>
                    </div>
                  </div>
                </th>
                <th className="text-right p-[4px_12px] text-[14px] text-s-gray-900 font-semibold leading-[100%] min-w-[108px]"></th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((data) => (
                <tr
                  className={`cursor-pointer hover:bg-s-gray-50 ${activeRow === data.id && "bg-s-gray-100"}`}
                  onClick={(e) => {
                    openSidebarClick(e, data.id, "view");
                    setActiveRow(data.id);
                  }}
                  onMouseEnter={() => {
                    setShowActionButton(true);
                    setShowActionButtonCourseTemplate(data.id);
                  }}
                  onMouseLeave={() => setShowActionButton(false)}
                  key={data.id}
                >
                  <td className="text-left p-[15px_12px] text-[14px] text-s-gray-900 font-normal leading-[100%] w-[19%] max-w-[19%]">
                    <p className="line-clamp-1">{data.title}</p>
                  </td>
                  <td className="text-left p-[15px_12px] text-[14px] text-s-gray-900 font-normal leading-[100%] max-w-[19%] w-[19%]">
                    <p className="line-clamp-1">{data.type}</p>
                  </td>
                  <td className="text-left p-[15px_12px] text-[14px] text-s-gray-900 font-normal leading-[100%] max-w-[19%] w-[19%]">
                    <p className="line-clamp-1">{data.category}</p>
                  </td>
                  <td className="text-left p-[15px_12px] text-[14px] text-s-gray-900 font-normal leading-[100%] max-w-[19%] w-[19%]">
                    <p className="line-clamp-1">
                      {data.date.toLocaleDateString("ru-RU")}
                    </p>
                  </td>
                  <td className="text-left p-[15px_12px] text-[14px] text-s-gray-900 font-normal leading-[100%] max-w-[17%] w-[17%]">
                    <p className="line-clamp-1">{data.author}</p>
                  </td>
                  <td className="text-right p-[6px_12px] min-w-[108px]">
                    {showActionButton &&
                      showActionButtonCourseTemplate === data.id && (
                        <ul className="flex justify-end max-h-[32px]">
                          <li>
                            <button
                              onClick={(e) => {
                                openSidebarClick(e, data.id, "edit");
                                setActiveRow(data.id);
                              }}
                              className="p-[4px]"
                            >
                              <Edit />
                            </button>
                          </li>
                          <li className="ml-3">
                            <button className="p-[4px]">
                              <Delete />
                            </button>
                          </li>
                        </ul>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showCourseTemplateSidebar && (
        <CourseTemplateSidebar
          onClose={() => {
            setShowCourseTemplateSidebar(false);
            setActiveRow(null);
          }}
          templateID={templateID}
          startAction={action} // Используем состояние action для передачи в пропс
        />
      )}
    </>
  );
};
