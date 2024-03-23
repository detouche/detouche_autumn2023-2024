import Logo from "../../img/Logo.svg?react"
import { Button } from "../../components/Button"

export const ResetCheckEmail = () => {
    const handleClick = () => {
        alert('Button Clicked!');
    };

    return (
        <div className="flex flex-col items-center h-[calc(100vh-50px)]">
            <Logo className="mt-20 mb-auto" />
            <div className="flex flex-col justify-center items-center mb-auto
            w-full max-w-[620px]">
                <span className="text-[#000] text-[32px] font-bold
                mb-[60px]">
                    Проверьте свою почту
                </span>
                <p className="text-2xl mb-[60px] text-center">
                    На ваш адрес электронной почты example@gmail.com
                    <br />
                    была отправлена ссылка для сброса пароля
                </p>
                <Button onClick={handleClick} size="base"
                text={"Вернуться ко входу"} type={"base"} styles={"max-w-[490px]"} />
            </div>
        </div>
    )
}