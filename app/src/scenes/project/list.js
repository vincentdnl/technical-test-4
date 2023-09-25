import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";

import Loader from "../../components/loader";
import LoadingButton from "../../components/loadingButton";
import ProgressBar from "../../components/ProgressBar";

import api from "../../services/api";
const ProjectList = () => {
  const [projects, setProjects] = useState(null);
  const [activeProjects, setActiveProjects] = useState(null);

  const history = useHistory();

  useEffect(() => {
    (async () => {
      const { data: u } = await api.get("/project");
      setProjects(u);
    })();
  }, []);

  useEffect(() => {
    const p = (projects || []).filter((p) => p.status === "active");
    setActiveProjects(p);
  }, [projects]);

  if (!projects || !activeProjects) return <Loader />;

  const handleSearch = (searchedValue) => {
    const p = (projects || []).filter((p) => p.status === "active").filter((e) => e.name.toLowerCase().includes(searchedValue.toLowerCase()));
    setActiveProjects(p);
  };

  return (
    <div className="w-full p-2 md:!px-8">
      <Create onChangeSearch={handleSearch} />
      <div className="py-3">
        {activeProjects.map((hit) => {
          return (
            <div
              key={hit._id}
              onClick={() => history.push(`/project/${hit._id}`)}
              className="flex justify-between flex-wrap p-3 border border-[#FFFFFF] bg-[#F9FBFD] rounded-[16px] mt-3 cursor-pointer">
              <div className="flex w-full md:w-[25%] border-r border-[#E5EAEF]">
                <div className="flex flex-wrap gap-4 items-center">
                  {hit.logo && <img className="w-[85px] h-[85px] rounded-[8px] object-contain	" src={hit.logo} alt="ProjectImage.png" />}
                  <div className="flex flex-col flex-wrap flex-1">
                    <div className="text-[18px] text-[#212325] font-semibold flex flex-wrap">{hit.name}</div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-[50%] border-r border-[#E5EAEF] pl-[10px]">
                <span className="text-[14px] font-medium text-[#212325]">{hit.description ? hit.description : ""}</span>
              </div>
              <div className="w-full md:w-[25%]  px-[10px]">
                <span className="text-[16px] font-medium text-[#212325]">Budget consumed {hit.paymentCycle === "MONTHLY" && "this month"}:</span>
                <Budget project={hit} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Budget = ({ project }) => {
  const [activities, setActivities] = useState([10, 29, 18, 12]);

  useEffect(() => {
    (async () => {
      let d = new Date();
      if (project.paymentCycle === "ONE_TIME") d = new Date(project.created_at);
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

const Create = ({ onChangeSearch }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-[10px] ">
      <div className="flex justify-between flex-wrap">
        {/* Search Input */}
        <div className="relative text-[#A0A6B1]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <button type="submit" className="p-1">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </span>
          <input
            type="search"
            name="q"
            className="py-2 w-[364px] h-[48px] text-[16px] font-medium text-[black] rounded-[10px] bg-[#F9FBFD] border border-[#FFFFFF] pl-10"
            placeholder="Search"
            onChange={(e) => onChangeSearch(e.target.value)}
          />
        </div>
        {/* Create New Button */}
        <button
          className="bg-[#0560FD] text-[#fff] py-[12px] px-[20px] rounded-[10px] text-[16px] font-medium"
          onClick={() => {
            setOpen(true);
          }}>
          Create new project
        </button>
      </div>

      {open ? (
        <div
          className=" absolute top-0 bottom-0 left-0 right-0 bg-[#00000066] flex justify-center p-[1rem] z-50 "
          onClick={() => {
            setOpen(false);
          }}>
          <div
            className="w-full md:w-[60%] max-h-[200px] bg-[white] p-[25px] rounded-md"
            onClick={(e) => {
              e.stopPropagation();
            }}>
            {/* Modal Body */}
            <Formik
              initialValues={{}}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  values.status = "active";
                  const res = await api.post("/project", values);
                  if (!res.ok) throw res;
                  toast.success("Created!");
                  setOpen(false);
                } catch (e) {
                  console.log(e);
                  toast.error("Some Error!", e.code);
                }
                setSubmitting(false);
              }}>
              {({ values, handleChange, handleSubmit, isSubmitting }) => (
                <React.Fragment>
                  <div className="w-full md:w-6/12 text-left">
                    <div>
                      <div className="text-[14px] text-[#212325] font-medium	">Name</div>
                      <input className="projectsInput text-[14px] font-normal text-[#212325] rounded-[10px]" name="name" value={values.name} onChange={handleChange} />
                    </div>
                    <LoadingButton
                      className="mt-[1rem] bg-[#0560FD] text-[16px] font-medium text-[#FFFFFF] py-[12px] px-[22px] rounded-[10px]"
                      loading={isSubmitting}
                      onClick={handleSubmit}>
                      Create
                    </LoadingButton>
                  </div>
                </React.Fragment>
              )}
            </Formik>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProjectList;
