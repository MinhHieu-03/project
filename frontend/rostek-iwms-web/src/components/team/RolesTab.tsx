import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { TranslationKey } from "@/lib/i18n/translations";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { StaleTime } from "@tanstack/react-query";

interface Role {
  id: string;
  name: string;
  description: string;
}

const fetchRoles = async (): Promise<Role[]> => {
  const { data } = await axios.get("/api/roles");
  return data;
};

const RolesTab: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const {
    data: roles = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Role[]>(["roles"], fetchRoles, {
    staleTime: 60_000, // 1 phút: giảm call khi quay lại tab
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{t("roles_permissions")}</span>
          <Button size="sm" onClick={() => navigate("/team-settings/roles/new")}>
            {t("create_role")}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p>{t("loading")}</p>}
        {isError && (
          <div className="space-y-2">
            <p className="text-sm text-red-500">{t("error_loading_roles")}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              {t("retry")}
            </Button>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.id} className="border rounded-lg p-4 dark:border-gray-700">
                <h3 className="font-medium">{t(role.name as TranslationKey)}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t(role.description as TranslationKey)}
                </p>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/team-settings/roles/${role.id}`)}
                  >
                    {t("edit_permissions")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RolesTab;
