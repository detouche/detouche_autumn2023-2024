import { useState, useRef } from "react";

import { Button } from "./Button.tsx";
import { useOutsideClick } from "../hooks/useOutsideClick.ts";

import Download from "../img/download.svg?react";

export const AdminCard = () => {
  const [showAdminMenu, setShowAdminMenu] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const handleOpen = (): void => setShowAdminMenu(true);
  const handleClose = (): void => setShowAdminMenu(false);

  // Используем хук для обработки клика вне компонента
  useOutsideClick(modalRef, handleClose);

  return (
    <>
      <div
        className="absolute z-10 top-[calc(50%)] left-[50%]
        translate-x-[-50%]"
        onClick={handleOpen}
      >
        <Button
          text={"Администрирование"}
          type={"black"}
          styles={"w-[340px]"}
        />
      </div>
      {showAdminMenu && (
        <div
          className="absolute shadow-[0_5px_13px_0_rgba(0,0,0,0.11)]
        rounded-lg bg-[#fff] z-10 top-[calc(50%+54px)] left-[50%]
        translate-x-[-50%] w-[340px]"
          ref={modalRef}
        >
          <div
            onClick={() => {
              handleClose();
            }}
            className="flex items-center text-[16px] text-s-gray-900 font-semibold leading-[100%] border-b-[1px] cursor-pointer p-[24px]"
          >
            <Download />
            <p className="ml-3">Экспортировать отчет по тратам</p>
          </div>
          <div
            onClick={() => {
              handleClose();
            }}
            className="text-[16px] text-s-gray-900 font-semibold leading-[100%] border-b-[1px] cursor-pointer"
          >
            <p className="p-[24px]">Шаблоны курсов</p>
          </div>
        </div>
      )}
    </>
  );
};
