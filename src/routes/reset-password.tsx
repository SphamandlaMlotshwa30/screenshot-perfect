import { createFileRoute } from '@tanstack/react-router';
import { AuthPage } from '@/features/campus/auth-page';
import { pageMeta } from '@/features/campus/domain';
export const Route=createFileRoute('/reset-password')({head:()=>pageMeta('Reset password','Reset password to your Campus Challenges account.'),component:()=> <AuthPage reset/>});
