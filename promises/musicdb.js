module.exports = db => ({
  findArtist: artist => {
    const query = `SELECT art.name, count(alb.id) AS album_count
    FROM artists art, albums alb
    WHERE alb.artist_id = art.id
    AND art.name ILIKE $1::text
    GROUP BY art.name
    LIMIT 1;`;

    return db.query(query, [`%${artist}%`]).then(res => res.rows[0]);
  },

  findTracksByArtist: artist => {
    const query = `SELECT t.number, t.title AS track_title, a.title AS album_title
      FROM artists, albums a, tracks t
      WHERE a.artist_id = artists.id
      AND t.album_id = a.id
      AND artists.name ILIKE $1::text
      ORDER BY a.title, t.number;`;

    return db
      .query(query, [`%${artist}%`])
      .then(res => processAlbums(res.rows));
  }
});

// Converts our database results to an object where the keys are the album titles
const processAlbums = albums =>
  albums.reduce((albums, row) => {
    const albumTitle = row.album_title;
    const track = {
      number: row.number,
      title: row.track_title
    };

    if (albums[albumTitle]) {
      albums[albumTitle].push(track);
    } else {
      albums[albumTitle] = [track];
    }

    return albums;
  }, {});
