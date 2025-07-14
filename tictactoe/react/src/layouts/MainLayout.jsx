// src/layouts/MainLayout.jsx
import React from "react";
import { Layout, Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Footer, Sider, Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider width={200} style={{ background: "#fff" }}>
        <Menu mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">Dashboard</Menu.Item>
          <Menu.Item key="2">Users</Menu.Item>
          <Menu.Item key="3">Settings</Menu.Item>
        </Menu>
      </Sider>

      {/* Main content */}
      <Layout>
        {/* <Header style={{ background: "primary", color: "#fff", padding: "0 16px" }}>
          <h3 style={{ color: "white" }}>My Admin Panel</h3>
        </Header> */}

        <Content
  id="scroll-container"
  style={{ margin: "16px", background: "#fff", padding: "24px", height: "100vh", overflowY: "auto" }}
>
  <Outlet />
</Content>


        <Footer style={{ textAlign: "center" }}>Ant Design Layout + React Router ©2025</Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
