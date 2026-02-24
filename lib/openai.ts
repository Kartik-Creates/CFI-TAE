import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateThreatExplanation(
  threatName: string,
  threatDescription: string,
  riskScore: number,
  industry: string,
  complianceFrameworks: string[],
  organizationContext: string
): Promise<{
  explanation: string;
  relevanceReasoning: string;
  industryContext: string;
}> {
  try {
    const systemPrompt = `You are a cybersecurity expert analyzing threat relevance and risk impact for organizations. 
Your explanations should be technical but understandable, focusing on practical implications.
Always provide context-specific analysis based on the organization's industry and compliance requirements.`;

    const userPrompt = `Analyze the following threat for ${industry} industry organization:

Threat: ${threatName}
Description: ${threatDescription}
Risk Score: ${riskScore}/100
Compliance Frameworks: ${complianceFrameworks.join(', ')}
Organization Context: ${organizationContext}

Provide three sections:
1. Explanation: Clear explanation of why this threat matters (2-3 sentences)
2. Relevance Reasoning: Why this threat is relevant to this organization (2-3 sentences)
3. Industry Context: How this threat specifically affects ${industry} industry (2-3 sentences)`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const content = response.choices[0].message.content || '';
    
    // Parse the response into sections
    const sections = content.split(/\d\.\s+/);
    const explanation = sections[1]?.split('\n')[0] || '';
    const relevanceReasoning = sections[2]?.split('\n')[0] || '';
    const industryContext = sections[3]?.split('\n')[0] || '';

    return {
      explanation: explanation.trim(),
      relevanceReasoning: relevanceReasoning.trim(),
      industryContext: industryContext.trim(),
    };
  } catch (error) {
    console.error('Error generating threat explanation:', error);
    throw error;
  }
}

export async function generateMitigationStrategy(
  threatName: string,
  riskScore: number,
  industry: string
): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a cybersecurity expert. Generate practical mitigation strategies.',
        },
        {
          role: 'user',
          content: `Generate 5 specific mitigation strategies for "${threatName}" (Risk Score: ${riskScore}/100) in the ${industry} industry. Return as a JSON array of strings.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content || '[]';
    try {
      const strategies = JSON.parse(content);
      return Array.isArray(strategies) ? strategies : [];
    } catch {
      return [content];
    }
  } catch (error) {
    console.error('Error generating mitigation strategies:', error);
    throw error;
  }
}
