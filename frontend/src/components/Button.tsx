import React from "react"

type ButtonProps = {
    text: string;
    type: string;
    size: string;
    styles: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    imgLeft: string;
    imgRight: string;
}

export const Button = ({text, type, size, styles, onClick, imgLeft, imgRight}: ButtonProps) => {
    const baseStyle = "text-white bg-s-accent-300 hover:bg-s-accent-400 " +
    "active:bg-s-accent-500 disabled:bg-[#F8D8AC] disabled:text-s-accent-500"
    const blackStyle = "text-[#979BA0] border border-[#979BA0] hover:text-s-gray-400 " +
    "hover:border-s-gray-400 active:text-s-gray-900 active:border-s-gray-900 " +
    "disabled:text-s-gray-200 disabled:border-s-gray-200"
    const happyStyle = "text-s-green-300 border border-s-green-300 hover:text-s-green-400 " +
    "hover:border-s-green-400 active:text-s-green-400 active:border-s-green-400 " +
    "disabled:text-s-green-100 disabled:border-s-green-100" 
    const errorStyle = "text-s-error-300 border border-s-error-300 hover:text-s-error-400 " +
    "hover:border-s-error-400 active:text-s-error-400 active:border-s-error-400 " +
    "disabled:text-s-error-100 disabled:border-s-error-100"
    const withoutStyle = "text-s-gray-400 hover:text-s-gray-400 active:text-s-gray-300 " +
    "disabled:text-s-gray-200 focus:text-s-gray-900 focus:border focus:border-s-gray-900"
    
    const smallButton = "p-[6px_10px]"
    const baseButton = "text-xl p-[10px_14px]"

    return (
        <button onClick={onClick} className={`rounded-xl font-semibold ease-out duration-100 w-full
        justify-between flex items-center
        ${size === 'small' ? smallButton : (size === 'base' && baseButton)}
        ${type === 'base' ? baseStyle : (type === 'happy' ? happyStyle : (type === 'black'
        ? blackStyle : (type === 'error' ? errorStyle : (type === 'without' && withoutStyle))))} 
        ${styles}`}>
            {imgLeft != "" && <img className={`${size === 'small' ? 'w-6 h-6' 
            : (size === 'base' && 'w-8 h-8')}`}
            src={imgLeft} alt="" />}
            <span className="flex-[1]">{text}</span>
            {imgRight != "" && <img className={`${size === 'small' ? 'w-6 h-6' 
            : (size === 'base' && 'w-8 h-8')}`} 
            src={imgRight} alt="" />}
        </button>
    )
}