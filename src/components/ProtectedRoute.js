import React, { useEffect } from "react";
import { message } from "antd";
import { GetUserInfo } from "../apicalls/users";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ReloadUser, setUser } from "../redux/usersSlice";
import DefaultLayout from "./DefaultLayout";

function ProtectedRoute(props) {
  const { user, reloadUser } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getData = async () => {
    try {
      const response = await GetUserInfo();
      if (response.success) {
        dispatch(setUser(response.data));
      } else {
        navigate("/Login");
        message.error(response.message);
      }
      dispatch(ReloadUser(false));
    } catch (error) {
      message.error(error.message);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      if (!user) {
        getData();
      }
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (reloadUser) {
      getData();
    }
  }, [reloadUser]);

  return (
    user && (
      <div>
        <DefaultLayout>{props.children}</DefaultLayout>
      </div>
    )
  );
}

export default ProtectedRoute;
