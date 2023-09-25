import React, { useEffect, useState } from "react";
import api from "../../services/api";

const Home = () => {
  const [availableUsers, setAvailableUsers] = useState();

  async function getUser() {
    const { data } = await api.get("/user/available");
    setAvailableUsers(data);
  }
  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="px-2 md:!px-8 flex flex-col md:flex-row gap-5 mt-5">
      <div className="flex-1 mb-[10px]">
        <h2 className="text-[22px] font-semibold mb-4">Available</h2>
        {availableUsers?.map((user) => (
          <div key={user._id} className="bg-white mb-[10px] rounded-lg shadow-sm flex gap-4 p-3">
            <img src={user.avatar} alt="userlogo" className="rounded-full w-14 h-14" />
            <div>
              <h3 className="font-semibold text-lg mb-[3px]">{user.name}</h3>
              {/* <h3 className="text-[#676D7C] text-sm">{user.email}</h3> */}
              <h3 className="text-[#676D7C] text-sm">{user.job_title}</h3>
              <p className="text-[#676D7C] text-sm capitalize">{user.availability}</p>
            </div>
          </div>
        ))}
        {availableUsers?.length === 0 ? <span className="italic text-gray-600">No available users.</span> : null}
      </div>
    </div>
  );
};
export default Home;
