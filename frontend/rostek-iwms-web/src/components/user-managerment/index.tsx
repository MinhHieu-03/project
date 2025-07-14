import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import axios from "axios";

import ModalAdd from "./modal-add";
import {
  lang_key,
  renderCreateForm,
  RenderCol,
  domain,
  UserDataType,
} from "./user-data";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus } from "lucide-react";

const UserManagementPage = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserDataType[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    requestDataList();
  }, []); // chỉ gọi 1 lần khi component mount

  const requestDataList = () => {
    axios
      .get(domain.list, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setUsers(res.data); // hoặc res.data.metaData nếu API dạng đó
      })
      .catch((err) => {
        message.error(
          err?.response?.data?.message || "Failed to load user list"
        );
      });
  };

  const _handleFinish = (values: { [key: string]: unknown }) => {
    const payload = {
      ...values,
      ent_dt: new Date().toISOString(),
      upd_dt: new Date().toISOString(),
    };

    axios
      .post(domain.create, payload)
      .then(() => {
        message.success(t("Create success"));
        setIsOpen(false);
        requestDataList();
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || err.message);
      });
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">{t(`${lang_key}.title`)}</h2>
        <Button size="sm" onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4" />
          {t(`${lang_key}.add_user`)}
        </Button>
      </div>

      <Table
        rowKey="_id"
        dataSource={users}
        columns={RenderCol({ t })}
        scroll={{ x: 1000 }}
      />

      <ModalAdd
        title={t(`${lang_key}.add_user`)}
        itemsRender={renderCreateForm({ t })}
        _handleFinish={_handleFinish}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </div>
  );
};

export default UserManagementPage;
