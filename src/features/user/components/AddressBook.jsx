/* eslint-disable */
import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Divider,
  Empty,
  message,
} from "antd";
import {
  UserOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  BankOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const AddressBook = () => {
  const [form] = Form.useForm();
  const [addresses, setAddresses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const onFinish = (values) => {
    if (isEditing) {
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingId ? { ...values, id: editingId } : addr
        )
      );
      message.success("Address updated successfully");
      setIsEditing(false);
      setEditingId(null);
    } else {
      const newAddress = {
        ...values,
        id: Date.now(), // Using timestamp for unique ID
      };
      setAddresses([...addresses, newAddress]);
      message.success("Address added successfully");
    }
    form.resetFields();
  };

  const handleEdit = (address) => {
    form.setFieldsValue(address);
    setIsEditing(true);
    setEditingId(address.id);
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
    message.success("Address deleted successfully");
  };

  const handleCancel = () => {
    form.resetFields();
    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div>
      <Card
        title={
          <span style={{ fontSize: "20px", fontWeight: "600" }}>
            Your Address Book
          </span>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ marginBottom: "24px" }}
        >
          <Divider
            orientation="left"
            orientationMargin="0"
            style={{ fontSize: "16px", color: "#1890ff" }}
          >
            {isEditing ? "Edit Address" : "Add New Address"}
          </Divider>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Form.Item
              name="name"
              label={<span style={{ fontWeight: "600" }}>Full Name</span>}
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="John Doe"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="street"
              label={<span style={{ fontWeight: "600" }}>Street Address</span>}
              rules={[
                {
                  required: true,
                  message: "Please input your street address!",
                },
              ]}
            >
              <Input
                prefix={<EnvironmentOutlined />}
                placeholder="123 Main St"
                size="large"
              />
            </Form.Item>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
            }}
          >
            <Form.Item
              name="city"
              label={<span style={{ fontWeight: "600" }}>City</span>}
              rules={[{ required: true, message: "Please input your city!" }]}
            >
              <Input
                prefix={<HomeOutlined />}
                placeholder="New York"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="state"
              label={<span style={{ fontWeight: "600" }}>State/Province</span>}
              rules={[
                {
                  required: true,
                  message: "Please input your state/province!",
                },
              ]}
            >
              <Input placeholder="NY" size="large" />
            </Form.Item>

            <Form.Item
              name="zip"
              label={<span style={{ fontWeight: "600" }}>ZIP/Postal Code</span>}
              rules={[
                { required: true, message: "Please input your ZIP code!" },
              ]}
            >
              <Input placeholder="10001" size="large" />
            </Form.Item>
          </div>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{ width: "180px" }}
              >
                {isEditing ? "Update Address" : "Add Address"}
              </Button>
              {isEditing && (
                <Button
                  size="large"
                  onClick={handleCancel}
                  style={{ width: "120px" }}
                >
                  Cancel
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>

        <Divider
          orientation="left"
          orientationMargin="0"
          style={{ fontSize: "16px", color: "#1890ff" }}
        >
          Saved Addresses
        </Divider>

        {addresses.length === 0 ? (
          <Empty description="No addresses saved yet" />
        ) : (
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}
          >
            {addresses.map((address) => (
              <Card
                key={address.id}
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                actions={[
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(address)}
                    style={{ color: "#1890ff" }}
                  >
                    Edit
                  </Button>,
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(address.id)}
                    style={{ color: "#ff4d4f" }}
                  >
                    Delete
                  </Button>,
                ]}
              >
                <div style={{ lineHeight: "1.6" }}>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      marginBottom: "8px",
                    }}
                  >
                    <UserOutlined style={{ marginRight: "8px" }} />
                    {address.name}
                  </p>
                  <p style={{ marginBottom: "4px" }}>
                    <EnvironmentOutlined style={{ marginRight: "8px" }} />
                    {address.street}
                  </p>
                  <p>
                    <BankOutlined style={{ marginRight: "8px" }} />
                    {address.city}, {address.state} {address.zip}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AddressBook;
