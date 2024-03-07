import Logo from "../../img/Logo.svg?react"
import { Button } from "../../components/Button"

export const NotVerificate = () => {
    return (
        <div className="flex flex-col items-center h-[100vh]">
            <Logo className="mt-20 mb-auto" />
            <div className="flex flex-col justify-center items-center mb-auto">
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
                <Button text={"Отправить ещё раз"} type={"base"} styles={"w-[490px] mb-3"} />
                <Button text={"Вход"} type={"without"} styles={""} />
            </div>
        </div>
    )
}