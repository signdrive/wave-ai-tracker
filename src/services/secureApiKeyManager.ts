
// Secure API key management service
import { supabase } from '@/integrations/supabase/client';

interface ApiKeyConfig {
  service: string;
  key: string;
  encrypted: boolean;
  last_used?: string;
}

class SecureApiKeyManager {
  private keyCache = new Map<string, string>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private hasAttemptedLoad = false;

  async getApiKey(service: string): Promise<string | null> {
    try {
      // Check cache first
      const cachedKey = this.getCachedKey(service);
      if (cachedKey) {
        return cachedKey;
      }

      // Prevent repeated failed attempts
      if (this.hasAttemptedLoad) {
        console.warn(`API key for ${service} not available (previous attempt failed)`);
        return null;
      }

      this.hasAttemptedLoad = true;

      // Try direct database access first (for non-admin users)
      const { data, error } = await supabase
        .from('api_keys')
        .select('key_value')
        .eq('service_name', service)
        .eq('is_active', true)
        .maybeSingle();

      if (!error && data?.key_value) {
        this.setCachedKey(service, data.key_value);
        return data.key_value;
      }

      console.warn(`No API key found for service: ${service}`);
      return null;

    } catch (error) {
      console.warn('Error fetching API key, falling back to mock data:', error);
      return null;
    }
  }

  async setApiKey(service: string, key: string): Promise<boolean> {
    try {
      // Validate key format (basic check)
      if (!key || key.length < 10) {
        throw new Error('Invalid API key format');
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('No authenticated user');
      }

      // Sanitize service name
      const sanitizedService = service.replace(/[^a-zA-Z0-9_-]/g, '');

      const { error } = await supabase
        .from('api_keys')
        .upsert({
          service_name: sanitizedService,
          key_name: `${sanitizedService}_api_key`,
          key_value: key,
          user_id: user.id,
          is_active: true,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      // Clear cache for this service
      this.clearCachedKey(service);
      return true;
    } catch (error) {
      console.error('Error setting API key:', error);
      return false;
    }
  }

  async storeApiKey(service: string, keyName: string, keyValue: string): Promise<boolean> {
    return this.setApiKey(service, keyValue);
  }

  async deactivateApiKey(service: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('service_name', service);

      if (error) {
        throw error;
      }

      // Clear cache for this service
      this.clearCachedKey(service);
      return true;
    } catch (error) {
      console.error('Error deactivating API key:', error);
      return false;
    }
  }

  private getCachedKey(service: string): string | null {
    const expiry = this.cacheExpiry.get(service);
    if (!expiry || Date.now() > expiry) {
      this.clearCachedKey(service);
      return null;
    }
    return this.keyCache.get(service) || null;
  }

  private setCachedKey(service: string, key: string): void {
    this.keyCache.set(service, key);
    this.cacheExpiry.set(service, Date.now() + this.CACHE_DURATION);
  }

  private clearCachedKey(service: string): void {
    this.keyCache.delete(service);
    this.cacheExpiry.delete(service);
  }

  clearAllCache(): void {
    this.keyCache.clear();
    this.cacheExpiry.clear();
  }
}

export const secureApiKeyManager = new SecureApiKeyManager();
