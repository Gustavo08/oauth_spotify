const { default: axios } = require('axios');
const querystring = require('node:querystring');

const REDIRECT_URI = "http://localhost:3008/api/callback";
const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_ME_ENDPOINT = "https://api.spotify.com/v1/me";

const encode = ( str ) => {
    return Buffer.from(str).toString("base64url");
}

const dashboard = ( req, res ) => {
    res.render('dashboard');
}


const mainPage = ( req, res) => {
    res.render('index');
}

const loginSpotify = ( req, res ) => {
    const scopes = [
        "user-read-private",
        "user-read-email"
    ];

    const query = querystring.stringify({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope: scopes.join(" "),
        redirect_uri: REDIRECT_URI
    });

    res.redirect(`${ SPOTIFY_AUTH_URL }?${ query }`);
}


const callbackSpotify = async ( req, res ) => {
    const clientAuth = encode(`${ process.env.CLIENT_ID }:${ process.env.CLIENT_SECRET}`);

    const body = querystring.stringify({
        code: req.query.code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code"
    });

    const options = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${ clientAuth }`
        }
    };

    try {
        const response = await axios.post( SPOTIFY_TOKEN_URL, body, options);
        console.log("🚀 ~ file: index.js:53 ~ callbackSpotify ~ response:", response.data.access_token); // accedemos al token
        // que intercambiamos por el code que recibimos al iniciar sesion con spotify.(req.query.code)

        const respo = await axios.get(SPOTIFY_ME_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${ response.data.access_token }`,
                "Content-Type": "application/json"
            }
        });

        let { data } = respo;

        console.log(data);

        res.render("dashboard", { display_name: data.display_name, email: data.email });
        
    } catch ( err ) {
        console.log(err);
    }
}

/*
    Ya esta autorizada la aplicacion y ya no sera necesario aceptarlo, solo con iniciar sesion
    y obtendremos los datos.

*/

module.exports = {
    mainPage,
    loginSpotify,
    callbackSpotify,
    dashboard
}