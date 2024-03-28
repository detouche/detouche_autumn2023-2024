import { useState, useEffect } from "react";

import Close from "../img/clear.svg?react";
import Edit from "../img/edit.svg?react";
import Delete from "../img/delete.svg?react";
import { Button } from "../components/Button";
import { Input } from "../components/Input/Input";
import { Textarea } from "../components/Textarea";
import { ICourseTemplateSidebar } from "../models/ICourseTemplate.ts";

export const CourseTemplateSidebar = ({
  onClose,
  templateID = null,
  startAction,
}: {
  onClose: () => void;
  templateID?: number | null;
  startAction: string;
}) => {
  const [action, setAction] = useState(startAction);
  useEffect(() => {
    setAction(startAction);
  }, [startAction, templateID]);
  function CourseTemplateComponent() {
    switch (action) {
      case "edit":
        return (
          <CourseTemplateEditSidebar
            setAction={setAction}
            startAction={startAction}
            onClose={onClose}
            templateID={templateID}
          />
        );
      case "create":
        return (
          <CourseTemplateCreateSidebar
            setAction={setAction}
            onClose={onClose}
            templateID={templateID}
          />
        );
      case "view":
        return (
          <CourseTemplateViewSidebar
            setAction={setAction}
            onClose={onClose}
            templateID={templateID}
          />
        );
      default:
        return null;
    }
  }

  return <>{CourseTemplateComponent()}</>;
};

export const CourseTemplateEditSidebar = ({
  setAction,
  startAction,
  onClose,
  templateID,
}: {
  setAction: (action: string) => void;
  startAction: string;
  onClose: () => void;
  templateID: number | null;
}) => {
  console.log(startAction);
  return (
    <>
      <div className="absolute shadow-[-5px_0_35.5px_0_rgba(0,0,0,0.10)] bg-[#fff] z-10 right-[0] top-[0] w-[640px] h-[100vh]">
        <div className="flex flex-col h-[100vh]">
          <div className="flex justify-between p-7 border-b-[1px] border-s-gray-150">
            <p
              className={`text-[24px] text-s-gray-900 font-bold leading-[100%]`}
            >
              Редактирование шаблона курса
            </p>
            <button onClick={onClose}>
              <Close />
            </button>
          </div>
          <ul className="p-7 flex-grow overflow-x-auto font-normal text-[16px] custom-ul border-b-[1px]">
            <li className="inline-block">
              <Input
                type={"text"}
                label={"Название курса"}
                placeholder={"Введите название курса"}
                styles={"mt-[8px] w-[584px]"}
                point={true}
              />
            </li>
            <li className="flex">
              <div>
                <Input
                  type={"text"}
                  label={"Тип курса"}
                  placeholder={"Введите тип курса"}
                  styles={"mt-[8px] !max-w-[282px]"}
                  point={true}
                />
              </div>
              <div className="ml-[20px]">
                <Input
                  type={"text"}
                  label={"Категория курса"}
                  placeholder={"Введите категорию курса"}
                  styles={"mt-[8px] !max-w-[282px]"}
                  point={true}
                />
              </div>
            </li>
            <li className="inline-block">
              <Textarea
                label={"Описание курса"}
                placeholder={"Введите название курса"}
                styles={"mt-[8px] w-[584px]"}
                point={false}
              />
            </li>
            <li className="inline-block">
              <Input
                type={"text"}
                label={"Учебный центр"}
                placeholder={"Введите учебный центр"}
                styles={"mt-[8px] w-[584px]"}
                point={false}
              />
            </li>
            <li className="inline-block">
              <Input
                type={"text"}
                label={"Стоимость обучения"}
                placeholder={"Введите стоимость обучения"}
                styles={"mt-[8px] w-[584px]"}
                point={false}
              />
            </li>
          </ul>
          <div className="flex p-7 border-s-gray-150 space-x-3">
            <div
            // onClick={onClose}
            >
              <Button
                text={"Сохранить"}
                type={"base"}
                styles={"text-[16px] p-[6px_10px] "}
              />
            </div>
            <div
              onClick={
                startAction === "view" ? () => setAction("view") : onClose
              }
            >
              <Button
                text={"Отменить"}
                type={"black"}
                styles={"text-[16px] p-[6px_10px]"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const CourseTemplateCreateSidebar = ({
  setAction,
  templateID,
  onClose,
}: {
  setAction: (action: string) => void;
  templateID: number | null;
  onClose: () => void;
}) => {
  return (
    <>
      <div className="absolute shadow-[-5px_0_35.5px_0_rgba(0,0,0,0.10)] bg-[#fff] z-10 right-[0] top-[0] w-[640px] h-[100vh]">
        <div className="flex flex-col h-[100vh]">
          <div className="flex justify-between p-7 border-b-[1px] border-s-gray-150">
            <p
              className={`text-[24px] text-s-gray-900 font-bold leading-[100%]`}
            >
              Новый шаблон курса
            </p>
            <button onClick={onClose}>
              <Close />
            </button>
          </div>
          <ul className="p-7 flex-grow overflow-x-auto font-normal text-[16px] custom-ul border-b-[1px]">
            <li className="inline-block mw">
              <Input
                type={"text"}
                label={"Название курса"}
                placeholder={"Введите название курса"}
                styles={"mt-[8px] !w-[584px]"}
                point={true}
              />
            </li>
            <li className="flex">
              <div>
                <Input
                  type={"text"}
                  label={"Тип курса"}
                  placeholder={"Введите тип курса"}
                  styles={"mt-[8px] !max-w-[282px]"}
                  point={true}
                />
              </div>
              <div className="ml-[20px]">
                <Input
                  type={"text"}
                  label={"Категория курса"}
                  placeholder={"Введите категорию курса"}
                  styles={"mt-[8px] !max-w-[282px]"}
                  point={true}
                />
              </div>
            </li>
            <li className="inline-block">
              <Textarea
                label={"Описание курса"}
                placeholder={"Введите название курса"}
                styles={"mt-[8px] w-[584px]"}
                point={false}
              />
            </li>
            <li className="inline-block">
              <Input
                type={"text"}
                label={"Учебный центр"}
                placeholder={"Введите учебный центр"}
                styles={"mt-[8px] w-[584px]"}
                point={false}
              />
            </li>
            <li className="inline-block">
              <Input
                type={"text"}
                label={"Стоимость обучения"}
                placeholder={"Введите стоимость обучения"}
                styles={"mt-[8px] w-[584px]"}
                point={false}
              />
            </li>
          </ul>
          <div className="flex p-7 border-s-gray-150 space-x-3">
            <div
            // onClick={onClose}
            >
              <Button
                text={"Сохранить"}
                type={"base"}
                styles={"text-[16px] p-[6px_10px] "}
              />
            </div>
            <div onClick={onClose}>
              <Button
                text={"Отменить"}
                type={"black"}
                styles={"text-[16px] p-[6px_10px]"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const CourseTemplateViewSidebar = ({
  setAction,
  onClose,
  templateID,
}: {
  setAction: (action: string) => void;
  onClose: () => void;
  templateID: number | null;
}) => {
  const courseTemplateData: ICourseTemplateSidebar[] = [
    {
      id: 1,
      title:
        "Основы JavaScript Основы JavaScript Основы JavaScript Основы JavaScript Основы JavaScript Основы JavaScript",
      type: "Онлайн курс",
      category: "Программирование",
      description: "Пример описания1",
      educationCenter: "Центр обучения1",
      cost: 1,
    },
    {
      id: 2,
      title: "Продвинутый CSS",
      type: "Оффлайн семинар",
      category: "Веб-дизайн",
      description: "Пример описания2",
      educationCenter: "Центр обучения2",
      cost: 2,
    },
    {
      id: 3,
      title: "React с нуля",
      type: "Онлайн курс",
      category: "Программирование",
      description: "Пример описания3",
      educationCenter: "Центр обучения3",
      cost: 3,
    },
    {
      id: 4,
      title: "Принципы SOLID",
      type: "Вебинар",
      category: "Программирование",
      description: "Пример описания4",
      educationCenter: "Центр обучения4",
      cost: 4,
    },
  ];
  const [courseData, setCourseData] = useState<ICourseTemplateSidebar | null>(
    null,
  );
  useEffect(() => {
    const course = courseTemplateData.find(
      (course) => course.id === templateID,
    );
    if (course) {
      setCourseData(course);
    }
  }, [templateID]);

  return (
    <>
      <div className="absolute shadow-[-5px_0_35.5px_0_rgba(0,0,0,0.10)] bg-[#fff] z-10 right-[0] top-[0] w-[640px] h-[100vh]">
        <div className="flex flex-col h-[100vh]">
          <div className="border-b-[1px] p-7 border-s-gray-150">
            <div className="flex justify-between">
              <p
                className={`text-[24px] text-s-gray-900 font-bold leading-[100%]`}
              >
                {courseData?.title}
              </p>
              <button onClick={onClose}>
                <Close />
              </button>
            </div>
            <div className="mt-5">
              <button
                className="border-button-sidebar"
                onClick={() => setAction("edit")}
              >
                <Edit />
              </button>
              <button className="border-button-sidebar ml-4">
                <Delete />
              </button>
            </div>
          </div>
          <ul className="p-7 flex-grow overflow-x-auto font-normal text-[16px] custom-ul">
            <li>
              <p className="text-s-gray-300">Тип курса:</p>
              <p className="text-s-gray-900">{courseData?.type}</p>
            </li>
            <li>
              <p className="text-s-gray-300">Категория курса:</p>
              <p className="text-s-gray-900">{courseData?.category}</p>
            </li>
            <li>
              <p className="text-s-gray-300">Описание:</p>
              <p className="text-s-gray-900">{courseData?.description}</p>
            </li>
            <li>
              <p className="text-s-gray-300">Центр обучения:</p>
              <p className="text-s-gray-900">{courseData?.educationCenter}</p>
            </li>
            <li>
              <p className="text-s-gray-300">Стоимсоть:</p>
              <p className="text-s-gray-900">{courseData?.cost}</p>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
