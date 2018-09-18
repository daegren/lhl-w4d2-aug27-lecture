module.exports = db => ({
  findArtist: (artist, callback) => {
    const query = `SELECT art.name, count(alb.id) AS album_count
    FROM artists art, albums alb
    WHERE alb.artist_id = art.id
    AND art.name ILIKE $1::text
    GROUP BY art.name
    LIMIT 1;`;

    db.query(query, [`%${artist}%`], (err, res) => {
      if (err) {
        return callback(err);
      }

      callback(null, res.rows[0]);
    });
  },

  findTracksByArtist: (artist, callback) => {
    const query = `SELECT t.number, t.title AS track_title, a.title AS album_title
      FROM artists, albums a, tracks t
      WHERE a.artist_id = artists.id
      AND t.album_id = a.id
      AND artists.name ILIKE $1::text
      ORDER BY a.title, t.number;`;

    db.query(query, [`%${artist}%`], (err, res) => {
      if (err) {
        return callback(err);
      }

      const albums = res.rows.reduce((albums, row) => {
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

      callback(null, albums);
    });
  }
});
