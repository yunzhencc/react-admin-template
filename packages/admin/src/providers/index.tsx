import { QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';
import { queryClient } from '@/lib/react-query';

interface ProvidersProps {
  children: React.ReactNode;
};

export function Providers(props: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
}
