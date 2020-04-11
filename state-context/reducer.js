export const SET_SELECTED_CITY = "SET_SELECTED_CITY";
export const SET_SELECTED_DATASET = "SET_SELECTED_DATASET";
export const SET_SELECTED_LANGUAGE = "SET_SELECTED_LANGUAGE";

export const initialState = {
  selectedCity: null,
  selectedDataset: "ecuador",
  selectedLanguage: "es",
};

export function reducer(state, { type, payload }) {
  switch (type) {
    case SET_SELECTED_CITY:
      return { ...state, selectedCity: payload };
    case SET_SELECTED_DATASET:
      return { ...state, selectedDataset: payload };
    case SET_SELECTED_LANGUAGE:
      return { ...state, selectedLanguage: payload };
    default:
      return state;
  }
}
