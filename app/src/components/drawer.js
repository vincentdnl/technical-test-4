import React from "react";
import { NavLink } from "react-router-dom";
import { ActivitiesIcon, HomeIcon, PeopleIcon, ProjectsIcon } from "../assets/Icons";

const Drawer = () => {
  return <DrawerDesktop />;
};

const DrawerDesktop = () => {
  return (
    <div className="flex-shrink-0 overflow-y-auto">
      <ul className={`list-none px-3 z-10 border-r border-[#a0a6b124] space-y-2 translate-x-0 duration-200`}>
        <Section title="Général">
          <Link to="/" title="Home" Icon={HomeIcon} />
          <Link to="/project" title="Projects" Icon={ProjectsIcon} />
          <Link to="/activity" title="Activities" Icon={ActivitiesIcon} />
          <Link to="/user" title="People" Icon={PeopleIcon} />
        </Section>

        <div className="h-10" />
      </ul>
    </div>
  );
};

const Link = ({ Icon, title, to, onClick = () => {} }) => {
  return (
    <li>
      <NavLink
        onClick={onClick}
        exact
        style={{ textDecoration: "none" }}
        className="px-4 py-3 w-full h-11 flex gap-3 items-center rounded-xl text-[#676D7C] text-base hover:text-[#0560FD] fill-[#676D7C] hover:fill-[#0560FD]"
        to={to}
        activeClassName="bg-[#0560FD] !text-[#FFFFFF] !fill-[#FFFFFF]">
        <Icon />
        <span>{title}</span>
      </NavLink>
    </li>
  );
};

const Section = ({ children, title }) => {
  return (
    <div>
      <h1
        className="flex gap-1 items-center uppercase text-[10px] text-gray-400 tracking-wide font-semibold mt-4 cursor-pointer hover:underline mb-2"
        onClick={() => setOpen((o) => !o)}>
        {title}
      </h1>

      {children}
    </div>
  );
};

export default Drawer;
