
import { supabase } from '@/integrations/supabase/client';

interface SecureApiKey {
  id: string;
  service_name: string;
  key_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

class SecureApiKeyManager {
  private cache = new Map<string, string>();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes
  private lastCacheUpdate = 0;

  async getApiKey(serviceName: string): Promise<string | null> {
    try {
      // Check cache first
      if (this.isCacheValid() && this.cache.has(serviceName)) {
        return this.cache.get(serviceName) || null;
      }

      // Get from secure edge function
      const { data, error } = await supabase.functions.invoke('get-api-keys', {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) {
        console.error('Failed to retrieve API keys:', error);
        return null;
      }

      // Update cache
      if (data) {
        this.updateCache(data);
        return data[serviceName] || null;
      }

      return null;
    } catch (error) {
      console.error('API key retrieval error:', error);
      return null;
    }
  }

  async storeApiKey(serviceName: string, keyName: string, keyValue: string): Promise<boolean> {
    try {
      // Input validation
      if (!this.validateApiKeyInput(serviceName, keyName, keyValue)) {
        throw new Error('Invalid API key input');
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User not authenticated:', userError);
        return false;
      }

      const { error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          service_name: serviceName,
          key_name: keyName,
          key_value: keyValue, // Will be encrypted by trigger
          is_active: true
        });

      if (error) {
        console.error('Failed to store API key:', error);
        return false;
      }

      // Clear cache to force refresh
      this.clearCache();
      return true;
    } catch (error) {
      console.error('API key storage error:', error);
      return false;
    }
  }

  async deactivateApiKey(serviceName: string): Promise<boolean> {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User not authenticated:', userError);
        return false;
      }

      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('service_name', serviceName)
        .eq('user_id', user.id);

      if (error) {
        console.error('Failed to deactivate API key:', error);
        return false;
      }

      // Remove from cache
      this.cache.delete(serviceName);
      return true;
    } catch (error) {
      console.error('API key deactivation error:', error);
      return false;
    }
  }

  private validateApiKeyInput(serviceName: string, keyName: string, keyValue: string): boolean {
    // Service name validation
    const allowedServices = ['stormglass', 'weatherapi', 'surfline', 'magicseaweed'];
    if (!allowedServices.includes(serviceName)) {
      return false;
    }

    // Key name validation (alphanumeric and underscores only)
    if (!/^[a-zA-Z0-9_]+$/.test(keyName)) {
      return false;
    }

    // Key value validation (non-empty, reasonable length)
    if (!keyValue || keyValue.length < 10 || keyValue.length > 200) {
      return false;
    }

    // Check for potentially malicious content
    if (this.containsMaliciousContent(keyValue)) {
      return false;
    }

    return true;
  }

  private containsMaliciousContent(input: string): boolean {
    const maliciousPatterns = [
      /<script/i,
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /on\w+=/i,
      /eval\(/i,
      /expression\(/i
    ];

    return maliciousPatterns.some(pattern => pattern.test(input));
  }

  private isCacheValid(): boolean {
    return Date.now() - this.lastCacheUpdate < this.cacheExpiry;
  }

  private updateCache(data: Record<string, string>): void {
    this.cache.clear();
    Object.entries(data).forEach(([key, value]) => {
      this.cache.set(key, value);
    });
    this.lastCacheUpdate = Date.now();
  }

  private clearCache(): void {
    this.cache.clear();
    this.lastCacheUpdate = 0;
  }
}

export const secureApiKeyManager = new SecureApiKeyManager();
