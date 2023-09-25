import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo_full_blue.png";
import { setUser } from "../../redux/auth/actions";
import api from "../../services/api";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.Auth.user);
  async function logout() {
    await api.post(`/user/logout`);
    dispatch(setUser(null));
  }

  async function handleAvailability(availability) {
    if (availability === "available" || availability === "not available") {
      const res = await api.put(`/user`, { availability });
      dispatch(setUser(res.data));
      toast.success("Status Updated!");
    }
  }

  const menuStyling = {
    menuOpacity: `${open ? "opacity-10" : "opacity-0"}`,
    menuVisibility: `${open ? "block" : "hidden"}`,
    menuTransition: `${open ? "translate-x-0" : "translate-x-[105%]"}`,
  };

  return (
    <div className="p-2 bg-[#EBF3FC] border-b border-[#a0a6b124] flex justify-between items-center w-full right-4 z-50">
      <div className="flex items-center gap-4">
        <Link to="/" className="group flex items-end hover:no-underline">
          <img src={Logo} height={24} width={24} />
        </Link>
      </div>
      {/* DropDown */}
      <div className="relative flex gap-10">
        <div>
          <select
            value={user.availability}
            onChange={(e) => handleAvailability(e.target.value)}
            className="w-[180px] bg-[#FFFFFF] text-[13px] text-[#212325]  font-normal py-[10px] px-[14px] rounded-[10px] border-r-[16px] border-[transparent] cursor-pointer shadow-sm">
            <option value="available">Available</option>
            <option value="not available">Not Available</option>
          </select>
        </div>
        <img className="w-9 h-9 bg-[#aaa] rounded-full cursor-pointer object-cover" onClick={() => setOpen(!open)} src={user.avatar} />
        {/* Menu */}
        <div
          className={`w-screen md:w-[150px] h-screen md:h-fit rounded overflow-hidden z-0 bg-[#fff] opacity-[${menuStyling.menuOpacity}] 
          ${menuStyling.menuVisibility} translate-x-[${menuStyling.menuTransition}] transition duration-100 ease-in fixed top-0 right-0  md:absolute md:top-[calc(100%_+_10px)] z-50 md:z-10 shadow-menuShadow `}
          open={open}>
          <div className="text-3xl mt-3 cursor-pointer	text-[#666] block w-[45px] py-0	px-3.5	ml-auto	md:hidden " onClick={() => setOpen(false)}>
            &times;
          </div>
          <div className="text-[15px] font-[Arial] text-left text-[#888888] cursor-pointer border-l-4 border-[#ffffff] hover:border-[#4d90fb] hover:bg-[#d3bfc731] hover:text-[#333]">
            <Link className="text-inherit p-[10px] hover:text-[#333] hover:no-underline block" to="/account">
              My account
            </Link>
          </div>
          <div
            className="text-[15px] font-[Arial] p-[10px] text-left text-[#888888] cursor-pointer border-l-4 border-[#ffffff] hover:border-red-400 hover:bg-[#d3bfc731] hover:text-[#333]"
            onClick={logout}>
            <Link style={{ textDecoration: "none" }} className="text-inherit hover:text-[#333]" to="#">
              Logout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
