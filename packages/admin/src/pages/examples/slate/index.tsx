import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/examples/slate/')({
  component: lazyRouteComponent(() => import('./views/textarea')),
});
