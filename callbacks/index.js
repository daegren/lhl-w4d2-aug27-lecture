const { Client } = require("pg");

const client = new Client({
  database: "web_psql", // env PG_DB
  username: "postgres", // env PG_USER
  password: "postgres", // env PG_PASS
  host: "localhost" // env PG_HOST
});

client.connect((err, conn) => {
  if (err) {
    console.error("Unable to connect to db:", err);
    return process.exit(1);
  }

  // Use the db connection here

  const musicDb = require("./musicdb")(conn);

  musicDb.findArtist(process.argv[2], (err, artist) => {
    if (err) {
      console.error(err);
      conn.end();
      return process.exit(1);
    }

    console.log("Found artist!");
    console.log(`${artist.name}, Album Count: ${artist.album_count}`);
  });

  musicDb.findTracksByArtist(process.argv[2], (err, albums) => {
    if (err) {
      console.error(err);
      conn.end();
      return process.exit(1);
    }

    for (let albumTitle in albums) {
      console.log("Album: ", albumTitle);
      const tracks = albums[albumTitle];

      tracks.forEach(t => console.log(`  ${t.number}: ${t.title}`));
    }

    conn.end();
  });

  // conn.query("SELECT name FROM artists;", (err, res) => {
  //   if (err) {
  //     console.error(err);
  //     conn.end();
  //     return process.exit(1);
  //   }
  //
  //   console.log("===== ARTISTS =====");
  //
  //   res.rows.forEach(artist => {
  //     console.log(artist.name);
  //   });
  //
  //   conn.end();
  // });
});
