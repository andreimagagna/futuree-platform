import { QualificationFunnel } from "@/components/QualificationFunnel";
import { AppLayout } from "@/components/layout/AppLayout";

const Funnel = () => {
  return (
    <AppLayout currentView="funnel">
      <QualificationFunnel />
    </AppLayout>
  );
};

export default Funnel;
