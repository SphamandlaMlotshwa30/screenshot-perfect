import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { CampusDashboard } from '@/features/campus/dashboard';
import { getDemo } from '@/features/campus/campus.functions';
import { pageMeta, type Challenge, type Criterion } from '@/features/campus/domain';

export const Route=createFileRoute('/dashboard')({head:()=>pageMeta('Public Dashboard','Public development challenges dashboard.'),component:Page});

function Page(){
 const load=useServerFn(getDemo);
 const [data,setData]=useState<{challenges:Challenge[];criteria:Criterion[]}|null>(null);
 useEffect(()=>{load({}).then(setData).catch(()=>setData({challenges:[],criteria:[]}));},[load]);
 if(!data)return <main className="auth-page"><p className="text-sm text-muted-foreground">Loading public dashboard...</p></main>;
 return <CampusDashboard data={data} demo/>;
}
