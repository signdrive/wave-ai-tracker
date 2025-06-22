
class CSRFService {
  generateCSRFToken(): string {
    return crypto.randomUUID();
  }

  validateCSRFToken(token: string, expectedToken: string): boolean {
    return token === expectedToken;
  }
}

export const csrfService = new CSRFService();
