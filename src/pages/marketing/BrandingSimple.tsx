import { BrandSettingsForm } from "@/components/creator/BrandSettingsForm";
import { Palette } from "lucide-react";

export const BrandingSimple = () => {
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Branding</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Gerencie a identidade visual da sua marca
            </p>
          </div>
        </div>
      </div>

      {/* Formulário de Brand Settings */}
      <BrandSettingsForm />
    </div>
  );
};

