import { useState, useEffect, useRef } from "react";

import Close from "../../img/clear.svg?react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input/Input";

export const PersonalAccountSidebar = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  return (
    <>
      <div className="absolute right-0 top-[0] z-10 shadow-[-5px_0_35.5px_0_rgba(0,0,0,0.10)] bg-[#fff] w-[640px] h-[100vh]">
        <div className="flex flex-col h-[100vh]">
          <div className="flex justify-between p-7 border-b-[1px] border-s-gray-150">
            <p
              className={`text-[24px] text-s-gray-900 font-bold leading-[100%] mt-1`}
            >
              Изменение пароля
            </p>
            <button onClick={onClose}>
              <Close />
            </button>
          </div>
          <ul className="p-7 flex-grow overflow-x-auto font-normal text-[16px] custom-ul border-b-[1px]">
            <li className="inline-block">
              <Input
                  type={"password"}
                  label={"Текущий пароль"}
                  placeholder={"Введите текущий пароль"}
                  styles={"w-[584px] mt-[8px]"}
                  point={true}
              />
            </li>
            <li className="inline-block">
              <Input
                  type={"password"}
                  label={"Новый пароль"}
                  placeholder={"Введите новый пароль"}
                  styles={"w-[584px] mt-[8px]"}
                  point={true}
              />
            </li>
            <li className="inline-block">
              <Input
                  type={"password"}
                  label={"Подтверждение нового пароля"}
                  placeholder={"Введите новый пароль"}
                  styles={"w-[584px] mt-[8px]"}
                  point={true}
              />
            </li>
          </ul>
          <div className="flex p-7 border-s-gray-150 space-x-3">
            <div onClick={onClose}>
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
