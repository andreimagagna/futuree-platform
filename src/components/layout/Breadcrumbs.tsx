import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  "": "Dashboard",
  dashboard: "Dashboard",
  crm: "CRM",
  tasks: "Tarefas",
  funnel: "Funil",
  reports: "Relatórios",
  marketing: "Marketing",
  campaigns: "Campanhas",
  business: "Business",
  analytics: "Analytics",
  settings: "Configurações",
};

export const Breadcrumbs = ({ className }: { className?: string }) => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  const items = segments.length === 0 ? [""] : segments;

  const buildHref = (index: number) => {
    const parts = segments.slice(0, index + 1);
    return "/" + parts.join("/");
  };

  return (
    <Breadcrumb className={cn("hidden md:block", className)}>
      <BreadcrumbList>
        {items.map((seg, idx) => {
          const isLast = idx === items.length - 1;
          const label = LABELS[seg] ?? (seg.charAt(0).toUpperCase() + seg.slice(1));
          return (
            <React.Fragment key={`${seg}-${idx}`}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={buildHref(idx)}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
