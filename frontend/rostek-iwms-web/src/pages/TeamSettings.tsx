import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, Shield, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import {Button, Popconfirm} from "antd";
import { Table, Tag, Typography, Space, message } from "antd";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import axios from "axios";
import ModalAdd from "@/components/user-managerment/modal-add";
import { renderCreateForm } from "@/components/user-managerment/renderCreateForm";
import { UserDataType } from "@/components/user-management/user-data";
import { useNavigate } from "react-router-dom";

const TeamSettings = () => {
  const { t } = useLanguage();
  const [currentTab, setCurrentTab] = useState("users");
  const [users, setUsers] = useState<UserDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDataType | null>(null);
  const [isEditMode, setIsEditMode] = useState(false)
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3200/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      message.error("not loading...");
    } finally {
      setLoading(false);
    }
  };

  const _handleFinish = (values: any) => {
    const payload = {
      ...values,
      upd_dt: new Date().toISOString(),
    };

    const request = isEditMode
    ? axios.patch(`http://localhost:3200/users/${selectedUser?._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
    : axios.post("http://localhost:3200/auth/signup", {
        ...payload,
        ent_dt: new Date().toISOString(),
      });

  request
    .then(() => {
      message.success(isEditMode ? "edit user success" : "create user success");
      setIsOpen(false);
      setSelectedUser(null);
      setIsEditMode(false);
      fetchUsers();
    })
    .catch((err) => {
      message.error(err?.response?.data?.message || err.message);
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3200/auth/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("delete success");
      fetchUsers();
    } catch (err) {
      message.error("delete false");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <Typography.Text strong>{name}</Typography.Text>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        let color = "blue";
        if (role === "admin") color = "volcano";
        else if (role === "manager") color = "geekblue";
        else if (role === "operator") color = "green";
        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: UserDataType) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              setSelectedUser(record);
              setIsEditMode(true);
              setIsOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure want to delete?"
            onConfirm={() => handleDelete(record._id!)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50">
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-warehouse-primary data-[state=active]:text-white"
          >
            <Users className="h-4 w-4 mr-2" />
            {t("users")}
          </TabsTrigger>
          <TabsTrigger
            value="roles"
            className="data-[state=active]:bg-warehouse-primary data-[state=active]:text-white"
          >
            <Shield className="h-4 w-4 mr-2" />
            {t("roles")}
          </TabsTrigger>
          <TabsTrigger
            value="groups"
            className="data-[state=active]:bg-warehouse-primary data-[state=active]:text-white"
          >
            <Settings className="h-4 w-4 mr-2" />
            {t("groups")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">User Management</h2>
              <Button type="primary" onClick={() => setIsOpen(true)}>
                {t("create_user")}
              </Button>
            </div>

            <Table
              rowKey="_id"
              columns={columns}
              dataSource={users}
              loading={loading}
              pagination={{ pageSize: 5 }}
            />

            <ModalAdd 
              title={ isEditMode ? "Edit User" : t("create_user")}
              itemsRender={renderCreateForm({ t })}
              _handleFinish={_handleFinish}
              isOpen={isOpen}
              setIsOpen={(v) => {
                setIsOpen(v);
                if (!v) {
                  setSelectedUser(null);
                  setIsEditMode(false);
                }
              }}
              initialValue={selectedUser}
            />
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <Card className="p-4">Role management here</Card>
        </TabsContent>

        <TabsContent value="groups" className="mt-6">
          <Card className="p-4">Group management here</Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamSettings;
