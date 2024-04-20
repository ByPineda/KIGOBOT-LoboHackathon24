//DB CONNECTION
const { createClient } = require('@supabase/supabase-js');

const API_URL = "https://vkjpbgicdnhbehxtmrwg.supabase.co";
const PUBLIC_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZranBiZ2ljZG5oYmVoeHRtcndnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM1NDQzMDAsImV4cCI6MjAyOTEyMDMwMH0.P25ZFJdQSf97fBIr6yrzWE0ZZgad09-kS555L68d83M"
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZranBiZ2ljZG5oYmVoeHRtcndnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMzU0NDMwMCwiZXhwIjoyMDI5MTIwMzAwfQ.VTBm5IZNPi_Z_SLWWWxMzE3KxsKXuNgz0NJ1RpFDSyU"

const supabase = createClient(API_URL, PUBLIC_ANON_KEY);
//-------------------------------------------------------------------

const { createBot, createProvider, createFlow, addKeyword, addAnswer } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

//FUNCIONES DEBUG-------------------------------------------------------------------
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


//-----------------------------------------------------------------------------------
//FUNCIONES SUPABASE-------------------------------------------------------------------

const verifyUser = async (user) => {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('telefono', user)
        if (error) throw error
        console.log('data', data)
        return data
    }
    catch (error) {
        console.error('error', error)
    }
}

const verifyTicket = async (ticket) => {
    try {
        const { data, error } = await supabase
            .from('tickets')
            .select('*')
            .eq('folio', ticket)
        if (error) throw error
        console.log('data', data)
        return data
    }
    catch (error) {
        console.error('error', error)
    }
}

//FUNCIONES SUPABASE-------------------------------------------------------------------

const flowprueba = addAnswer('Hola')

const flowPrincipal = addKeyword(['hola', 'ole', 'alo',"."])
    .addAnswer('🙌 Hola bienvenido a *Kigo | Parkimovil*')
    .addAnswer('Ingresa el folio de tu boleto 🎫:', {capture: true}, async (ctx, {gotoFlow}) => {
        console.log('ctx', ctx) 
        let userToLookUp = ctx.from
        let ticket = ctx.body 

        verifyUser(userToLookUp).then((data) => {
            if(data.length > 0){
                console.log('Usuario encontrado')

                verifyTicket(ticket).then((data) => {
                    if(data.length > 0){
                        console.log('Ticket encontrado')
                    }else{
                        console.log('Ticket no encontrado')
                    }
                })

            }
            else{
                console.log('Usuario no encontrado')
                return flowprueba
                
            }
        })


    })




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
