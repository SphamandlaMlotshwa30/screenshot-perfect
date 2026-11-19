import { describe,it,expect } from 'vitest';
import { weightedScore,rankChallenges,signupSchema } from '@/features/campus/domain';
import type { Challenge } from '@/features/campus/domain';
describe('Campus MCDA rules',()=>{
 it('uses Impact 35%, Feasibility 25%, Cost Efficiency 20%, Innovation 20%',()=>expect(weightedScore([10,8,7,9],[.35,.25,.2,.2])).toBe(8.7));
 it('rejects scores outside the 1–10 scale',()=>{expect(()=>weightedScore([0,8,7,9],[.35,.25,.2,.2])).toThrow();expect(()=>weightedScore([11,8,7,9],[.35,.25,.2,.2])).toThrow();});
 it('requires weights to total 100%',()=>expect(()=>weightedScore([8,8],[.35,.25])).toThrow());
 it('ranks scored challenges from highest to lowest',()=>{const rows=[{id:'a',weighted_score:7},{id:'b',weighted_score:9},{id:'c',weighted_score:null}] as Challenge[];expect(rankChallenges(rows).map(c=>c.id)).toEqual(['b','a']);});
 it('does not permit administrator self-registration',()=>expect(signupSchema.safeParse({fullname:'Campus Member',member_number:'12345',email:'member@example.com',password:'password123',confirm:'password123',requested_role:'admin'}).success).toBe(false));
 it('requires matching confirmation passwords',()=>expect(signupSchema.safeParse({fullname:'Campus Member',member_number:'12345',email:'member@example.com',password:'password123',confirm:'different',requested_role:'student'}).success).toBe(false));
});
