import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Test if we can reach the migrate endpoint
    const method = req.method;
    const url = req.url;
    
    const result = {
      status: 'test_migrate',
      timestamp: new Date().toISOString(),
      method: method,
      url: url,
      message: 'Test endpoint is working',
      migrate_endpoint_info: {
        expected_method: 'POST',
        expected_url: '/api/migrate-db',
        auth_header_required: 'Authorization: Bearer migrate-now'
      }
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('Test migrate failed:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}