import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { Database } from '@/integrations/supabase/types';
import { actionSchema, challengeSchema } from './domain';
export const getDemo = createServerFn({method:'GET'}).handler(async()=>{
 const url=process.env['SUPABASE_URL']; const key=process.env['SUPABASE_PUBLISHABLE_KEY'];
 if(!url||!key) throw new Error('Workspace unavailable');
 const client=createClient<Database>(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>{const h=new Headers(init?.headers);if(key.startsWith('sb_'))h.delete('Authorization');h.set('apikey',key);return fetch(input,{...init,headers:h});}}});
 const [challenges,criteria]=await Promise.all([client.from('challenges').select('*').eq('is_demo',true).order('created_at',{ascending:false}),client.from('criteria').select('*').order('weight',{ascending:false})]);
 if(challenges.error||criteria.error)throw new Error('Unable to load campus preview');
 return {challenges:challenges.data??[],criteria:criteria.data??[]};
});
export const getWorkspace=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const db=context.supabase;
 const [challenges,criteria,role,profiles,reports,notifications,audit,roles]=await Promise.all([
 db.from('challenges').select('*').eq('is_demo',false).order('created_at',{ascending:false}),db.from('criteria').select('*').order('weight',{ascending:false}),db.from('user_roles').select('role').eq('user_id',context.userId).single(),db.from('profiles').select('*'),db.from('progress_reports').select('*').order('report_date',{ascending:false}),db.from('notifications').select('*').order('created_at',{ascending:false}),db.from('audit_logs').select('*').order('timestamp',{ascending:false}).limit(100),db.from('user_roles').select('*')]);
 for(const result of [challenges,criteria,role,profiles,reports,notifications,audit,roles])if(result.error)throw new Error(result.error.message);
 return {challenges:challenges.data??[],criteria:criteria.data??[],role:role.data?.role??'student',profiles:profiles.data??[],reports:reports.data??[],notifications:notifications.data??[],audit:audit.data??[],roles:roles.data??[],userId:context.userId};
});
export const submitChallenge=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(input=>challengeSchema.parse(input)).handler(async({data,context})=>{
 if(data.supporting_file&&!data.supporting_file.startsWith(`${context.userId}/`))throw new Error('Invalid supporting document');
 const {data:profile}=await context.supabase.from('profiles').select('fullname').eq('id',context.userId).single();
 const result=await context.supabase.from('challenges').insert({...data,supporting_file:data.supporting_file??null,submitted_by:context.userId,submitter_name:profile?.fullname??'Campus member'}).select().single();
 if(result.error)throw new Error(result.error.message);return result.data;
});
export const performAction=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(input=>actionSchema.parse(input)).handler(async({data,context})=>{
 if(data.action==='progress'&&data.evidence_file&&!data.evidence_file.startsWith(`${context.userId}/`))throw new Error('Invalid evidence file');
 const {error}=await context.supabase.rpc('campus_action',{payload:data});if(error)throw new Error(error.message);return {success:true};
});
