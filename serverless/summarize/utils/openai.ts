import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSummary(context: string, text: string) {
    const systemPrompt =
        'You are a professional text summarizer, please write a 50 word summary about the text specified, also give a list of 3 relevant keywords representing the topics covered in the text.';

    const userPrompt = `Summarize the text between <text></text> XML tags in a concise and coherent manner, distilling the core ideas and themes while removing extraneous detail. Generate a summary no longer than 50 words. 
      The original text may contain redundant or irrelevant information as it is scraped from the web. Focus only on the most salient points. Use the contextual information provided between <context></context> XML tags to further understand the topic of text.
      <context>${context}</context>
      <text>${text}</text>
    `;

    const messages: ChatCompletionMessageParam[] = [
        {
            role: 'system',
            content: systemPrompt,
        },
        {
            role: 'user',
            content: userPrompt,
        },
    ];

    const function_descriptions = [
        {
            name: 'get_summary',
            description: 'Creates a summary from the given text',
            parameters: {
                type: 'object',
                properties: {
                    summary: {
                        type: 'string',
                        description: '50 word summary for the given text',
                    },
                    tags: {
                        type: 'array',
                        description: 'a list of 3 relevant keywords representing the topics covered in the text',
                        items: {
                            type: 'string',
                        },
                    },
                },
            },
            required: ['summary', 'tags'],
        },
    ];

    const chatCompletion = await openai.chat.completions.create({
        messages: messages,
        model: 'gpt-3.5-turbo-0613',
        functions: function_descriptions,
        temperature: 0,
    });

    return chatCompletion.choices[0]?.message?.function_call?.arguments;
}

export async function generateEmbeddings(summary: string) {
    const embeddings = await openai.embeddings.create({
        input: summary,
        model: 'text-embedding-ada-002',
    });

    return embeddings.data[0]?.embedding;
}
