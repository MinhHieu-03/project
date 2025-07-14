import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { TypeRenderForm } from "@/lib/render-form";

interface ModalAddProps {
  title: string;
  itemsRender: TypeRenderForm[];
  _handleFinish: (values: any) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialValue?: any; // ✅ Đúng tên
}

const ModalAdd: React.FC<ModalAddProps> = ({
  title,
  itemsRender,
  _handleFinish,
  isOpen,
  setIsOpen,
  initialValue,
}) => {
  const [form] = Form.useForm();

  // ✅ Sửa đúng tên biến
  useEffect(() => {
    if (isOpen && initialValue) {
      form.setFieldsValue(initialValue);
    } else {
      form.resetFields();
    }
  }, [isOpen, initialValue, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        _handleFinish(values);
        form.resetFields();
      })
      .catch((err) => {
        console.error("Validation failed:", err);
      });
  };

  return (
    <Modal
      title={title}
      open={isOpen}
      onCancel={() => {
        form.resetFields();
        setIsOpen(false);
      }}
      footer={[
        <Button key="cancel" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {title.includes("Edit") ? "Save" : "Create"}
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form}>
        {itemsRender.map((item) => {
          if (item.type === "select") {
            return (
              <Form.Item
                key={item.name}
                label={item.label}
                name={item.name}
                rules={item.rules}
              >
                <Select placeholder={item.placeholder}>
                  {item.items?.map((opt) => (
                    <Select.Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            );
          }

          return (
            <Form.Item
              key={item.name}
              label={item.label}
              name={item.name}
              rules={item.rules}
              hasFeedback={item.hasFeedback}
            >
              <Input
                type={item.type || "text"}
                placeholder={item.placeholder}
                autoFocus={item.autoFocus}
              />
            </Form.Item>
          );
        })}
      </Form>
    </Modal>
  );
};

export default ModalAdd;
