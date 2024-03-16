import { useState, useEffect, useRef } from "react";

import { Button } from "../../components/Button";
import { PersonalAccountSidebar } from "./PersonalAccountSidebar";

type PersonalData = {
  name: string;
  staffUnitPost: string;
};

export const PersonalAccountCard = ({
  personalData,
}: {
  personalData: PersonalData;
}) => {
  const [showPersonalAccountSidebar, setShowPersonalAccountSidebar] =
    useState(false);
  const [showPersonalData, setShowPersonalData] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const handleOpen = () => setShowPersonalData(true);
  const handleClose = () => setShowPersonalData(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    // Добавляем обработчик событий при монтировании компонента
    document.addEventListener("mousedown", handleClickOutside);

    // Возвращаем функцию для очистки, которая удаляет обработчик событий при размонтировании компонента
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

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
            {personalData.name}
          </div>
          <div
            className={`text-[14px] text-s-gray-300 font-normal leading-[100%] mt-1`}
          >
            {personalData.staffUnitPost}
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
