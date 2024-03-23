import Logo from "../../img/Logo.svg?react"
import { Button } from "../../components/Button"

export const NotVerificate = () => {
    const handleClick = () => {
        alert('Button Clicked!');
    };

    return (
        <div className="flex flex-col items-center h-[calc(100vh-50px)]">
            <Logo className="mt-20 mb-auto" />
            <div className="flex flex-col justify-center items-center mb-auto
            max-w-[791px] w-full">
                <span className="text-[#000] text-[32px] font-bold
                mb-[60px]">
                    Вы не подтвердили свой аккаунт
                </span>
                <p className="text-2xl mb-[60px] text-center">
                    Для входа подтвердите свой аккаунт.
                    <br />
                    Чтобы повторно получить письмо для подтверждения
                    <br />
                    отправьте его повторно
                </p>
                <Button onClick={handleClick} size="base" 
                text={"Отправить ещё раз"} type={"base"} styles={"max-w-[490px] mb-3"} />
                <Button onClick={handleClick} size="base" 
                text={"Вход"} type={"without"} styles={"max-w-[76px]"} />
            </div>
        </div>
    )
}