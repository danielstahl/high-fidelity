
class Actions {
  static getIdToken(user) {
    return user.firebaseUser.getIdToken(false);
  }

  static fetchInit(token) {
    return {
      method: 'GET',
      headers: {
        'X-user-token': token
      }
    };
  }

  static fetchGenres(user, setGraph) {
    Actions.getIdToken(user)
    .then((token) => {
      fetch('http://localhost:8080/genres', Actions.fetchInit(token))
      .then((genresResult) => {
        return genresResult.json();
      })
      .then((genresResultJson) => {
        setGraph(genresResultJson);
      });
    });
  }

  static fetchGenreGraph(user, genreSlug, setGraph) {
    Actions.getIdToken(user)
    .then((token) => {
      fetch('http://localhost:8080/genres/' + genreSlug, Actions.fetchInit(token))
      .then((genreGraphResult) => {
        return genreGraphResult.json();
      })
      .then((genreGraphJson) => {
        setGraph(genreGraphJson);
      });
    });
  }

  static fetchEraGraph(user, eraSlug, setGraph) {
    Actions.getIdToken(user)
    .then((token) => {
      fetch('http://localhost:8080/eras/' + eraSlug, Actions.fetchInit(token))
      .then((eraGraphResult) => {
        return eraGraphResult.json();
      })
      .then((eraGraphJson) => {
        setGraph(eraGraphJson);
      });
    });
  }

  static fetchArtistGraph(user, artistSlug, setGraph) {
    Actions.getIdToken(user)
    .then((token) => {
      fetch('http://localhost:8080/artists/' + artistSlug, Actions.fetchInit(token))
      .then((artistGraphResult) => {
        return artistGraphResult.json();
      })
      .then((artistGraphJson) => {
        setGraph(artistGraphJson);
      });
    });
  }
}

export default Actions;
