import { Chart as ChartJS, registerables } from "chart.js";
import React, { useEffect, useState } from "react";
import { IoIosAt, IoIosLink, IoIosStats, IoLogoGithub } from "react-icons/io";
import { RiRoadMapLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { getDaysInMonth } from "./utils";

import Loader from "../../components/loader";
import api from "../../services/api";

import ProgressBar from "../../components/ProgressBar";
import SelectMonth from "./../../components/selectMonth";

ChartJS.register(...registerables);

export default function ProjectView() {
  const [project, setProject] = useState(null);
  const [copied, setCopied] = React.useState(false);
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const { data: u } = await api.get(`/project/${id}`);
      setProject(u);
    })();
  }, []);

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 3000);
    }
  }, [copied]);

  if (!project) return <Loader />;

  return (
    <React.Fragment>
      <div className="pl-20 pt-24 pb-4 w-[98%]">
        <div className="bg-[#FFFFFF] border border-[#E5EAEF] py-3 rounded-[16px]">
          <div className="flex justify-between px-3 pb-2  border-b border-[#E5EAEF]">
            <div>
              <span className="text-[18px] text-[#212325] font-semibold">Project details</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => history.push(`/project/edit/${project?._id}`)}
                className="border !border-[#0560FD] text-[#0560FD] py-[7px] px-[20px] bg-[#FFFFFF] rounded-[16px]">
                Edit
              </button>
            </div>
          </div>
          <ProjectDetails project={project} />
        </div>
      </div>
    </React.Fragment>
  );
}

const ProjectDetails = ({ project }) => {
  console.log(project);
  return (
    <div>
      <div className="flex flex-wrap p-3">
        <div className="w-full ">
          <div className="flex gap-3">
            <div className="w-full">
              <div className="flex justify-between gap-2">
                <div className="flex gap-20">
                  <span className="w-fit text-[20px] text-[#0C1024] font-bold">Nom du projet : </span>
                  <span className="w-fit text-[20px] text-[#0C1024] font-bold">{project.name.toString()}</span>
                </div>
                <div className="flex flex-1 flex-column items-end gap-3">
                  <Links project={project} />
                </div>
              </div>
              <div className="w-full md:w-[50%]">
                <div className="pt-2 ">
                  <span className="text-[16px] text-[#676D7C] font-medium">{project.description ? project.description : ""}</span>
                </div>
                <div className="mt-4 text-[18px] text-[#000000] font-semibold">
                  {`Objective :`} <span className="text-[#676D7C] text-[16px] font-medium">{project.objective ? project.objective : ""}</span>
                </div>
                <div className="mt-2 mr-2">
                  <span className="text-[18px] font-semibold text-[#000000]">Budget consummed {project.paymentCycle === "MONTHLY" && "this month"}:</span>

                  <Budget project={project} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap p-3 gap-4"></div>
      <Activities project={project} />
    </div>
  );
};
const Budget = ({ project }) => {
  const [activities, setActivities] = useState([10, 29, 18, 12]);

  useEffect(() => {
    (async () => {
      let d = new Date();
      let dateQuery = "";
      if (project.paymentCycle === "ONE_TIME") {
        d = new Date(project.created_at);
        dateQuery = "gte:";
      }
      const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
      const { data } = await api.get(`/activity?projectId=${encodeURIComponent(project._id)}&date=${dateQuery}${date.getTime()}`);
      setActivities(data);
    })();
  }, []);

  const total = activities.reduce((acc, cur) => acc + cur.value, 0);
  const budget_max_monthly = project.budget_max_monthly;
  const width = (100 * total) / budget_max_monthly || 0;

  if (!project.budget_max_monthly) return <div className="mt-2 text-[24px] text-[#212325] font-semibold">{total.toFixed(2)}€</div>;
  return <ProgressBar percentage={width} max={budget_max_monthly} value={total} />;
};

const Activities = ({ project }) => {
  const [activities, setActivities] = useState([]);
  const [date, setDate] = useState();
  const [days, setDays] = useState([]);

  useEffect(() => {
    if (!project || !date) return;

    (async () => {
      let from = new Date(date);
      from.setDate(1);
      setDays(getDaysInMonth(from.getMonth(), from.getFullYear()));
      let date_to = new Date(date);
      date_to.setMonth(date_to.getMonth() + 1);
      date_to.setDate(0);
      const { data } = await api.get(`/activity?dateFrom=${from.getTime()}&dateTo=${date_to.getTime()}&projectId=${encodeURIComponent(project._id)}`);
      const users = await api.get(`/user`);

      setActivities(
        data.map((activity) => {
          return { ...activity, user: (activity.userId = users.data.find((user) => user._id === activity.userId)?.name) };
        }),
      );
    })();
  }, [date, project]);

  const getTotal = () => {
    return (activities.reduce((acc, a) => acc + a.total, 0) / 8).toFixed(2);
  };

  return (
    <div>
      <div className="flex flex-wrap p-3 gap-4 text-black	">
        <div className="w-full bg-[#ffffff] border border-[#E5EAEF] rounded-[16px] overflow-hidden">
          <div className="flex gap-5 p-2">
            <SelectMonth start={0} indexDefaultValue={0} value={date} onChange={(e) => setDate(e.target.value)} showArrows />
          </div>
          <div className="mt-2 rounded-[10px] bg-[#fff]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="py-[10px] text-[14px] font-bold text-[#212325] text-left pl-[10px]">Users</th>
                    {days.map((e) => {
                      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                      const _date = new Date(e);
                      const day = _date.getDay();
                      const weekday = days[day];
                      const date = _date.getDate();
                      return (
                        <th
                          className={`w-[20px] border border-[#E5EAEF] text-[12px] font-semibold text-center ${day == 0 || day == 6 ? "bg-[#FFD5F1]" : "bg-[white]"}`}
                          key={e}
                          day={day}>
                          <div>{weekday}</div>
                          <div>{date}</div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-b border-r border-[#E5EAEF]">
                    <th className="px-2">
                      <div className="flex justify-end w-full text-[12px] font-bold text-[#212325] italic">
                        <div>{`Total ${getTotal()} days`}</div>
                      </div>
                    </th>
                    {days.map((e, i) => {
                      const v = activities.reduce((acc, a) => {
                        if (!a.detail[i]) return acc;
                        return acc + a.detail[i].value;
                      }, 0);
                      return <Field key={i} value={v} disabled />;
                    })}
                  </tr>
                  {activities
                    .sort((a, b) => b.total - a.total)
                    .map((e) => {
                      return (
                        <React.Fragment key={`${e.user}`}>
                          <tr className="border-t border-b border-r border-[#E5EAEF]" key={`1-${e._id}`}>
                            <th className="w-[100px] border-t border-b border-r text-[12px] font-bold text-[#212325] text-left">
                              <div className="flex flex-1 items-center justify-between gap-1 px-2">
                                <div className="flex flex-1 items-center justify-start gap-1">
                                  <img
                                    className="relative z-30 inline object-cover w-[25px] h-[25px] border border-white rounded-full"
                                    src={e?.userAvatar}
                                    alt={`avatar ${e?.user}`}
                                  />
                                  <div>{e.user}</div>
                                </div>
                                <div className="text-md italic font-normal">{(e.total / 8).toFixed(2)} days</div>
                              </div>
                            </th>
                            {e.detail.map((f, j) => {
                              return <Field key={`${e.user} ${j}`} value={f.value || 0} />;
                            })}
                          </tr>
                        </React.Fragment>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ value = "-", ...rest }) => {
  let bgColor = "bg-[white]";
  let textColor = "text-[#000]";
  if (value >= 7) {
    bgColor = "bg-[#216E39]";
    textColor = "text-[#fff]";
  } else if (value >= 5) {
    bgColor = "bg-[#30A14E]";
  } else if (value >= 3) {
    bgColor = "bg-[#40C463]";
  } else if (value > 0) {
    bgColor = "bg-[#9BE9A8]";
  } else {
    textColor = "text-[#aaa]";
  }

  return (
    <th className={`border border-[#E5EAEF] py-[6px] ${bgColor} ${textColor}`}>
      <div className={`text-center font-normal `} {...rest}>
        {value}
      </div>
    </th>
  );
};

const Links = ({ project }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {project.website && (
        <div className="group text-sm font-medium	text-gray-700 border-[1px] border-gray-700 rounded-full overflow-hidden">
          <a target="blank" href={project.website} className="break-words cursor-pointer text-gray-700 hover:text-white hover:bg-gray-700 flex hover:no-underline h-full">
            <div className="flex items-center bg-gray-700 py-1 px-2 rounded-r-full ">
              <IoIosAt className="group-hover:scale-110 text-white" />
            </div>
            <div className="flex items-center px-3 py-1">Website</div>
          </a>
        </div>
      )}
      {project.links?.map((link) => (
        <div className="group text-sm font-medium	text-blue-700 border-[1px] border-blue-700 rounded-full overflow-hidden">
          <a target="blank" href={link.url} className="break-words cursor-pointer text-blue-700 hover:text-white hover:bg-blue-700 flex hover:no-underline h-full">
            <div className="flex items-center bg-blue-700 py-1 px-2 rounded-r-full ">
              <IoIosLink className="group-hover:scale-110 text-white" />
            </div>
            <div className="flex items-center px-3 py-1">
              {link?.label?.substring(0, 20)}
              {link?.label?.length > 20 ? "..." : ""}
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};
