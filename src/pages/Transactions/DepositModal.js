import React, { useState } from "react";
import { Modal, Form, message } from "antd";
import { DepositFunds } from "../../apicalls/transcations";
import StripeCheckout from "react-stripe-checkout";
import { useDispatch } from "react-redux";
import { ReloadUser } from "../../redux/usersSlice";

function DepositModal({ showDepositModal, setShowDepositModal, relodData }) {
  const [form] = Form.useForm();
  const [amount, setAmount] = useState(10);
  const dispatch = useDispatch();
  const onToken = async (token) => {
    try {
      const response = await DepositFunds({
        token,
        amount: form.getFieldValue("amount"),
      });
      if (response.success) {
        relodData();
        setShowDepositModal(false);
        message.success(response.message);
        dispatch(ReloadUser(true));
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  
  return (
    <Modal
      title="Deposit"
      open={showDepositModal}
      onCancel={() => setShowDepositModal(false)}
      onClose={() => setShowDepositModal(false)}
      footer={null}
    >
      <div className="flex-col gap-1">
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                required: true,
                message: "Please input amount",
              },
            ]}
          >
            <input type="number" />
          </Form.Item>
          <div className="flex justify-end gap-1">
            <button className="primary-outlined-btn">Cancel</button>
            <StripeCheckout
              token={onToken}
              currency="INR"
              amount={form.getFieldValue("amount") * 100}
              shippingAddress
              billingAddress
              stripeKey="pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIXF7oZ6ItlZZbXO6idTHE67IM007EwQ4uN3"
            >
              <button className="primary-contained-btn">Deposit</button>
            </StripeCheckout>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

export default DepositModal;
