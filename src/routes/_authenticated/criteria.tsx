import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { CampusDashboard } from '@/features/campus/dashboard';
import { workspaceOptions } from '@/features/campus/workspace-query';
import { pageMeta } from '@/features/campus/domain';
export const Route=createFileRoute('/_authenticated/criteria')({head:()=>pageMeta('Criteria & Weights','Criteria & Weights for your Development Challenges Community workspace.'),loader:({context})=>context.queryClient.ensureQueryData(workspaceOptions),component:Page});
function Page(){const {data}=useSuspenseQuery(workspaceOptions);return <CampusDashboard data={data} workspace={data} view="criteria"/>;}
