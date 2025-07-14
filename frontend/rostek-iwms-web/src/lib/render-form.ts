// src/lib/render-form.ts

import { Rule } from "antd/es/form";

export interface TypeRenderForm {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "select";
  placeholder?: string;
  rules?: Rule[]; // ✅ Fix lỗi rules
  autoFocus?: boolean;
  hasFeedback?: boolean;
  items?: { label: string; value: string }[];
}
