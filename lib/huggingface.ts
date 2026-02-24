import * as https from 'https';

interface EmbeddingResponse {
  embedding?: number[];
  error?: string;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.HUGGINGFACE_API_KEY || 'hf_demo_key';
  
  // For demo, return mock embedding if key is demo key
  if (apiKey === 'hf_demo_key') {
    return Array(384).fill(0).map(() => Math.random());
  }

  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      inputs: text,
      options: {
        wait_for_model: true,
      },
    });

    const options = {
      hostname: 'api-inference.huggingface.co',
      path: '/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            resolve(parsed[0]);
          } else if (parsed.embedding) {
            resolve(parsed.embedding);
          } else {
            // Mock fallback
            resolve(Array(384).fill(0).map(() => Math.random()));
          }
        } catch {
          resolve(Array(384).fill(0).map(() => Math.random()));
        }
      });
    });

    req.on('error', () => {
      resolve(Array(384).fill(0).map(() => Math.random()));
    });

    req.write(data);
    req.end();
  });
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (normA * normB);
}

export async function calculateThreatRelevance(
  orgProfile: string,
  threatDescription: string
): Promise<number> {
  try {
    const [orgEmbedding, threatEmbedding] = await Promise.all([
      generateEmbedding(orgProfile),
      generateEmbedding(threatDescription),
    ]);

    return cosineSimilarity(orgEmbedding, threatEmbedding);
  } catch {
    return 0.5; // Default to medium relevance on error
  }
}
