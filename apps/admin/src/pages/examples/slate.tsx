import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/examples/slate')({
  component: lazyRouteComponent(() => import('@yunzhen/playground/pages/slate/text-area')),
});
