import { z } from 'zod';
import type { Database } from '@/integrations/supabase/types';
export type Challenge = Database['public']['Tables']['challenges']['Row'];
export type Criterion = Database['public']['Tables']['criteria']['Row'];
export type Role = Database['public']['Enums']['app_role'];
export const roleNames: Record<Role,string> = {admin:'Administrator',supervisor:'Supervisor',representative:'Representative',student:'Student'};
export const areasOfInterest=['Software and Web Development','Data Science and Machine Learning','IoT and Embedded Systems','Environmental Systems and Water','Renewable Energy and Sustainability','Health and Community Wellbeing','Education and Skill Development','Entrepreneurship and Business Support','Design, Media and Communications','Research'] as const;
export const challengeSchema = z.object({title:z.string().trim().min(3).max(150),description:z.string().trim().min(10).max(5000),department:z.string().trim().min(2).max(100),category:z.string().trim().min(2).max(80),funding_required:z.preprocess(v=>v==='yes'?true:v==='no'?false:v,z.boolean({message:'Please say whether the project needs funding'})),supporting_file:z.string().max(500).nullable().optional()});
export const signupSchema = z.object({fullname:z.string().trim().min(2).max(100),member_number:z.string().trim().min(2).max(50),email:z.string().trim().email().max(255),password:z.string().min(8).max(128),confirm:z.string(),requested_role:z.enum(['student','supervisor','representative'])}).refine(x=>x.password===x.confirm,{message:'Passwords do not match',path:['confirm']});
const id=z.string().uuid();
export const actionSchema=z.discriminatedUnion('action',[
 z.object({action:z.literal('role'),user_id:id,role:z.enum(['admin','supervisor','representative','student'])}),
 z.object({action:z.literal('criteria'),criteria:z.array(z.object({id,weight:z.number().min(0).max(1)})).min(1).max(20)}),
 z.object({action:z.literal('score'),challenge_id:id,scores:z.array(z.object({criterion_id:id,score:z.number().min(1).max(10)})).min(1).max(20),feedback:z.string().max(3000)}),
 z.object({action:z.literal('allocate'),challenge_id:id,allocated_to:id,supervisor_id:id}),
 z.object({action:z.literal('progress'),challenge_id:id,description:z.string().trim().min(10).max(3000),evidence_file:z.string().max(500).nullable()}),
 z.object({action:z.literal('verify'),challenge_id:id,report_id:id}),
 z.object({action:z.enum(['review','recommend','decline_allocation','accept','complete','reject']),challenge_id:id,feedback:z.string().max(3000).optional()})
]);
export type Action=z.infer<typeof actionSchema>;
export function weightedScore(scores:number[],weights:number[]) { if(scores.length!==weights.length || scores.some(s=>s<1||s>10)) throw new Error('Scores must be between 1 and 10'); if(Math.abs(weights.reduce((a,b)=>a+b,0)-1)>0.0001) throw new Error('Weights must total 100%'); return Math.round(scores.reduce((n,s,i)=>n+s*(weights[i]??0),0)*100)/100; }
export const statuses=['Submitted','Under Review','Evaluated','Allocated','In Progress','Completed','Rejected'];
export function rankChallenges(challenges:Challenge[]) {return challenges.filter(c=>c.weighted_score!==null).sort((a,b)=>(b.weighted_score??0)-(a.weighted_score??0));}
export const pageMeta=(title:string,description:string)=>({meta:[{title:`${title} · Development Challenges Community`},{name:'description',content:description},{property:'og:title',content:`${title} · Development Challenges Community`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]});
