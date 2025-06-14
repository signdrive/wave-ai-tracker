
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { LogOut } from 'lucide-react';

const DataRequestManager: React.FC = () => {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [requestType, setRequestType] = useState<'access' | 'deletion' | null>(null);

  const { mutate: createDataRequest, isPending } = useMutation({
    mutationFn: async (type: 'access' | 'deletion') => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase.from('data_requests').insert({
        user_id: user.id,
        request_type: type,
      });
      if (error) throw new Error(error.message);
      return type;
    },
    onSuccess: async (type) => {
      queryClient.invalidateQueries({ queryKey: ['data_requests', user?.id] });
      toast.success(
        type === 'access'
          ? 'Data access request submitted. We will email you your data within 30 days.'
          : 'Account deletion request submitted. This process is irreversible.'
      );
      if (type === 'deletion') {
        // Here you would typically invoke an edge function to notify admins
        // await supabase.functions.invoke('handle-data-deletion-request', { body: { userId: user.id } });
        await signOut();
      } else {
        // Optionally invoke edge function for access request
        // await supabase.functions.invoke('handle-data-access-request', { body: { userId: user.id } });
      }
      setDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Request failed: ${error.message}`);
      setDialogOpen(false);
    },
  });

  const handleRequest = (type: 'access' | 'deletion') => {
    setRequestType(type);
    setDialogOpen(true);
  };

  const dialogContent = {
    access: {
      title: 'Request a copy of your data?',
      description: 'We will process your request and send an export of your personal data to your registered email address within 30 days.'
    },
    deletion: {
      title: 'Are you sure you want to delete your account?',
      description: 'This action is permanent and cannot be undone. All your data, including surf logs and session history, will be permanently deleted.'
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Data & Account Management</CardTitle>
          <CardDescription>Request a copy of your data or permanently delete your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" onClick={() => handleRequest('access')} disabled={isPending}>
              Request My Data
            </Button>
            <Button variant="destructive" onClick={() => handleRequest('deletion')} disabled={isPending}>
              <LogOut className="w-4 h-4 mr-2" />
              Delete My Account
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {requestType && (
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dialogContent[requestType].title}</AlertDialogTitle>
              <AlertDialogDescription>
                {dialogContent[requestType].description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => createDataRequest(requestType)}
                className={requestType === 'deletion' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default DataRequestManager;
