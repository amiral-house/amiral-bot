import { spotifyApiClass, spotifyResponse } from "./APIs/spotify";

export class musicSevices {

    public async parseMusicMessage(messageText: string): Promise<string> {

        const domain = this.getDomain(messageText);

        switch (domain) {
            case 'spotify':
                const trackId = this.getSpotifyTrackId(messageText);

                if (!trackId) return 'Ошибка поиска Id трека';

                const searchQuery = await this.getTrackInfoFromSpotify(trackId);
                return searchQuery;
            case 'yandex':
                return 'Этот сервис пока не поддерживается';
            case 'apple':
                return 'Этот сервис пока не поддерживается';
            default:
                return 'Неподдерживаемый URL';
        }

    }

    /**
    * Получаем инфу о треке и генерим строку для поиска в других сервисах
    * @param    {String} trackId    Айди трека в spotify
    * @return   {String}         строка для поиска в других сервисах
    */
    public async getTrackInfoFromSpotify(trackId: string) {
        const spotifyApi = new spotifyApiClass();

        let trackInfo;
        try {
            trackInfo = await spotifyApi.getTrackInfo(trackId);
        } catch (error: any) {
            return error.message;
        }

        const searchQuery = this.parseSpotifyObject(trackInfo);
        return searchQuery;
    }

    private parseSpotifyObject(trackObject: spotifyResponse): string {
        const name = trackObject.body.name;
        const artists = trackObject.body.artists.map((artist) => artist.name).join(' ');

        return `${artists} ${name}`;
    }

    private getDomain(messageText: string) {
        const matchUrl = messageText.match(/^(?:[^:]+:\/\/)?([^.\/?#]+\.)*(?<domain>[^.\/?#]+)\.([^.\/?#]+)(?:$|[\/?#])/im);
        return matchUrl?.groups?.domain;
    }

    private getSpotifyTrackId(messageText: string) {
        //TODO: в ссылке можеть быть /album, помимо track
        const matchTrackId = messageText.match(/track\/(?<trackId>[\w]+)/im);
        return matchTrackId?.groups?.trackId;
    }

}