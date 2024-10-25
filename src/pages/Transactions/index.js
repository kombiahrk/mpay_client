import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import { message, Table } from "antd";
import TransferFundsModals from "./TransferFundsModals";
import { GetTransactionOfUser } from "../../apicalls/transcations";
import moment from "moment";
import { useSelector } from "react-redux";
import DepositModal from "./DepositModal";

function Transactions() {
  const [showTransferFundsModal, setShowTransferFundsModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [data, setData] = useState([]);
  const { user } = useSelector((state) => state.users);
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => {
        return moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss A");
      },
    },
    {
      title: "Transcations ID",
      dataIndex: "_id",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (text, record) => {
        //return record.sender._id === user._id ? "Debit" : "Credit";

        if (record.sender._id === record.receiver._id) {
          return "Deposit";
        } else if (record.sender._id === user._id) {
          return "Debit";
        } else {
          return "Credit";
        }
      },
    },
    {
      title: "Reference Account",
      dataIndex: "",
      render: (text, record) => {
        return record.sender._id === user._id ? (
          <div>
            <h1 className="text-sm">
              {record.receiver.firstName} {record.receiver.lastName}
            </h1>
          </div>
        ) : (
          <div>
            <h1 className="text-sm">
              {record.sender.firstName}
              {record.sender.lastName}
            </h1>
          </div>
        );
      },
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  const getData = async () => {
    try {
      const response = await GetTransactionOfUser();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      message.error = error.message;
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageTitle title="Transactions" />

        <div className="flex gap-1">
          <button
            className="primary-outlined-btn"
            onClick={() => setShowDepositModal(true)}
          >
            Deposit{" "}
          </button>
          <button
            className="primary-contained-btn"
            onClick={() => setShowTransferFundsModal(true)}
          >
            Transfer{" "}
          </button>
        </div>
      </div>

      <Table columns={columns} dataSource={data} rowKey="_id" className="mt-2" />

      {showTransferFundsModal && (
        <TransferFundsModals
          showTransferFundsModal={showTransferFundsModal}
          setShowTransferFundsModal={setShowTransferFundsModal}
          reloadData={getData}
        />
      )}

      {showDepositModal && (
        <DepositModal
          showDepositModal={showDepositModal}
          setShowDepositModal={setShowDepositModal}
          relodData={getData}
        />
      )}
    </div>
  );
}

export default Transactions;
