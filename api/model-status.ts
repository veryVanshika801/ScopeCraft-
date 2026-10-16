import type { IncomingMessage, ServerResponse } from 'http';
import { getProviderConfig } from '../src/utils/proposalEngine';

interface VercelRequest extends IncomingMessage {
  method?: string;
}

interface VercelResponse extends ServerResponse {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { key, provider, model, baseUrl } = getProviderConfig();
  res.status(200).json({
    hasKey: Boolean(key && key.trim().length > 0),
    provider,
    model,
    endpoint: baseUrl,
  });
}
