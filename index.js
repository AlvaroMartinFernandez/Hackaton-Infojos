const express = require('express');
const querystring = require('querystring');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, ChatCompletionRequestMessageRoleEnum, OpenAIApi } = require('openai');


const tokenOpenAi = "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";
const clientId = 'c074f55b73994e589ac6c98e217f6f56';
const clientSecret = 'DIw91+7XMUdpu1/HeUHhwLn798X9rqRS9iyWhyLusFAB4Axfdp';
const redirectUri = 'https://hackaton-infojobs-alvaro.vercel.app//callback'; //https://6fef-2800-440-1a00-1b00-4063-d78-8f2c-33ec.ngrok-free.app/callback URL de redireccionamiento que hayas configurado en InfoJobs Developer
const tokenBasic = "YzA3NGY1NWI3Mzk5NGU1ODlhYzZjOThlMjE3ZjZmNTY6REl3OTErN1hNVWRwdTEvSGVVSGh3TG43OThYOXJxUlM5aXlXaHlMdXNGQUI0QXhmZHA=";
let tokenBear = "fb909b4a-d269-41d1-b086-07771075af6a";


const configuration = new Configuration({ apiKey: tokenOpenAi });
const openai = new OpenAIApi(configuration);



let CVID = "";
let education;
let experience;
let skill;
let personalData;
let futureJob;
let ofertas;
let allOffers;
let offersOpenai = [];
let selectionID;


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

// Ruta inicial que redirige al usuario a la página de autenticación de InfoJobs
app.get('/', (req, res) => {
    const params = {
        scope: 'CV,MY_APPLICATIONS,CANDIDATE_READ_CURRICULUM_CVTEXT,CANDIDATE_READ_CURRICULUM_EDUCATION,CANDIDATE_READ_CURRICULUM_EXPERIENCE,CANDIDATE_READ_CURRICULUM_SKILLS,CANDIDATE_READ_CURRICULUM_PERSONAL_DATA,CANDIDATE_READ_CURRICULUM_FUTURE_JOB',
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        state: 'random_state_value', // Puedes generar un valor aleatorio para proteger contra CSRF
    };

    const authorizationUrl = `https://www.infojobs.net/api/oauth/user-authorize/index.xhtml?${querystring.stringify(params)}`;
    res.redirect(authorizationUrl);
});

// Ruta de callback para recibir el código de autorización y solicitar el token de acceso
app.get('/callback', async (req, res) => {
    const { code } = req.query;
    console.log(code + "Llegamos al punto 1");
    // Intercambio del código de autorización por un token de acceso
    const tokenParams = {
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
    };

    try {

        const response = await fetch('https://www.infojobs.net/oauth/authorize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: querystring.stringify(tokenParams),
        });

        const tokenResponse = await response.json();

        console.log(tokenResponse);

        // Aquí puedes almacenar el token de acceso en tu base de datos o en algún otro lugar
        const accessToken = tokenResponse.access_token;
        console.log('Token de acceso:', accessToken);
        tokenBear = accessToken;

        res.redirect('/CV');


    } catch (error) {
        console.error('Error al solicitar el token de acceso:', error.message);
        res.status(500).send('Error al solicitar el token de acceso.');
    }

});
app.get('/CV', async (req, res) => {
    console.log(tokenBasic);
    console.log(tokenBear);
    try {

        const response = await fetch('https://api.infojobs.net/api/2/curriculum', {
            method: 'GET',
            headers: {
                Authorization: `Basic ${tokenBasic}, Bearer ${tokenBear}`,

            },
        });

        const data = await response.json();
        console.log(data);

        CVID = data[0].code;
        console.log(CVID);
        res.redirect('/CVValidation');

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error en la solicitud' });
    }
});

app.get('/CVValidation', async (req, res) => {
    console.log(tokenBasic);
    console.log(tokenBear);
    try {

        const response = await fetch(`https://api.infojobs.net/api/1/curriculum/${CVID}/education`, {
            method: 'GET',
            headers: {
                Authorization: `Basic ${tokenBasic}, Bearer ${tokenBear}`,

            },
        });

        education = await response.json();
        console.log(education);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error en la solicitud' });
    }

    try {

        const response = await fetch(`https://api.infojobs.net/api/2/curriculum/${CVID}/experience`, {
            method: 'GET',
            headers: {
                Authorization: `Basic ${tokenBasic}, Bearer ${tokenBear}`,

            },
        });

        experience = await response.json();
        console.log(experience);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error en la solicitud' });
    }

    try {

        const response = await fetch(`https://api.infojobs.net/api/2/curriculum/${CVID}/skill`, {
            method: 'GET',
            headers: {
                Authorization: `Basic ${tokenBasic}, Bearer ${tokenBear}`,

            },
        });

        skill = await response.json();
        console.log(skill);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error en la solicitud' });
    }

    try {

        const response = await fetch(`https://api.infojobs.net/api/2/curriculum/${CVID}/personaldata`, {
            method: 'GET',
            headers: {
                Authorization: `Basic ${tokenBasic}, Bearer ${tokenBear}`,

            },
        });

        personalData = await response.json();
        console.log(personalData);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error en la solicitud' });
    }

    try {

        const response = await fetch(`https://api.infojobs.net/api/4/curriculum/${CVID}/futurejob`, {
            method: 'GET',
            headers: {
                Authorization: `Basic ${tokenBasic}, Bearer ${tokenBear}`,

            },
        });

        futureJob = await response.json();
        console.log(futureJob);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error en la solicitud' });
    }
    try {

        const response = await fetch(`https://api.infojobs.net/api/1/dictionary/teleworking`, {
            method: 'GET',
            headers: {
                Authorization: `Basic ${tokenBasic}`,

            },
        });

        const dictionary = await response.json();
        console.log(dictionary);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error en la solicitud' });
    }


    try {

        const subcategory = futureJob.subcategories.map((element, index) => {
            if (index > 0) {
                return `&subcategory=${element}`
            }
            else {
                return `?subcategory=${element}`
            }
        });
        const params = subcategory.join('').concat('');

        const response = await fetch(`https://api.infojobs.net/api/7/offer${params}&maxResults=50`, {
            method: 'GET',
            headers: {
                Authorization: `Basic ${tokenBasic}`,

            },
        });

        ofertas = await response.json();
        allOffers = ofertas.offers;

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error en la solicitud' });
    }

    for (let i = 2; i < ofertas.totalPages; i++) {
        try {
            const subcategory = futureJob.subcategories.map((element, index) => {
                if (index > 0) {
                    return `&subcategory=${element}`
                }
                else {
                    return `?subcategory=${element}`
                }
            });
            const params = subcategory.join('').concat('');
            const response = await fetch(`https://api.infojobs.net/api/7/offer${params}&maxResults=50&page=${i}`, {
                method: 'GET',
                headers: {
                    Authorization: `Basic ${tokenBasic}`,

                },
            });
            let offersPage = await response.json();
            allOffers = allOffers.concat(offersPage.offers);
        }
        catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Error en la solicitud' });
        }
    }

    console.log(`Tenemos un total de:${allOffers.length} en la subcategorias que preferimos.`);
    const provinceSearch = personalData.province[0].toUpperCase() + personalData.province.slice(1);
    const offersFilter = allOffers.filter(element => element.province.value === provinceSearch/*|| element.teleworking.id===2*/);//LA BUSQUEDA DE OFERTAS NO DEVUELVE TELEWORKING ESTA MAL CORREO MANDADO A INFOJOBS
    const offersID = offersFilter.map(element => {
        return element.id;
    })
    console.log(`Tenemos un total de:${offersID.length} en la la provincia donde vivimos.`);

    offersOpenai = [];
    for (let i = 0; i < 5; i++) //hacemos solo 100 para evitar tener sobre costes
    {

        try {

            const response = await fetch(`https://api.infojobs.net/api/7/offer/${offersID[i]}`, {
                method: 'GET',
                headers: {
                    Authorization: `Basic ${tokenBasic}`,

                },
            });

            let offersDetails = await response.json();
            let { title, id, experienceMin, studiesMin, minRequirements, description, hasKillerQuestions, hasOpenQuestions, skillsList } = offersDetails;
            aux = { title, id, experienceMin, studiesMin, minRequirements, description, hasKillerQuestions, hasOpenQuestions, skillsList };
            let auxQuestion = [];
            if (aux.hasKillerQuestions > 0 || aux.hasOpenQuestions > 0) {
                try {

                    const response = await fetch(`https://api.infojobs.net/api/1/offer/${offersID[i]}/question`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Basic ${tokenBasic}`,

                        },
                    });

                    auxQuestion = await response.json();
                    aux = Object.assign({}, aux, auxQuestion);
                    //    console.log(aux);
                } catch (error) {
                    console.error('Error:', error);
                    res.status(500).json({ error: 'Error en la solicitud' });
                }
            }
            offersOpenai.push(aux);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Error en la solicitud' });
        }

    }

        setTimeout(function() {
        console.log("1 minute has passed.");
        res.redirect('/CHATGPT');
      }, 61000);
});
app.get('/CHATGPT', async (req, res) => {


    const INITIAL_MESSAGES = [
        {
            role: ChatCompletionRequestMessageRoleEnum.System,
            content: `Te voy a mandar un listado de ofertas de trabajo en dos formatos  json uno con preguntas que tendra un formato como este: {
            title: 'Ingeniero Software Junior C/++',
            id: 'd08907530c4ef0b53e79dd70f64df5',
            experienceMin: { id: 6, value: 'Al menos 2 años' },
            studiesMin: { id: 125, value: 'Grado' },
            minRequirements: '',
            description: 'En Krell Consulting estamos buscando un Ingeniero de Desarrollo Software C/++ en entornos Linux / VxWorks con experiencia de 2 años.\r\n' +
              '\r\n' +
              '\r\n' +
              'TITULACION: Titulado universitario en alguna de estas carreras (por orden de preferencia), con conocimientos de desarrollo software : \r\n' +
              '\r\n' +
              '1 - Informática \r\n' +
              '\r\n' +
              '2 - Telecomunicaciones (Telemática) \r\n' +
              '\r\n' +
              '3 - Telecomunicaciones (Otras especialidades)\r\n' +
              '\r\n' +
              '\r\n' +
              'Modalidad hibrida: 60% presencial y 40 remoto.\r\n' +
              '\r\n' +
              'SBA 30.000€\r\n' +
              '\r\n' +
              '\r\n' +
              '¡Te estamos esperando! Inscríbete y da un salto en tu carrera!',
            hasKillerQuestions: 1,
            hasOpenQuestions: 1,
            skillsList: [
              { skill: 'VxWorks' },
              { skill: 'C' },
              { skill: 'Linux' },
              { skill: 'Software' },
              { skill: 'Informatica' },
              { skill: 'Telecomunicaciones' }
            ],
            openQuestions: [
              {
                id: 48173887926,
                question: 'Indicamos experiencia en puestos similares con en las tecnologías requeridas'
              },
              {
                id: 48173887930,
                question: '¿Cuáles son tus expectativas salariales (en euros brutos/año)?'
              },
              { id: 48173887932, question: 'Tu plazo de incorporación es de:' }
            ],
            killerQuestions: [
              {
                id: 48173887918,
                question: '¿Tienes titulación universitaria en Informática o telecomuinicaciones?',
                answers: [Array]
              }
            ]
          } donde las killerQuestions tendra una serie de respuestas donde tendremos que elegir una respuesta por cada killerQuestion  y las openQuestion tendran una respuesta abierta de como maximo 100 caracteres que responderemos en funcion de los datos de mi perfil, es posible que la oferta solo tenga killerQuestion o openQuention. el otro formato  no tendra preguntas y sera el siguiente  {
            title: 'Ingeniero Software Junior C/++',
            id: 'd08907530c4ef0b53e79dd70f64df5',
            experienceMin: { id: 6, value: 'Al menos 2 años' },
            studiesMin: { id: 125, value: 'Grado' },
            minRequirements: '',
            description: 'En Krell Consulting estamos buscando un Ingeniero de Desarrollo Software C/++ en entornos Linux / VxWorks con experiencia de 2 años.\r\n' +
              '\r\n' +
              '\r\n' +
              'TITULACION: Titulado universitario en alguna de estas carreras (por orden de preferencia), con conocimientos de desarrollo software : \r\n' +
              '\r\n' +
              '1 - Informática \r\n' +
              '\r\n' +
              '2 - Telecomunicaciones (Telemática) \r\n' +
              '\r\n' +
              '3 - Telecomunicaciones (Otras especialidades)\r\n' +
              '\r\n' +
              '\r\n' +
              'Modalidad hibrida: 60% presencial y 40 remoto.\r\n' +
              '\r\n' +
              'SBA 30.000€\r\n' +
              '\r\n' +
              '\r\n' +
              '¡Te estamos esperando! Inscríbete y da un salto en tu carrera!',
            hasKillerQuestions: 1,
            hasOpenQuestions: 1,
            skillsList: [
              { skill: 'VxWorks' },
              { skill: 'C' },
              { skill: 'Linux' },
              { skill: 'Software' },
              { skill: 'Informatica' },
              { skill: 'Telecomunicaciones' }
            ]
          } la informacion de mi perfil esta representada en bloque mi educacion que esta representada en formato JSON de la siguiente manera ${JSON.stringify(education)}, mi experencia que esta representada en formato JSON de la siguiente manera${JSON.stringify(experience)} 
          , mis habilidades tecnicas y nivel de idiomas que estan representada en formato JSON de la siguiente manera ${JSON.stringify(skill)}. Sabiendo ya como es mi perfil cual es mi educacion experencia y habilidades,cuando mande un listado de ofertas deberas seleccionar las 2 ofertas mas compatibles con mi perfil
          y responderme solamente con la id de dicha oferta e formato JSON por ejemplo {"ids":["sasafafs211243141","sdfalkfsaflk223"]}`
        }
    ];

    console.log("paso 1 ok")
    console.log(INITIAL_MESSAGES);
    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        messages: [
            ...INITIAL_MESSAGES

        ]
    });
    const completion2 = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        messages: [
            {
                role: ChatCompletionRequestMessageRoleEnum.System,
                content: `te voy a mandar las ofertas de una en una en formatoJSON, cuando te mande 5 recuerda elegir las dos mas compatibles con mi perfil:${JSON.stringify(offersOpenai[0])}`
            },
            {
                role: ChatCompletionRequestMessageRoleEnum.System,
                content: `:${JSON.stringify(offersOpenai[1])}`
            },
            {
                role: ChatCompletionRequestMessageRoleEnum.System,
                content: `:${JSON.stringify(offersOpenai[2])}`
            }

        ]
    });
    const completion3 = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        messages: [
            {
                role: ChatCompletionRequestMessageRoleEnum.System,
                content: `:${JSON.stringify(offersOpenai[3])}`
            },
            {
                role: ChatCompletionRequestMessageRoleEnum.System,
                content: `:${JSON.stringify(offersOpenai[4])}`
            },
            {
                role: ChatCompletionRequestMessageRoleEnum.User,
                content: `Sabiendo ya como es mi perfil cual es mi educacion experencia y habilidadeS Y cual es el listado de ofertas deberas seleccionar las 2 ofertas mas compatibles con mi perfil
            y responderme solamente con la id de dicha oferta e formato JSON, es decir la respuesta tendra que ser asi sin ninguna descripcion ni explicacion solamente como en el siguiente ejemplo:
            
            {"ids":["idprimeraofertaselecccionada","idsegundaofertaseleccionada"]}`
            }

        ],
        max_tokens: 80
    });

    data = completion3.data.choices[0].message?.content ?? '';
    selectionID=JSON.parse(data);
    console.log(selectionID);
    setTimeout(function() {
        console.log("1 minute has passed.");
        res.redirect('/OFERTASSELECCIONADAS');
      }, 61000);
    

});

app.get('/OFERTASSELECCIONADAS', async (req, res) => {
    console.log("entramos en el primer punto de la inscripcion")
    const offers = offersOpenai.filter(element => element.id === selectionID.ids[0] || element.id === selectionID.ids[1]);
    let bodypost = {
        "curriculumCode": CVID,
        "coverLetter": {}
    };
    console.log(bodypost);
    for (let i = 0; i < offers.length; i++) {;
        console.log(offers[i]);
        if (offers.hasKillerQuestions === 0 && offers.hasOpenQuestions === 0) {
            console.log("Oferta sin questions");
            try {

                const response = await fetch(`https://api.infojobs.net/api/4/offer/${offers.id}/application`, {
                    method: 'POST',
                    body: JSON.stringify(bodypost),
                    headers: {
                        Authorization: `Basic ${tokenBasic}, Bearer ${tokenBear}`,

                    }
                    
                });
                let solicitud = await response.json();
                console.log(solicitud);
            }
            catch (error) {
                console.error('Error:', error);
                res.status(500).json({ error: 'Error en la solicitud' });
            }
        }
        else
        {
            console.log("Oferta con questions");
            const completion = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                temperature: 0,
                messages: [
                    {
                        role: ChatCompletionRequestMessageRoleEnum.System,
                        content: `En funcion de mi perfil que te he mandado anteriormente utilizando mi experencia mis datos academicos y mis habilidades tecnicas responderemos a las Open Question y las Killer Question de la siguiente forma y en FormatoJSON: {
                            "curriculumCode":${JSON.stringify(CVID)},
                            "coverLetter":{},
                            "offerOpenQuestions":[
                              {
                                "id": 2391697190,
                                "answer": "Si, vivo en Barcelona."
                              }
                            ],
                            "offerKillerQuestions":[
                              {
                                "id": 2391697192,
                                "answerId":2391697196
                              },
                              {
                                "id": 239169712,
                                "answerId":2391697169
                              }
                            ]
                          }`
                    },
                    {
                        role: ChatCompletionRequestMessageRoleEnum.System,
                        content: `Donde los campos curriculumCode y coverLetter seran siempre los mismos, donde el answer dentro de la offerOpenQuestion sera una respuesta que des en funcion de mi perfil maximo 100 caracteres
                    y donde en en las offerKillerQuestions elegiremos las answerID que  mas se ajusten a nuestro perfil.`
                    },
                    {
                        role: ChatCompletionRequestMessageRoleEnum.System,
                        content: `LA OFERTA SERA LA SIGUIENTE:${JSON.stringify(offers[i])}`
                    }
                    ,
                    {
                        role: ChatCompletionRequestMessageRoleEnum.User,
                        content: `Dame respuesta en Formato JSON tal y como te he pedido sin explicaciones ni comentarios, solo manda el formato JSON por ejemplo:
                        "curriculumCode":"113546sadsfa66",
                            "coverLetter":{},
                            "offerOpenQuestions":[
                              {
                                "id": 2391697190,
                                "answer": "Si, vivo en Barcelona."
                              }
                            ],
                            "offerKillerQuestions":[
                              {
                                "id": 2391697192,
                                "answerId":2391697196
                              },
                              {
                                "id": 239169712,
                                "answerId":2391697169
                              }
                            ]
                          } recuerda que es posible que tengamos varias offerOpenQuestions o ninguna OpenQuestions  por lo tanto la respuesta tendria que ser asi "offerOpenQuestions":[],al igual que podemos tener varias killerQuestion o ninguna en caso de no tener ninguna lo responderiamos asi offerOpenQuestions":[] 
                          
                          Esto es muy importante: si en la oferta tenemos hasOpenQuestions: 0, responderemos con sin poner el campo "offerOpenQuestions" y si en la oferta tenemos hasKillerQuestions:0, respondereos sin poner el offerKillerQuestions[] en la respuesta.` 
                    }
        
                ]
            });
            offerQuestion = completion.data.choices[0].message?.content ?? '';
            offerQuestion=JSON.parse(offerQuestion);
            console.log(offerQuestion);
            try {

                const response = await fetch(`https://api.infojobs.net/api/4/offer/${offers.id}/application`, {
                    method: 'POST',
                    body: JSON.stringify(offerQuestion),
                    headers: {
                        Authorization: `Basic ${tokenBasic}, Bearer ${tokenBear}`,

                    }
                    
                });
                let solicitud = await response.json();
                console.log(solicitud);
            }
            catch (error) {
                console.error('Error:', error);S
                res.status(500).json({ error: 'Error en la solicitud' });
            } 
        }
    }
res.send(`Hemos preseleccionado e incrito las ofertas ${JSON.stringify(offers[0])} y ${JSON.stringify(offers[1])}`)
});



// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor en ejecución en http://localhost:3000');
});
