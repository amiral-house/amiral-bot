const SpotifyWebApi = require('spotify-web-api-node');
const request = require('request');
import * as dotenv from "dotenv";

dotenv.config();

export interface spotifyResponse {
    body : {
        name: string,
        artists: [{
            name:string
        }],
        type: string
    }
}

export class spotifyApiClass {

    spotifyApi: any;
    error_codes = {
        NON_EXISTING_ID: 'Трек не найден(',
        INVALID_TYPE: 'Пока что могу искать только треки('
    };

    /**
    * Метод для получения полной инфы о треке из Spotify
    * @param    {String} trackId            айдишника трека из URL
    * @return   {Promise<spotifyResponse>}        
    */
     public async getTrackInfo(trackId : string) : Promise<spotifyResponse> {
        await this.prepareSpotifyAPI();
        let trackInfo : spotifyResponse;
        try {
            trackInfo = await this.spotifyApi.getTrack(trackId);
        } catch (error) {
            throw new Error(this.error_codes.NON_EXISTING_ID);
        }

        if (trackInfo.body.type != 'track') throw new Error(this.error_codes.INVALID_TYPE);
        
        return trackInfo;
    }

    /**
    * Авторизируемся и получаем токен для выполнения запросов до Spotify
    */
    private async prepareSpotifyAPI() {
        const accessToken = await this.getSpotifyAccessToken();

        this.spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri:process.env.SPOTIFY_REDIRECT_URI
        });

        this.spotifyApi.setAccessToken(accessToken);
    }

    private getSpotifyAccessToken() {
        const client_id = process.env.SPOTIFY_CLIENT_ID;
        const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            form: {
                grant_type: 'client_credentials'
            },
            json: true
        };

        return new Promise((resolve, reject) => {
            request.post(authOptions, (error:any, response:any, body:any) => {
                if (error) reject(error);
                if (response.statusCode != 200) {
                    reject('Invalid status code <' + response.statusCode + '>');
                }
                resolve(body.access_token);
            });
        });

    }
}