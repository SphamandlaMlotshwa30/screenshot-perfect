import { createFileRoute,Link } from '@tanstack/react-router';
import { pageMeta } from '@/features/campus/domain';
import { Button } from '@/components/ui/button';
export const Route=createFileRoute('/about')({head:()=>pageMeta('About Campus Challenges','Learn more about Campus Challenges and campus support.'),component:Page});
function Page(){return <main className="auth-page"><section className="max-w-xl"><h1 className="text-3xl font-bold mb-6">About Campus Challenges</h1><p className="detail-description">Campus Challenges connects student ideas with the people who can make them happen. Students submit campus challenges, supervisors assess impact, feasibility, cost efficiency and innovation, and administrators allocate the highest-priority work. Representatives and students carry out assignments, report progress and share evidence for supervisor verification.</p><Button asChild><Link to="/">Back to campus overview</Link></Button></section></main>;}
