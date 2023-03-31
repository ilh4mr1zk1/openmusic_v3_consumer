class Listener {

  constructor(playlistsService, mailSender) {

    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);

  }
 
  async listen(message) {

    try {

      const { owner, playlistId, targetEmail } = JSON.parse(message.content.toString());

      let playlist = await this._playlistsService.getPlaylists(owner);
      
      const getdatasong = await this._playlistsService.getPlaylistsongById(playlistId)

      playlist.songs = getdatasong

      const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify({playlist : playlist}));
      console.log(result);

    } catch (error) {

      console.error(error);

    }

  }


}

module.exports = Listener;