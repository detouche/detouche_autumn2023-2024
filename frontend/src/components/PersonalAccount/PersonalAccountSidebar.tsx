import { useState, useEffect, useRef } from "react";

import Clear from "../../img/clear.svg?react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input/Input";

export const PersonalAccountSidebar = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  return (
    <>
      <div className="absolute shadow-[-5px_0_35.5px_0_rgba(0,0,0,0.10)] bg-[#fff] z-10 right-[0] w-[584px] h-[100vh] flex flex-col">
        <div className="flex justify-between p-7 border-b-[1px] border-s-gray-150">
          <p
            className={`text-[24px] text-s-gray-900 font-bold leading-[100%] mt-1`}
          >
            Изменение пароля
          </p>
          <button onClick={onClose}>
            <Clear />
          </button>
        </div>
        <div className="p-7 flex-grow overflow-x-auto border-b-[1px]">
          <Input
            type={"password"}
            label={"Текущий пароль"}
            placeholder={"Введите текущий пароль"}
            styles={"mb-[30px] mt-[8px]"}
            point={true}
          />
          <Input
            type={"password"}
            label={"Новый пароль"}
            placeholder={"Введите новый пароль"}
            styles={"mb-[30px] mt-[8px]"}
            point={true}
          />
          <Input
            type={"password"}
            label={"Подтверждение нового пароля"}
            placeholder={"Введите новый пароль"}
            styles={"mb-[30px] mt-[8px]"}
            point={true}
          />
        </div>
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
    </>
  );
};
