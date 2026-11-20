import { createFileRoute,Link } from '@tanstack/react-router';
import { pageMeta } from '@/features/campus/domain';
import { PublicFooter } from '@/features/campus/public-footer';
export const Route=createFileRoute('/terms')({head:()=>pageMeta('Terms and Conditions','The terms for using Development Challenges Community.'),component:Page});
const items=[['Accounts','One account per person. Keep your password private.'],['Submitting challenges','Only submit challenges you are entitled to share, without confidential personal information.'],['Student work','Teams work under academic supervision; outcomes are learning projects.'],['Conduct','Accounts may be suspended for misuse, false information or harassment.']];
function Page(){return <div className="min-h-screen flex flex-col"><main className="flex-1 max-w-2xl mx-auto px-6 py-10"><h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>{items.map(([h,p])=><section key={h} className="mb-4"><h2 className="font-semibold">{h}</h2><p className="text-sm text-muted-foreground">{p}</p></section>)}<Link to="/" className="text-primary text-sm">Back home</Link></main><PublicFooter/></div>;}
