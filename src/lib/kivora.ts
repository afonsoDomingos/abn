// Kivora Payments API Integration

const KIVORA_API_URL = `${process.env.KIVORA_BASE_URL || 'https://www.kivorapayments.com'}/v1`;
const KIVORA_API_KEY = process.env.KIVORA_API_KEY;

export interface KivoraC2BRequest {
  phone: string;
  amount: number;
  currency?: string;
  reference?: string;
  description?: string;
}

export interface KivoraC2BResponse {
  id: string;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  amount: number;
  currency: string;
  reference?: string;
  createdAt?: string;
}

export async function createC2BPayment(request: KivoraC2BRequest): Promise<KivoraC2BResponse> {
  try {
    const response = await fetch(`${KIVORA_API_URL}/c2b`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KIVORA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Erro ao criar pagamento');
    }

    return await response.json();
  } catch (error) {
    console.error('Kivora API Error:', error);
    throw error;
  }
}

export async function getC2BPayment(paymentId: string): Promise<KivoraC2BResponse> {
  try {
    const response = await fetch(`${KIVORA_API_URL}/c2b/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${KIVORA_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao consultar pagamento');
    }

    return await response.json();
  } catch (error) {
    console.error('Kivora API Error:', error);
    throw error;
  }
}
