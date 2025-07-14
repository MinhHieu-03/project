import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { TranslationKey } from "@/lib/i18n/translations";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

// ------------------ FORM SCHEMA ------------------
const schema = z.object({
  name: z.string().min(1, "required_name"),
  password: z.string().min(6, "password_min"),
  role: z.enum(["Admin", "Manager", "Operator"], {
    errorMap: () => ({ message: "required_role" }),
  }),
});

// ------------------ COMPONENT ------------------
const UsersTab: React.FC = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // -------- fetch list --------
  const { data: users = [] } = useQuery<User[]>(["users"], () =>
    axios.get("http://localhost:3200/user").then((res) => res.data)
  );

  // -------- create user mutation --------
  const createUser = useMutation({
    mutationFn: (payload: z.infer<typeof schema>) =>
      axios.post("http://localhost:3200/user", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setOpen(false);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { role: "Operator" },
  });

  const onSubmit = handleSubmit((data) => {
    createUser.mutate(data);
    reset();
  });

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        {/* Tiêu đề */}
        <CardTitle>{t("user_management")}</CardTitle>

        {/* Nút + Dialog tạo user */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">{t("create_user")}</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{t("create_user")}</DialogTitle>
            </DialogHeader>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Username */}
              <Input placeholder="Username" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-red-500">{t(errors.name.message as any)}</p>
              )}

              {/* Password */}
              <Input type="password" placeholder="Password" {...register("password")} />
              {errors.password && (
                <p className="text-xs text-red-500">{t(errors.password.message as any)}</p>
              )}

              {/* Role */}
              <Select {...register("role") as any} defaultValue="Operator">
                <SelectTrigger />
                <SelectContent>
                  <SelectItem value="Operator">{t("Operator")}</SelectItem>
                  <SelectItem value="Manager">{t("Manager")}</SelectItem>
                  <SelectItem value="Admin">{t("Admin")}</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-xs text-red-500">{t(errors.role.message as any)}</p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    {t("cancel")}
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={createUser.isLoading}>
                  {createUser.isLoading ? t("saving") : t("save")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="border rounded-lg p-4 flex justify-between items-center dark:border-gray-700"
            >
              <div>
                <h3 className="font-medium">{user.fullName}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t(user.role as TranslationKey)}
                </p>
              </div>
              <div className="flex gap-2">
                {/* edit / disable buttons giữ nguyên */}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersTab;
