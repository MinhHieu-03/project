import React from "react";
import { Layout, Menu } from "antd";

const { Header, Footer, Sider, Content } = Layout;

const AppLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <div style={{ color: "#fff", padding: "16px", fontWeight: "bold" }}>
          LOGO
        </div>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1">Dashboard</Menu.Item>
          <Menu.Item key="2">Users</Menu.Item>
          <Menu.Item key="3">Settings</Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header style={{ background: "#fff", padding: 0, textAlign: "center" }}>
          <h1>Header</h1>
        </Header>

        <Content style={{ margin: "16px", padding: "24px", background: "#fff" }}>
          <h2>Main Content Area</h2>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          Ant Design Layout ©2025 Created by You
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
