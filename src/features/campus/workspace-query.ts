import { queryOptions } from '@tanstack/react-query';
import { getWorkspace } from './campus.functions';
export const workspaceOptions=queryOptions({queryKey:['campus-workspace'],queryFn:()=>getWorkspace()});
