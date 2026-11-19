import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { CampusDashboard } from '@/features/campus/dashboard';
import { workspaceOptions } from '@/features/campus/workspace-query';
import { pageMeta } from '@/features/campus/domain';
export const Route=createFileRoute('/_authenticated/reports')({head:()=>pageMeta('Reports & Analytics','Reports & Analytics for your Campus Challenges workspace.'),loader:({context})=>context.queryClient.ensureQueryData(workspaceOptions),component:Page});
function Page(){const {data}=useSuspenseQuery(workspaceOptions);return <CampusDashboard data={data} workspace={data} view="reports"/>;}
