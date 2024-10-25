import React, { useState } from "react";
import { Modal, Form, message } from "antd";
import { VerifyAccount } from "../../apicalls/transcations";
import { SendRequest } from "../../apicalls/requests";
import { useSelector } from "react-redux";

function NewRequestModal({
  showNewRequestModal,
  setShowNewRequestModal,
  reloadData,
}) {
  const [isVerified, setIsVerified] = useState("");
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.users);
  const [accountName, setAccountName] = useState("");
  const verifyAccount = async () => {
    try {
      if (form.getFieldValue("receiver") === user._id) {
        message.error("Not allowed to send funds to yourself");
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
        description: values.description || "no description",
      };
      const response = await SendRequest(payload);
      if (response.success) {
        reloadData();
        setShowNewRequestModal(false);
        message.success(response.message);
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
        title="Request Funds"
        open={showNewRequestModal}
        onCancel={() => setShowNewRequestModal(false)}
        onClose={() => setShowNewRequestModal(false)}
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
            <div className="success-bg">
              Account of {accountName} Verified successfully
            </div>
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
                min: 1,
                message: "Minimum amount is 1",
              },
            ]}
          >
            <input type="number" min={1} />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <textarea type="text" />
          </Form.Item>

          <div className="flex justify-end gap-1">
            <button className="primary-outlined-btn">Cancel</button>
            {isVerified === "true" && (
              <button className="primary-contained-btn" type="submit">
                Request
              </button>
            )}
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default NewRequestModal;
