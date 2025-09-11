import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
(async () => {
  if (!process.env.GOOGLE_API_KEY) {
    console.error('Define GOOGLE_API_KEY en el entorno');
    process.exit(1);
  }
  const m = new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY /*, modelName: 'embedding-001' opcional*/ });
  try {
    const res = await m.embedDocuments(['hola mundo']);
    console.log('tipo res', Array.isArray(res) ? 'Array' : typeof res, 'len', (res as any)?.length);
    const first = (res as any)[0];
    console.log('first length', first?.length ?? 'NA');
    console.log('muestra first', (first && first.slice ? first.slice(0,8) : first));
  } catch (err) {
    console.error('Error en embed test:', err);
  }
})();