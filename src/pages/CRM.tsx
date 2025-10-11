import { CRMView } from "@/components/crm/CRMView";
import { LeadDetailView } from "@/components/crm/LeadDetailView";
import { useParams } from "react-router-dom";

const CRM = () => {
  const { id } = useParams();
  return id ? <LeadDetailView /> : <CRMView />;
};

export default CRM;
