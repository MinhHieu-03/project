import { TypeRenderForm } from "@/lib/render-form";

export const domain = {
  list: "auth/list",
  create: "auth/signup",
  update: "auth/account",
  remove: "auth",
};

export const lang_key = "user_management";

export const renderCreateForm = ({ t }): TypeRenderForm[] => [
  {
    label: t("name"),
    name: "name",
    type: "text",
    placeholder: t("name"),
    rules: [{ required: true, message: t("required_field") }],
  },
  {
    label: t("email"),
    name: "email",
    type: "email",
    placeholder: t("email"),
    rules: [
      { required: true, message: t("required_field") },
      { type: "email", message: t("invalid_email") },
    ],
  },
  {
    label: t("password"),
    name: "password",
    type: "password",
    placeholder: t("password"),
    rules: [{ required: true, message: t("required_field") }],
  },
  {
    label: t("role"),
    name: "role",
    type: "select",
    items: [
      { label: t("admin"), value: "admin" },
      { label: t("manager"), value: "manager" },
      { label: t("operator"), value: "operator" },
    ],
    rules: [{ required: true, message: t("required_field") }],
  },
  {
    label: t("department"),
    name: "department",
    placeholder: t("department"),
    rules: [{ required: true, message: t("required_field") }],
  },
];
