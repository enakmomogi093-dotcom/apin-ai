import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  try {
    const { messages } = await req.json();
    if (!messages || messages.length === 0) {
      return NextResponse.json({ reply: 'Pesan kosong.' }, { status: 400 });
    }

    const latestMessage = messages[messages.length - 1].content;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: latestMessage,
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ reply: 'Terjadi kesalahan pada server AI.' }, { status: 500 });
  }
}
