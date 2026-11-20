import { createFileRoute,Link } from '@tanstack/react-router';
import { pageMeta } from '@/features/campus/domain';
import { Button } from '@/components/ui/button';
export const Route=createFileRoute('/contact')({head:()=>pageMeta('Contact & support','Learn more about Development Challenges Community and community support.'),component:Page});
function Page(){return <main className="auth-page"><section className="max-w-xl"><h1 className="text-3xl font-bold mb-6">Contact & support</h1><p className="detail-description">For help with your account or development challenges, contact community support. For evaluation or progress questions, contact the supervisor assigned to your challenge.</p><p className="mb-8"><a className="text-primary" href="mailto:22302831@dut4life.ac.za">22302831@dut4life.ac.za</a></p><Button asChild><Link to="/">Back to overview</Link></Button></section></main>;}
