import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  GetAllUsers,
  UpdateUserVerificationStatus,
} from "../../apicalls/users";
import { Button, message, Table } from "antd";
import PageTitle from "../../components/PageTitle";

function Users() {
  const [users, setUsers] = useState([]);
  const { user } = useSelector((state) => state.users);

  const getData = async () => {
    try {
      const response = await GetAllUsers();
      if (response.success) {
        setUsers(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const updateStatus = async (record, isVerified) => {
    try {
      const response = await UpdateUserVerificationStatus({
        selectedUserId: record._id,
        isVerified,
      });
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
    },
    {
      title: "Balance",
      dataIndex: "balance",
    },
    {
      title: "Verified",
      dataIndex: "isVerified",
      render: (isVerified) => {
        return isVerified ? "Yes" : "No";
      },
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (text, record) => {
        return (
          <div className="flex gap-1">
            {record.isVerified ? (
              <Button
                className="primary-outlined-btn"
                onClick={() => updateStatus(record, false)}
              >
                suspend
              </Button>
            ) : (
              <Button
                className="primary-outlined-btn"
                onClick={() => updateStatus(record, true)}
              >
                Activate
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (!user.isAdmin) {
      message.error("You are not authorized to view this page");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } else {
      getData();
    }
  }, []);

  return (
    <div>
      <PageTitle title="Users" />
      <Table
        dataSource={users}
        columns={columns}
        rowKey="_id"
        className="mt-2"
      />
    </div>
  );
}

export default Users;
