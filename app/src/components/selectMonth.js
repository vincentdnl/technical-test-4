import React, { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default ({ value = "", onChange, start = 0, name = "date", indexDefaultValue, showArrows = false, placeholder = "All Time", disabled = false }) => {
  const [months, setMonths] = useState([]);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handleNavigation = (offset) => {
    const d = new Date(value);
    const valueDate = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
    const index = months.findIndex((m) => m.getTime() === valueDate.getTime());
    onChange({ target: { value: months[index + offset], name } });
  };

  useEffect(() => {
    const arr = [];
    const d = new Date();
    for (let i = start; i < 20; i++) {
      arr.push(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - i, 1)));
    }
    setMonths(arr);
    if (!value && indexDefaultValue >= 0) onChange({ target: { value: arr[indexDefaultValue], name } });
  }, []);

  return (
    <div className="flex gap-2 items-center">
      <select
        disabled={disabled}
        className="w-[180px] bg-[#FFFFFF] text-[14px] text-[#212325] font-normal py-[10px] px-[14px] rounded-[10px] border-r-[16px] border-[transparent] cursor-pointer shadow-sm"
        name={name}
        value={value}
        onChange={onChange}>
        <option disabled>Month</option>
        <option key={""} value={""}>
          {placeholder}
        </option>
        {months.map((e) => {
          return <option key={e} value={e}>{`${monthNames[e.getMonth()]} ${e.getFullYear()}`}</option>;
        })}
      </select>
      {showArrows ? (
        <>
          <div className="flex items-center justify-center w-7 h-7 bg-[#FFFFFF] rounded-full cursor-pointer shadow-sm" onClick={() => handleNavigation(1)}>
            <IoIosArrowBack />
          </div>
          <div className="flex items-center justify-center w-7 h-7 bg-[#FFFFFF] rounded-full cursor-pointer shadow-sm" onClick={() => handleNavigation(-1)}>
            <IoIosArrowForward />
          </div>
        </>
      ) : null}
    </div>
  );
};
