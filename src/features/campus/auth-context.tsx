import { createContext,useContext,useEffect,useState,type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { useRouter } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
const AuthContext=createContext<{user:User|null;ready:boolean}>({user:null,ready:false});
export function AuthProvider({children}:{children:ReactNode}) {
 const [user,setUser]=useState<User|null>(null);const [ready,setReady]=useState(false);const router=useRouter();const qc=useQueryClient();
 useEffect(()=>{let active=true;const refresh=()=>{supabase.auth.getUser().then(({data})=>{if(active){setUser(data.user);setReady(true);}});};refresh();const {data}=supabase.auth.onAuthStateChange(event=>{if(!['SIGNED_IN','SIGNED_OUT','USER_UPDATED'].includes(event))return;queueMicrotask(()=>{refresh();router.invalidate();if(event!=='SIGNED_OUT')qc.invalidateQueries();});});return()=>{active=false;data.subscription.unsubscribe();};},[router,qc]);
 return <AuthContext.Provider value={{user,ready}}>{children}</AuthContext.Provider>;
}
export const useCampusAuth=()=>useContext(AuthContext);
