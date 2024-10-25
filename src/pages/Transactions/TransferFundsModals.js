import React, { useState } from "react";
import { Modal, Form, message } from "antd";
import { TransferFunds, VerifyAccount } from "../../apicalls/transcations";
import { useDispatch, useSelector } from "react-redux";
import { ReloadUser } from "../../redux/usersSlice";

function TransferFundsModals({
  showTransferFundsModal,
  setShowTransferFundsModal,
  reloadData,
}) {
  const [isVerified, setIsVerified] = useState("");
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.users);
  const [accountName, setAccountName] = useState("");
  const dispatch = useDispatch();

  const verifyAccount = async () => {
    try {
      if (form.getFieldValue("receiver") === user._id) {
        message.error("Not allowed to transfer funds to yourself");
        return;
      }
      const response = await VerifyAccount({
        receiver: form.getFieldValue("receiver"),
      });

      if (response.success) {
        setAccountName(response.data);
        setIsVerified("true");
      } else {
        setIsVerified("false");
      }
    } catch (error) {
      setIsVerified("false");
    }
  };

  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        sender: user._id,
        status: "success",
        reference: values.reference || "no reference",
      };
      const response = await TransferFunds(payload);
      if (response.success) {
        reloadData();
        setShowTransferFundsModal(false);
        message.success(response.message);
        dispatch(ReloadUser(true));
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div>
      <Modal
        title="Transfer Funds"
        open={showTransferFundsModal}
        onCancel={() => setShowTransferFundsModal(false)}
        onClose={() => setShowTransferFundsModal(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <div className="flex gap-2 items-center">
            <Form.Item label="Account Number" name="receiver" className="w-100">
              <input type="text" />
            </Form.Item>
            <button
              className="primary-contained-btn mt-1"
              type="button"
              onClick={verifyAccount}
            >
              VERIFY
            </button>
          </div>

          {isVerified === "true" && (
            <div className="success-bg">Account {accountName} Verified successfully</div>
          )}
          {isVerified === "false" && (
            <div className="error-bg">Invalid Account</div>
          )}
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                required: true,
                message: "Please input your amount!",
              },
              {
                max: user.balance,
                message: "Insufficient Balance",
              },
            ]}
          >
            <input type="number" max={user.balance} />
          </Form.Item>

          <Form.Item label="Reference" name="reference">
            <textarea type="text" />
          </Form.Item>
          <div className="flex justify-end gap-1">
            <button className="primary-outlined-btn">Cancel</button>
            {isVerified === "true" && (
              <button className="primary-contained-btn">Transfer</button>
            )}
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default TransferFundsModals;
