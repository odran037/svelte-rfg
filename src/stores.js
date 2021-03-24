import { writable } from 'svelte/store';

function createfavoritesList() {
  const { subscribe, set, update } = writable([]);

  const addFavorite = (newFav) => {
    return update(favs => {
      if (favs.includes(newFav)) {
        return favs;
      }

      let favsList = [...favs, newFav];

      localStorage.setItem('myFavoriteFacts', JSON.stringify(favsList));

      return favsList;

    });
  }

  const removeFavorite = (fav) => {
    return update(favs => {
      let favsList = favs.filter(currFav => currFav !== fav);

      localStorage.setItem('myFavoriteFacts', JSON.stringify(favsList));

      return favsList;
    });
  }

  const loadFavorites = () => {
    let favsList = JSON.parse(localStorage.getItem('myFavoriteFacts'));

    set(favsList || []);
  }

  return {
    subscribe,
    add: (newFav) => addFavorite(newFav),
    remove: (fav) => removeFavorite(fav),
    load: () => loadFavorites()
  };
}

export const favoritesList = createfavoritesList();