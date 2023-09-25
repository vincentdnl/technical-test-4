import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import "react-tagsinput/react-tagsinput.css";
import Loader from "../components/loader";
import LoadingButton from "../components/loadingButton";
import { setUser } from "../redux/auth/actions";
import api from "../services/api";

export default () => {
  const user = useSelector((state) => state.Auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState({
    email: user.email,
    name: user.name,
    role: user.role,
    address: user.address,
  });
  const dispatch = useDispatch();
  if (!user) return <Loader />;

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    let body = values;
    try {
      const responseData = await api.put(`/user/${user._id}`, body);
      toast.success("Updated!");
      dispatch(setUser(responseData.user));
    } catch (e) {
      console.log(e);
      toast.error("Some Error!");
    }
    setIsLoading(false);
  }

  return (
    <div>
      {/* Container */}
      <div className="appContainer">
        <form onSubmit={handleSubmit}>
          <React.Fragment>
            {/* First Row */}
            <div className="flex justify-between flex-wrap mt-3">
              <div className="w-full md:w-[48.5%]">
                <div>Name</div>
                <input className="projectsInput" name="name" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
              </div>
              <div className="w-full md:w-[48.5%]">
                <div>Email</div>
                <input className="projectsInput" value={values.email} />
              </div>
            </div>
            {/* second Row */}
            <div className="flex justify-between flex-wrap mt-3">
              <div className="w-full md:w-[48.5%]">
                <div>Address</div>
                <textarea className="projectsInput h-auto py-2" name="address" value={values.address} onChange={(e) => setValues({ ...values, address: e.target.value })} />
              </div>
            </div>
            <hr className="my-4" />
            <div className="flex justify-end">
              <LoadingButton
                className="ml-[10px] bg-[#17a2b8] hover:bg-[#138496] text-[1rem] text-[#fff] py-[0.375rem] px-[0.75rem] rounded-[0.25rem]"
                loading={isLoading}
                onClick={handleSubmit}>
                Update
              </LoadingButton>
            </div>
          </React.Fragment>
        </form>
      </div>
      <Toaster />
    </div>
  );
};
