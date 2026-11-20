import { createFileRoute } from '@tanstack/react-router';
import { DccRegistrationPage } from '@/features/campus/dcc-registration-page';
import { pageMeta } from '@/features/campus/domain';

export const Route = createFileRoute('/register')({
  head: () => pageMeta('Membership Registration', 'Register for a DCC account.'),
  component: DccRegistrationPage,
});
