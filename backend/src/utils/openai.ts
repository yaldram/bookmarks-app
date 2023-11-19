import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmbeddings(text: string) {
    const embeddings = await openai.embeddings.create({
        input: text,
        model: 'text-embedding-ada-002',
    });

    return embeddings.data[0]?.embedding;
}
