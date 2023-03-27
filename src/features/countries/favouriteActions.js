export const setFavourites = (favourites) => {
  return (dispatch, getState) => {
    dispatch({ type: "SET_FAVOURITES", favourites });
  };
};
