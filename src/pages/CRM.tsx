import { CRMView } from "@/components/crm/CRMView";
import { AppLayout } from "@/components/layout/AppLayout";

const CRM = () => {
  return (
    <AppLayout currentView="crm">
      <CRMView />
    </AppLayout>
  );
};

export default CRM;
