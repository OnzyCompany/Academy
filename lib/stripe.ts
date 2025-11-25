import { supabase } from './supabase';

export async function createCheckoutSession(priceId: string) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Você precisa estar logado para assinar um plano.');
  }

  // Calls the 'stripe-checkout' Edge Function configured in Supabase
  const { data, error } = await supabase.functions.invoke('stripe-checkout', {
    body: {
      price_id: priceId,
      success_url: `${window.location.origin}/#/success`, // Using hash router compatible URL
      cancel_url: window.location.origin,
      mode: 'subscription',
    },
  });

  if (error) {
    console.error('Erro ao comunicar com Stripe:', error);
    throw new Error('Erro ao iniciar checkout. Tente novamente.');
  }

  if (data?.url) {
    window.location.href = data.url;
  } else if (data?.error) {
    throw new Error(data.error);
  }
  
  return data;
}