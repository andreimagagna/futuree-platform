import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-4">
        <h2 className="text-2xl font-bold">Configurações</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Preferências do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Configurações em desenvolvimento...</p>
          </CardContent>
        </Card>
      </div>
  );
};

export default Settings;
