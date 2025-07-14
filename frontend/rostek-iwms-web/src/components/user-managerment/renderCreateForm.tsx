export const renderCreateForm = ({ t }): TypeRenderForm[] => [
  {
    label: t("name"),
    name: "name",
    type: "text",
    placeholder: t("name"),
    rules: [{ required: true, message: t("Please input name") }],
  },
  {
    label: t("email"),
    name: "email",
    type: "email",
    placeholder: t("email"),
    rules: [
      { required: true, message: t("Please input email") },
      { type: "email", message: t("Invalid email") },
    ],
  },
  {
    label: t("password"),
    name: "password",
    type: "password",
    placeholder: t("password"),
    rules: [{ required: true, message: t("Please input password") }],
  },
  {
    label: t("role"),
    name: "role",
    type: "select",
    placeholder: t("role"),
    items: [
      { label: t("Admin"), value: "admin" },
      { label: t("Manager"), value: "manager" },
      { label: t("Operator"), value: "operator" },
    ],
    rules: [{ required: true, message: t("Please select role") }],
  },
  {
    label: t("status"),
    name: "status",
    type: "select",
    placeholder: t("status"),
    items: [
      { label: t("Active"), value: "active" },
      { label: t("Inactive"), value: "inactive" },
    ],
    rules: [{ required: true, message: t("Please select status") }],
  },
  {
    label: t("department"),
    name: "department",
    type: "text",
    placeholder: t("department"),
    rules: [{ required: true, message: t("Please input department") }],
  },
];
