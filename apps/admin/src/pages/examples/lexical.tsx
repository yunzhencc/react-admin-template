import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/examples/lexical')({
  component: lazyRouteComponent(() => import('@yunzhen/playground/pages/lexical/basic')),
});
