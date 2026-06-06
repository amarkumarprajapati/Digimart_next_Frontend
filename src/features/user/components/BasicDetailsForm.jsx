/* eslint-disable */
import { Form, Input, Button, Card, Divider } from "antd";
import {
  UserOutlined,
  MailOutlined,
  HomeOutlined,
  LockOutlined,
} from "@ant-design/icons";

const BasicDetails = () => {
  const [form] = Form.useForm();


  return (
    <div>
      <Card
        title={
          <span
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#1a1a1a",
            }}
          >
            Edit Your Profile
          </span>
        }
       
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            firstName: "Md",
            lastName: "Rimel",
            email: "rimel111@gmail.com",
            address: "Kingston, 5236, United State",
          }}
        >
          <Divider
            orientation="left"
            orientationMargin="0"
            style={{
              fontSize: "18px",
              color: "#1890ff",
              fontWeight: "600",
              marginTop: "0",
            }}
          >
            Personal Information
          </Divider>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
              marginBottom: "16px",
            }}
          >
            <Form.Item
              name="firstName"
              label={<span style={{ fontWeight: "600" }}>First Name</span>}
              rules={[
                { required: true, message: "Please input your first name!" },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="First Name"
                size="large"
                style={{ fontWeight: "500" }}
              />
            </Form.Item>

            <Form.Item
              name="lastName"
              label={<span style={{ fontWeight: "600" }}>Last Name</span>}
              rules={[
                { required: true, message: "Please input your last name!" },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Last Name"
                size="large"
                style={{ fontWeight: "500" }}
              />
            </Form.Item>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
              marginBottom: "16px",
            }}
          >
            <Form.Item
              name="email"
              label={<span style={{ fontWeight: "600" }}>Email</span>}
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Email"
                size="large"
                style={{ fontWeight: "500" }}
              />
            </Form.Item>

            <Form.Item
              name="address"
              label={<span style={{ fontWeight: "600" }}>Address</span>}
              rules={[
                { required: true, message: "Please input your address!" },
              ]}
            >
              <Input
                prefix={<HomeOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Address"
                size="large"
                style={{ fontWeight: "500" }}
              />
            </Form.Item>
          </div>

          <Divider
            orientation="left"
            orientationMargin="0"
            style={{
              fontSize: "18px",
              color: "#1890ff",
              fontWeight: "600",
            }}
          >
            Password Changes
          </Divider>

          <Form.Item
            name="currentPassword"
            label={<span style={{ fontWeight: "600" }}>Current Password</span>}
            rules={[
              {
                required: true,
                message: "Please input your current password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Current Password"
              size="large"
              style={{ fontWeight: "500" }}
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label={<span style={{ fontWeight: "600" }}>New Password</span>}
            rules={[
              { required: true, message: "Please input your new password!" },
              { min: 8, message: "Password must be at least 8 characters!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="New Password"
              size="large"
              style={{ fontWeight: "500" }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={
              <span style={{ fontWeight: "600" }}>Confirm New Password</span>
            }
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("The two passwords do not match!");
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Confirm New Password"
              size="large"
              style={{ fontWeight: "500" }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: "40px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "16px",
                paddingTop: "16px",
                borderTop: "1px solid #f0f0f0",
              }}
            >
              <Button
                size="large"
                style={{
                  width: "140px",
                  fontWeight: "600",
                  height: "48px",
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{
                  width: "140px",
                  background: "#ff4d4f",
                  borderColor: "#ff4d4f",
                  fontWeight: "600",
                  height: "48px",
                }}
              >
                Save Changes
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default BasicDetails;
