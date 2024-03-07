export const Button = ({text, type, styles}: 
    {text: string, type: string, styles: string}) => {
    const baseStyle = "text-white bg-s-accent-300 hover:bg-s-accent-400 " +
    "active:bg-s-accent-500 disabled:bg-s-accent-250 disabled:text-[rgba(254,219,169,1)]"
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

    return (
        <button className={`rounded-xl text-xl font-semibold p-[10px_14px]
        ease-out duration-100
        ${type === 'base' ? baseStyle : (type === 'happy' ? happyStyle : (type === 'black'
        ? blackStyle : (type === 'error' ? errorStyle : (type === 'without' && withoutStyle))))} 
        ${styles}`}>
            {text}
        </button>
    )
}