import { redirect } from 'next/navigation';

export default function MarketplaceRedirect() {
  redirect('/');
  return null;
} 