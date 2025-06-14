
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const CONSENT_TYPES = [
  { id: 'marketing_emails', label: 'Marketing Emails', description: 'Receive promotional emails about new features and offers.' },
  { id: 'analytics_tracking', label: 'Analytics Tracking', description: 'Allow us to use your data for internal analytics to improve our services.' },
];

const ConsentManager: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchConsents = async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('gdpr_consents')
      .select('*')
      .eq('user_id', user.id);
    if (error) throw new Error(error.message);
    return data;
  };

  const { data: consents, isLoading } = useQuery({
    queryKey: ['gdpr_consents', user?.id],
    queryFn: fetchConsents,
    enabled: !!user,
  });

  const { mutate: updateConsent } = useMutation({
    mutationFn: async ({ consentType, isGranted }: { consentType: string; isGranted: boolean }) => {
      if (!user) return;
      const { error } = await supabase.from('gdpr_consents').upsert({
        user_id: user.id,
        consent_type: consentType,
        is_granted: isGranted,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,consent_type' });

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gdpr_consents', user?.id] });
      toast.success('Consent settings updated.');
    },
    onError: (error) => {
      toast.error(`Failed to update settings: ${error.message}`);
    },
  });
  
  const getConsentValue = (consentType: string) => {
    const consent = consents?.find(c => c.consent_type === consentType);
    return consent?.is_granted ?? false;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manage Your Consents</CardTitle>
          <CardDescription>Control how we use your data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Your Consents</CardTitle>
        <CardDescription>Control how we use your data. Your choices are saved automatically.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {CONSENT_TYPES.map(consent => (
          <div key={consent.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor={consent.id} className="font-medium">{consent.label}</Label>
              <p className="text-sm text-gray-500">{consent.description}</p>
            </div>
            <Switch
              id={consent.id}
              checked={getConsentValue(consent.id)}
              onCheckedChange={(isChecked) => updateConsent({ consentType: consent.id, isGranted: isChecked })}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ConsentManager;
