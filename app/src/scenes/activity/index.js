import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdDeleteForever } from "react-icons/md";
import { useSelector } from "react-redux";
import Loader from "../../components/loader";
import api from "../../services/api";

import SelectProject from "../../components/selectProject";
import SelectMonth from "./../../components/selectMonth";

import { getDaysInMonth } from "./utils";

const Activity = () => {
  const [date, setDate] = useState(null);
  const [user, setUser] = useState(null);
  const [project, setProject] = useState("");

  const u = useSelector((state) => state.Auth.user);

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const user = params.get("user");
    const date = params.get("date");
    if (date) setDate(new Date(date));

    if (user) return setUser({ name: user });
    return setUser(u);
  }, []);

  if (user === null) return <Loader />;

  return (
    // Container
    <div className="w-screen md:w-full">
      <div className="flex flex-wrap gap-5 p-2 md:!px-8">
        <SelectProject
          value={project}
          onChange={(e) => setProject(e.name)}
          className="w-[180px] bg-[#FFFFFF] text-[#212325] py-[10px] px-[14px] rounded-[10px] border-r-[16px] border-[transparent] cursor-pointer shadow-sm font-normal text-[14px]"
        />
        <SelectMonth start={-3} indexDefaultValue={3} value={date} onChange={(e) => setDate(e.target.value)} showArrows />
      </div>
      {date && user && <Activities date={new Date(date)} user={user} project={project} />}
    </div>
  );
};

const Activities = ({ date, user, project }) => {
  const [activities, setActivities] = useState([]);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/activity?date=${date.getTime()}&user=${user.name}&project=${project}`);
      const projects = await api.get(`/project/list`);
      setActivities(
        data.map((activity) => {
          return { ...activity, projectName: (activity.projectName = projects.data.find((project) => project._id === activity.projectId)?.name) };
        }),
      );
      setOpen(null);
    })();
  }, [date]);

  const days = getDaysInMonth(date.getMonth(), date.getFullYear());
  const onAddActivities = (project) => {
    const found = activities.find((a) => a.projectId === project._id);
    if (found) return toast.error(`Project ${project.name} already added !`);
    setActivities([
      ...activities,
      {
        projectId: project._id,
        projectLogo: project.logo,
        projectName: project.name,
        date,
        userId: user._id,
        userSellPerDay: user.sellPerDay,
        userJobTitle: user.job_title,
        userAvatar: user.avatar,
        total: 0,
        cost: 0,
        value: 0,
        detail: days.map((e) => ({ date: e.date, value: 0 })),
      },
    ]);
  };

  async function onSave() {
    for (let i = 0; i < activities.length; i++) {
      await api.post(`/activity`, activities[i]);
      toast.success(`Saved ${activities[i].projectName}`);
    }
  }

  async function onDelete(i) {
    if (window.confirm("Are you sure ?")) {
      const activity = activities[i];
      await api.remove(`/activity/${activity._id}`);
      toast.success(`Deleted ${activity.project}`);
    }
  }

  function onUpdateValue(i, j, value) {
    const n = [...activities];
    n[i].detail[j].value = value;
    n[i].total = n[i].detail.reduce((acc, b) => acc + b.value, 0);
    n[i].cost = (n[i].total / 8) * user.costPerDay;
    n[i].value = (n[i].total / 8) * (user.sellPerDay || 0);
    setActivities(n);
  }

  function onUpdateComment(i, value) {
    const n = [...activities];
    n[i].comment = value;
    setActivities(n);
  }

  const getWorkingDays = () => {
    return days.reduce((acc, a) => {
      const day = a.getDay();
      if (day === 0 || day == 6) return acc;
      return acc + 1;
    }, 0);
  };

  const getTotal = () => {
    return (activities.reduce((acc, a) => acc + a.total, 0) / 8).toFixed(2);
  };

  return (
    <div className="flex flex-wrap py-3 gap-4 text-black">
      <div className="w-screen md:w-full p-2 md:!px-8">
        {/* Table Container */}
        {true && (
          <div className="mt-2 rounded-xl bg-[#fff] overflow-auto">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="py-[10px] text-[14px] font-bold text-[#212325] text-left pl-[10px]">Projects</th>
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
                    <th className={`w-[20px] border border-[#E5EAEF] text-[12px] font-semibold text-center bg-[white]`} />
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-b border-r border-[#E5EAEF]">
                    <th className="px-2">
                      <div className="flex justify-end w-full text-[12px] font-bold text-[#212325] italic">
                        <div>{`${getTotal()} / ${getWorkingDays()} days`}</div>
                      </div>
                    </th>
                    {days.map((e, i) => {
                      const v = activities.reduce((acc, a) => {
                        if (!a.detail[i]) return acc;
                        return acc + a.detail[i].value;
                      }, 0);
                      return <Field key={`day-${i}`} value={v} disabled />;
                    })}
                  </tr>
                  {activities.map((e, i) => {
                    return (
                      <React.Fragment key={e.project}>
                        <tr className="border-t border-b border-r border-[#E5EAEF]" key={`1-${e._id}`} onClick={() => setOpen(i)}>
                          <th className="w-[100px] border-t border-b border-r text-[12px] font-bold text-[#212325] text-left">
                            <div className="flex flex-1 items-center justify-between gap-1 px-2">
                              <div className="flex flex-1 items-center justify-start gap-1">
                                <div>{e.projectName}</div>
                              </div>
                              <div className="flex flex-col items-end">
                                <div className="text-xs italic font-normal">{(e.total / 8).toFixed(2)} days</div>
                                <div className="text-[10px] italic font-normal">{(((e.total / 8).toFixed(2) / getTotal()) * 100).toFixed(2)}%</div>
                              </div>
                            </div>
                          </th>
                          {e.detail.map((f, j) => {
                            return (
                              <Field key={`${e.project} ${j}`} invoiced={e.invoiced} value={f.value || 0} onChange={(a) => onUpdateValue(i, j, parseFloat(a.target.value || 0))} />
                            );
                          })}
                          <th className={`border border-[#E5EAEF] py-[6px]`}>
                            <div className={`flex justify-center cursor-pointer text-xl hover:text-red-500`}>
                              <MdDeleteForever onClick={() => onDelete(i)} />
                            </div>
                          </th>
                        </tr>

                        {open === i && (
                          <tr className="border border-[#E5EAEF]" key={`2-${e._id}`}>
                            <th className="w-[100px] border border-[#E5EAEF]  text-[12px] font-bold text-[#212325] text-left pl-[10px]">
                              <div></div>
                            </th>
                            <th colSpan="30">
                              <div className="w-full">
                                {/* <th>My Work Space</th> */}
                                <textarea
                                  value={e.comment}
                                  onChange={(e) => onUpdateComment(i, e.target.value)}
                                  placeholder={`Please add a comment on what you deliver on ${e.project} (We need to show value created to clients)`}
                                  rows={6}
                                  className="w-full text-sm pt-2 pl-2"
                                />
                              </div>
                            </th>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                  <tr>
                    <th className="w-[50px] text-[12px] text-[#212325] px-[10px] py-2">
                      <SelectProject disabled={activities.map((e) => e.project)} value="" onChange={(e) => onAddActivities(e)} />
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
            <button className="m-3 w-[82px] h-[48px] py-[12px] px-[22px] bg-[#0560FD] text-[16px] font-medium text-[#fff] rounded-[10px]" onClick={onSave}>
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Field = ({ value = 0, onChange, invoiced, ...rest }) => {
  let bgColor = invoiced === "yes" ? "bg-[#F0F0F0]" : "bg-[white]";
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
    <th className={`border border-[#E5EAEF] py-[6px] ${bgColor}`}>
      <input
        className={`min-w-[30px] w-full text-center ${bgColor} ${textColor}`}
        disabled={invoiced === "yes"}
        value={value}
        min={0}
        {...rest}
        type="number"
        step="0.1"
        onChange={onChange}
        onFocus={(e) => {
          if (Number(e.target.value) === 0) {
            e.target.value = "";
          }
        }}
        onBlur={(e) => {
          if (e.target.value === "") {
            e.target.value = 0;
          }
        }}
      />
    </th>
  );
};

export default Activity;
