import { createFileRoute,Link } from '@tanstack/react-router';
import { queryOptions,useSuspenseQuery } from '@tanstack/react-query';
import { getDemo } from '@/features/campus/campus.functions';
import { CampusDashboard } from '@/features/campus/dashboard';
import { pageMeta } from '@/features/campus/domain';
const demoOptions=queryOptions({queryKey:['campus-demo'],queryFn:()=>getDemo()});
export const Route=createFileRoute('/')({head:()=>pageMeta('Campus overview','Welcome to Campus Challenges. Discover campus ideas, review impact rankings, and join your campus community.'),loader:({context})=>context.queryClient.ensureQueryData(demoOptions),component:Index});
function Index(){const {data}=useSuspenseQuery(demoOptions);return <><CampusDashboard data={data} demo/><div className="bg-card border-t border-border py-6 text-center text-sm text-muted-foreground">Welcome to Campus Challenges <Link to="/register" className="text-primary mx-3">Register</Link><Link to="/about" className="mx-3">About</Link><Link to="/contact" className="mx-3">Contact</Link></div></>;}
