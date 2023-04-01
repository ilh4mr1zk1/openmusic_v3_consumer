const { Pool } = require('pg');
 
class PlaylistService {

  constructor() {
    this._pool = new Pool();
  }

  async getPlaylists(playlistId) {

    const query = {
      text: `SELECT playlists.id, playlists.name FROM playlists
      LEFT JOIN playlistsongs ON playlistsongs.playlist_id = playlists.id
      WHERE playlists.id = $1 OR playlistsongs.playlist_id = $1
      GROUP BY playlists.id`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];

  }

  async getPlaylistsongById(id){

    const query = {
      text: `SELECT 
      song.id, song.title, song.performer
      FROM song
      left join playlistsongs
      on song.id = playlistsongs.song_id
      left join playlists
      on playlists.id = playlistsongs.playlist_id
      WHERE playlistsongs.playlist_id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows;

  }

  async verifyPlaylistOwners(id, owner) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("playlistId atau userId tidak ditemukan. Pastikan Id tersebut Valid");
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }

  }

}

module.exports = PlaylistService;