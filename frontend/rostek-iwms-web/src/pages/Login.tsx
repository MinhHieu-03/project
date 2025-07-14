// src/pages/LoginPage.tsx
import { Form, Input, Button, message, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons"; // ← thêm icon ở đây
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values: { name: string; password: string }) => {
    try {
      const res = await axios.post("http://localhost:3200/auth/login", {
        name: values.name,
        password: values.password,
      });

      const token = res.data.metaData?.access_token;
      if (!token) {
        message.error("Not Token");
        return;
      }

      localStorage.setItem("token", token);
      message.success("Login success!");
      navigate("/team-settings");
    } catch (err: any) {
      console.error("Login error:", err);
      message.error(err?.response?.data?.message || "Login false");
    }
  };

  return (
    <Card 
     title = "Login"
     bordered = "true"
     style={{ width: "400px", margin: "0 auto", marginTop: "40" }}
     >
      <Form
        name="login-form"
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please Enter Name!" }]}
        >
          <Input placeholder="Name" prefix={<UserOutlined />} />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please Enter Password!" }]}
        >
          <Input.Password placeholder="Password" prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Login;
