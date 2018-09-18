const { Client } = require("pg-then");

const client = new Client({
  database: "web_psql", // env PG_DB
  username: "postgres", // env PG_USER
  password: "postgres", // env PG_PASS
  host: "localhost" // env PG_HOST
});

const musicdb = require("./musicdb")(client);

musicdb
  .findArtist(process.argv[2])
  .then(artist => {
    console.log("Found artist!");
    console.log(`${artist.name}, Album Count: ${artist.album_count}`);
  })
  .catch(err => {
    console.log(err);
    client.end();
    return process.exit(1);
  });

musicdb
  .findTracksByArtist(process.argv[2])
  .then(albums => {
    for (let albumTitle in albums) {
      console.log("Album: ", albumTitle);
      const tracks = albums[albumTitle];

      tracks.forEach(t => console.log(`  ${t.number}: ${t.title}`));
    }
  })
  .catch(err => {
    console.log(err);
  });

setTimeout(() => client.end(), 2000);
