
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAlertPreferences } from '@/hooks/useAlertPreferences';
import { useToast } from '@/hooks/use-toast';

interface AlertPreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spotId: string;
  spotName: string;
}

const AlertPreferencesDialog: React.FC<AlertPreferencesDialogProps> = ({
  open,
  onOpenChange,
  spotId,
  spotName,
}) => {
  const { alertPreferences, saveAlertPreference, isSaving } = useAlertPreferences(spotId);
  const { toast } = useToast();

  const [minWaveHeight, setMinWaveHeight] = useState('');
  const [maxWaveHeight, setMaxWaveHeight] = useState('');
  const [preferredWindDirection, setPreferredWindDirection] = useState('');
  const [maxWindSpeed, setMaxWindSpeed] = useState('');
  const [maxCrowdLevel, setMaxCrowdLevel] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const existingPreference = alertPreferences.find(pref => pref.spot_id === spotId);

  useEffect(() => {
    if (existingPreference) {
      setMinWaveHeight(existingPreference.min_wave_height?.toString() || '');
      setMaxWaveHeight(existingPreference.max_wave_height?.toString() || '');
      setPreferredWindDirection(existingPreference.preferred_wind_direction || '');
      setMaxWindSpeed(existingPreference.max_wind_speed?.toString() || '');
      setMaxCrowdLevel(existingPreference.max_crowd_level?.toString() || '');
      setNotificationsEnabled(existingPreference.notifications_enabled);
    }
  }, [existingPreference]);

  const handleSave = () => {
    const preferences = {
      spot_id: spotId,
      min_wave_height: minWaveHeight ? parseFloat(minWaveHeight) : undefined,
      max_wave_height: maxWaveHeight ? parseFloat(maxWaveHeight) : undefined,
      preferred_wind_direction: preferredWindDirection || undefined,
      max_wind_speed: maxWindSpeed ? parseFloat(maxWindSpeed) : undefined,
      max_crowd_level: maxCrowdLevel ? parseInt(maxCrowdLevel) : undefined,
      notifications_enabled: notificationsEnabled,
    };

    saveAlertPreference(preferences);
    
    toast({
      title: "Alert preferences saved",
      description: `Notifications for ${spotName} have been updated.`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alert Preferences for {spotName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Enable Notifications</Label>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-wave">Min Wave Height (ft)</Label>
              <Input
                id="min-wave"
                type="number"
                step="0.1"
                value={minWaveHeight}
                onChange={(e) => setMinWaveHeight(e.target.value)}
                placeholder="2.0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-wave">Max Wave Height (ft)</Label>
              <Input
                id="max-wave"
                type="number"
                step="0.1"
                value={maxWaveHeight}
                onChange={(e) => setMaxWaveHeight(e.target.value)}
                placeholder="8.0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wind-direction">Preferred Wind Direction</Label>
            <Select value={preferredWindDirection} onValueChange={setPreferredWindDirection}>
              <SelectTrigger>
                <SelectValue placeholder="Select wind direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="N">North</SelectItem>
                <SelectItem value="NE">Northeast</SelectItem>
                <SelectItem value="E">East</SelectItem>
                <SelectItem value="SE">Southeast</SelectItem>
                <SelectItem value="S">South</SelectItem>
                <SelectItem value="SW">Southwest</SelectItem>
                <SelectItem value="W">West</SelectItem>
                <SelectItem value="NW">Northwest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-wind">Max Wind Speed (mph)</Label>
              <Input
                id="max-wind"
                type="number"
                value={maxWindSpeed}
                onChange={(e) => setMaxWindSpeed(e.target.value)}
                placeholder="15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-crowd">Max Crowd Level (%)</Label>
              <Input
                id="max-crowd"
                type="number"
                value={maxCrowdLevel}
                onChange={(e) => setMaxCrowdLevel(e.target.value)}
                placeholder="50"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="flex-1 bg-ocean hover:bg-ocean-dark"
            >
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlertPreferencesDialog;
