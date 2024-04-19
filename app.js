//DB CONNECTION
const { createClient } = require('@supabase/supabase-js');

const API_URL = "https://vkjpbgicdnhbehxtmrwg.supabase.co";
const PUBLIC_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZranBiZ2ljZG5oYmVoeHRtcndnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM1NDQzMDAsImV4cCI6MjAyOTEyMDMwMH0.P25ZFJdQSf97fBIr6yrzWE0ZZgad09-kS555L68d83M"
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZranBiZ2ljZG5oYmVoeHRtcndnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMzU0NDMwMCwiZXhwIjoyMDI5MTIwMzAwfQ.VTBm5IZNPi_Z_SLWWWxMzE3KxsKXuNgz0NJ1RpFDSyU"

const supabase = createClient(API_URL, PUBLIC_ANON_KEY);
//-------------------------------------------------------------------

const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

//FUNCIONES SUPABASE-------------------------------------------------------------------

const getTestData = async () => {
    try {
        const { data, error } = await supabase
            .from('test')
            .select('*')
        if (error) throw error
        console.log('data', data)
        return data
    }
    catch (error) {
        console.error('error', error)
    }
}

const insertTestData = async (mensaje) => {
    try {
      const { data, error } = await supabase.from('test').insert([{ mensaje : mensaje }]);
      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error inserting data:', error.message);
      return null;
    }
  };

//FUNCIONES SUPABASE-------------------------------------------------------------------

const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])

const flowDocs = addKeyword(['doc', 'documentacion', 'documentación']).addAnswer(
    [
        '📄 Aquí encontras las documentación recuerda que puedes mejorarla',
        'https://bot-whatsapp.netlify.app/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowTuto = addKeyword(['tutorial', 'tuto']).addAnswer(
    [
        '🙌 Aquí encontras un ejemplo rapido',
        'https://bot-whatsapp.netlify.app/docs/example/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowGracias = addKeyword(['gracias', 'grac']).addAnswer(
    [
        '🚀 Puedes aportar tu granito de arena a este proyecto',
        '[*opencollective*] https://opencollective.com/bot-whatsapp',
        '[*buymeacoffee*] https://www.buymeacoffee.com/leifermendez',
        '[*patreon*] https://www.patreon.com/leifermendez',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowDiscord = addKeyword(['discord']).addAnswer(
    ['🤪 Únete al discord', 'https://link.codigoencasa.com/DISCORD', '\n*2* Para siguiente paso.'],
    null,
    null,
    [flowSecundario]
)

const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
    .addAnswer(
        [
            'te comparto los siguientes links de interes sobre el proyecto',
            '👉 *doc* para ver la documentación',
            '👉 *gracias*  para ver la lista de videos',
            '👉 *discord* unirte al discord',
        ],
        null,
        null,
        [flowDocs, flowGracias, flowTuto, flowDiscord]
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()

}

main()
