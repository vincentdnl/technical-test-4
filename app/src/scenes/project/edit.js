import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { useHistory, useParams } from "react-router-dom";
import Loader from "../../components/loader";
import LoadingButton from "../../components/loadingButton";
import api from "../../services/api";

import toast from "react-hot-toast";

export default function EditProject() {
  const [project, setProject] = useState(null);
  const [bufferOtherLink, setBufferOtherLink] = useState("");
  const [bufferOtherLinkLabel, setBufferOtherLinkLabel] = useState("");
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const { data: u } = await api.get(`/project/${id}`);
      setProject(u);
    })();
  }, []);

  const history = useHistory();

  async function deleteData() {
    const confirm = window.confirm("Are you sure ?");
    if (!confirm) return;
    await api.remove(`/project/${id}`);
    toast.success("successfully removed!");
    history.push("/projects");
  }

  if (!project) return <Loader />;
  return (
    <div>
      <div className="appContainer pt-24">
        <div className="bg-[#FFFFFF] pb-4 border border-[#E5EAEF] rounded-[16px]">
          <div className="flex justify-between p-3 border-b border-[#E5EAEF]">
            <div>
              <span className="text-[18px] text-[#212325] font-semibold">Project details</span>
            </div>
            <button onClick={() => history.goBack()} className="border !border-[#0560FD] text-[#0560FD] py-[7px] px-[20px] bg-[#FFFFFF] rounded-[16px]">
              View project
            </button>
          </div>
          <Formik
            initialValues={project}
            onSubmit={async (values) => {
              try {
                await api.put(`/project/${project._id}`, values);
                toast.success(`${project.name} updated!`);
                history.push(`/project/${project._id}`);
              } catch (e) {
                console.log(e);
                toast.error("Some Error!");
              }
            }}>
            {({ values, handleChange, handleSubmit, isSubmitting }) => (
              <React.Fragment>
                <div className="flex gap-4 pl-4 pt-4">
                  {project.logo && <img className="w-[85px] h-[85px] border border-[#E5EAEF] rounded-[8px]" src={project.logo} alt="ProjectImage.png" />}
                </div>

                <div className="py-3 px-4">
                  <div className="flex gap-4 flex-wrap">
                    <div className="w-full md:w-[260px] mt-2">
                      <div className="text-[14px] text-[#212325] font-medium	">Name of project</div>
                      <input className="projectsInput text-[14px] font-normal text-[#212325] rounded-[10px]" name="name" disabled value={values.name} onChange={handleChange} />
                    </div>
                    <div className="w-full md:w-[260px] mt-2">
                      <div className="text-[14px] text-[#212325] font-medium	">Lead by name</div>
                      <input className="projectsInput text-[14px] font-normal text-[#212325] rounded-[10px]" name="lead" value={values.lead} onChange={handleChange} />
                    </div>
                    <div className="w-full md:w-[260px] mt-2">
                      <div className="text-[14px] text-[#212325] font-medium	">Status</div>
                      <select className="projectsInput text-[14px] font-normal text-[#212325] rounded-[10px]" name="status" value={values.status} onChange={handleChange}>
                        <option value=""></option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-3">
                    <div className="w-full md:w-[260px]">
                      <div className="text-[14px] text-[#212325] font-medium	">Budget max / month</div>
                      <input
                        className="projectsInput text-[14px] font-normal text-[#212325] rounded-[10px]"
                        type="number"
                        name="budget_max_monthly"
                        value={values.budget_max_monthly}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="w-full md:w-[260px] ">
                      <div className="text-[14px] text-[#212325] font-medium	">Payment cycle</div>
                      <select
                        className="projectsInput text-[14px] font-normal text-[#212325] rounded-[10px]"
                        name="paymentCycle"
                        value={values.paymentCycle}
                        onChange={handleChange}>
                        <option value=""></option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="ONE_TIME">One time</option>
                      </select>
                    </div>
                  </div>

                  <div className="w-full mt-3">
                    <div className="text-[14px] text-[#212325] font-medium">Description</div>
                    <textarea
                      className="w-full border border-[#ced4da] rounded-[10px] text-[14px] font-normal p-2 mt-2  focus:outline-none focus:ring focus:ring-[#80bdff]"
                      type="textarea"
                      rows="5"
                      placeholder="Please your comment...."
                      name="description"
                      value={values.description}
                      onChange={handleChange}></textarea>
                  </div>

                  <div className="w-full mt-3">
                    <div className="text-[14px] text-[#212325] font-medium">Objective</div>
                    <textarea
                      className="w-full border border-[#ced4da] rounded-[10px] text-[14px] font-normal p-2 mt-2  focus:outline-none focus:ring focus:ring-[#80bdff]"
                      type="textarea"
                      rows="5"
                      placeholder="Please your comment...."
                      name="objective"
                      value={values.objective}
                      onChange={handleChange}></textarea>
                  </div>
                  <div className="text-xl mt-8">Links</div>
                  <div className="w-full mt-3">
                    <div className="text-[14px] text-[#212325] font-medium	">Website</div>
                    <input className="projectsInput text-[14px] font-normal text-[#212325] rounded-[10px]" name="website" value={values.website} onChange={handleChange} />
                  </div>

                  <div className="w-full mt-3">
                    <div className="text-[14px] text-[#212325] font-medium	">Autres</div>
                    {(values.links || []).map((link) => {
                      return (
                        <div className="flex flex-1 flex-row mt-2 items-center gap-1">
                          <div className="flex gap-1 flex-1 items-center">
                            <input
                              className="projectsInput mt-0 text-[14px] font-normal text-[#212325] rounded-[10px]"
                              value={link.label}
                              onChange={(e) => {
                                const links = values.links.reduce((prev, current) => {
                                  const tempLink = current;
                                  if (current.url === link.url) {
                                    tempLink.label = e.target.value;
                                  }
                                  return [...prev, tempLink];
                                }, []);
                                handleChange({ target: { value: links, name: "links" } });
                              }}
                            />
                            <input
                              className="projectsInput mt-0 text-[14px] font-normal text-[#212325] rounded-[10px]"
                              value={link.url}
                              onChange={(e) => {
                                const links = values.links.reduce((prev, current) => {
                                  const tempLink = current;
                                  if (current.label === link.label) {
                                    tempLink.url = e.target.value;
                                  }
                                  return [...prev, tempLink];
                                }, []);
                                handleChange({ target: { value: links, name: "links" } });
                              }}
                            />
                          </div>
                          <div className={`flex justify-center cursor-pointer text-xl hover:text-red-500`}>
                            <MdDeleteForever
                              onClick={() => {
                                const newLinks = values.links.filter((l) => l.url !== link.url);
                                handleChange({ target: { value: newLinks, name: "links" } });
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const newLink = {
                          label: bufferOtherLinkLabel || bufferOtherLink,
                          url: bufferOtherLink,
                        };
                        handleChange({ target: { value: [...values.links, newLink], name: "links" } });
                        setBufferOtherLink("");
                        setBufferOtherLinkLabel("");
                      }}>
                      <input
                        className="projectsInput text-[14px] font-normal text-[#212325] rounded-[10px]"
                        name="other-links-label"
                        value={bufferOtherLinkLabel}
                        onChange={(e) => {
                          setBufferOtherLinkLabel(e.target.value);
                        }}
                        placeholder="My super website"
                      />
                      <input
                        className="projectsInput text-[14px] font-normal text-[#212325] rounded-[10px]"
                        required
                        name="other-links"
                        value={bufferOtherLink}
                        onChange={(e) => {
                          setBufferOtherLink(e.target.value);
                        }}
                        placeholder="https://mysuperwebsite.com"
                      />
                      {bufferOtherLink ? (
                        <button className="px-4 py-2 rounded-xl bg-[#0560FD] text-white mt-2" type="submit">
                          ajouter
                        </button>
                      ) : null}
                    </form>
                  </div>
                </div>
                <div className="flex ml-3 mt-2">
                  <LoadingButton
                    className="ml-[10px] bg-[#0560FD] text-[16px] font-medium text-[#fff] py-[12px] px-[22px] rounded-[10px]"
                    loading={isSubmitting}
                    onClick={handleSubmit}>
                    Update
                  </LoadingButton>
                  <button className="ml-[10px] bg-[#F43F5E] text-[16px] font-medium text-[#fff] py-[12px] px-[22px] rounded-[10px]" onClick={deleteData}>
                    Delete
                  </button>
                </div>
              </React.Fragment>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
