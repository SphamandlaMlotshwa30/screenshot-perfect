import { createFileRoute } from '@tanstack/react-router';
import { AuthPage } from '@/features/campus/auth-page';
import { pageMeta } from '@/features/campus/domain';
export const Route=createFileRoute('/auth')({head:()=>pageMeta('Log in','Log in to your Campus Challenges account.'),component:()=> <AuthPage />});
