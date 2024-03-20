import RedPoint from "../../img/red_point.svg?react"
import Chevron from "../../img/chevron_left.svg?react"
import Clear from "../../img/clear.svg?react"
import Cancel from "../../img/cancel.svg?react"
import { useState } from "react"
import { Checkbox } from "../Checkbox"
import { useDispatch, useSelector } from "react-redux"
import { updateGroupSelect, clearGroupSelect } from "../../store/features/selectSlice"
import type { RootState } from "../../store/store"

// используется для селекта множества элементов, передавать можно: лейбл, плейсхолдер,
// красную точку сверху, массив элементов для селекта, а также стили
export const SelectGroup = ({label, placeholder, point, selectList, styles}:
    {label: string, placeholder: string, point: boolean, selectList: object[],
        styles: string}) => {
    // поиск элементов в инпуте
    const [searchData, setSearchData] = useState("")
    // показ дропдауна
    const [dropdown, setDropdown] = useState(false)
    // массив элементов для селекта
    const [list, setList] = useState(selectList)
    
    const dispatch = useDispatch()
    // получаем массив выбранных элементов
    const selectedData = useSelector((state: RootState) => state.select.groupSelect)
    // поиск элемента в инпуте 
    const handleSearch = (search: string) => {
        if (search != "") {
            const filteredData = selectList.filter(
                item => item.name.toLowerCase().startsWith(search.toLowerCase())
            )
            setList(filteredData)
        } else {
            setList(selectList)
        }
    }
    // ввод в инпут
    const handleChange = (e) => {
        setSearchData(e.target.value)
        handleSearch(e.target.value);
    }
    // добавление элемента в массив редакс
    const handleSelect = (data: object) => {
        dispatch(updateGroupSelect({data, selectedData}))
    }
    
    return (
        <div className="float-left">
            <div className="flex items-baseline">
                <label className="block text-s-gray-900 text-base mr-1" 
                htmlFor="select">
                    {label}
                </label>
                {point && <RedPoint />}            
            </div>
            <div className="relative w-[490px]">
                <input onChange={handleChange} 
                onFocus={() => setDropdown(true)}
                className={`p-[12px_14px] outline-none border
                border-s-gray-150 placeholder:text-s-gray-200 placeholder:text-lg block
                text-lg text-s-gray-900
                invalid:border-s-error-300 w-[inherit]
                ${selectedData.length > 0 ? 'rounded-t-lg rounded-b-none border-b-0'
                : 'rounded-lg'}
                ${dropdown ? 'rounded-t-lg rounded-b-none' : 'rounded-lg'}
                ${styles}`}
                placeholder={placeholder} id="input" />
                <Chevron onClick={() => {
                    dropdown ? setDropdown(false) : setDropdown(true)
                }}
                className={`fill-s-gray-900 absolute top-3 cursor-pointer
                right-5 ${dropdown ? 'rotate-90' :'-rotate-90'}`} />
                <Clear onClick={() => dispatch(clearGroupSelect())}
                className="absolute top-[14px] cursor-pointer right-[50px]" />
                {selectedData.length > 0 && (
                    <div className={`flex py-2 flex-wrap gap-[7px] px-[14px]
                    border border-t-0
                    ${dropdown ? 'rounded-b-none' : 'rounded-b-lg'}`}>
                        {selectedData.map((data) => (
                            <div className="flex items-center p-[4px_8px]
                            bg-[#E4E4E4] rounded-lg">
                                <Cancel onClick={() => handleSelect(data)} 
                                className="mr-1 cursor-pointer" />
                                <span className="text-s-gray-900 text-[14px]">
                                    {data.name}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
                {dropdown && (
                <ul className="list-none absolute left-0 right-0 border-s-gray-150
                max-h-[200px] overflow-y-auto bg-white border rounded-b-lg">
                    {list.slice(0,10).map((data) => {
                        const filterChecked = selectedData.includes(data)  
                        return (
                            <li onClick={() => handleSelect(data)}
                            className="py-3 px-[14px] flex
                            transition-colors cursor-pointer hover:bg-s-gray-50">
                                <Checkbox filterChecked={filterChecked} />
                                <div>
                                   <div className="text-black text-[18px] leading-[100%]">
                                        {data.name}
                                    </div>
                                    <span className="text-s-gray-300 text-[12px] leading-normal">
                                        {data.post}
                                    </span>  
                                </div>      
                            </li> 
                        )
                    })}
                </ul>)}
            </div>
        </div>
    )
}