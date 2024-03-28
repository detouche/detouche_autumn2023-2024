import { useState, useRef } from "react";

import { IUser } from "../../models/IUser.ts";

import { Button } from "../../components/Button";
import { PersonalAccountSidebar } from "./PersonalAccountSidebar";
import { useOutsideClick } from "../../hooks/useOutsideClick.ts";

export const PersonalAccountCard = ({
  personalData,
}: {
  personalData: IUser;
}) => {
  const [showPersonalAccountSidebar, setShowPersonalAccountSidebar] =
    useState(false);
  const [showPersonalData, setShowPersonalData] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const handleOpen = () => setShowPersonalData(true);
  const handleClose = () => setShowPersonalData(false);

  // Используем хук для обработки клика вне компонента
  useOutsideClick(modalRef, handleClose);

  return (
    <>
      <div
        className="absolute z-10 top-[calc(50%)] left-[50%]
        translate-x-[-50%]"
        onClick={handleOpen}
      >
        <Button text={"ФИО"} type={"black"} styles={"w-[360px]"} />
      </div>
      {showPersonalData && (
        <div
          className="absolute shadow-[0_4px_13px_0_rgba(0,0,0,0.15)]
        rounded-lg bg-[#fff] p-4 z-10 top-[calc(50%+54px)] left-[50%]
        translate-x-[-50%] w-[360px]"
          ref={modalRef}
        >
          <div
            className={`text-[16px] text-s-gray-900 font-semibold leading-[100%]`}
          >
            {personalData.username}
          </div>
          <div
            className={`text-[14px] text-s-gray-300 font-normal leading-[100%] mt-1`}
          >
            {personalData.staffUnit?.name}
          </div>
          <div
            onClick={() => {
              setShowPersonalAccountSidebar(true);
              handleClose();
            }}
          >
            <Button
              text={"Изменить пароль"}
              type={"black"}
              styles={"text-[16px] mt-3"}
            />
          </div>
        </div>
      )}
      {showPersonalAccountSidebar && (
        <PersonalAccountSidebar
          onClose={() => setShowPersonalAccountSidebar(false)}
        />
      )}
    </>
  );
};
