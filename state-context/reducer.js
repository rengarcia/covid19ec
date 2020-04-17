export const SET_QUERY = "SET_QUERY";
export const SET_SELECTED_PROVINCE = "SET_SELECTED_CITY";
export const SET_SELECTED_DATASET = "SET_SELECTED_DATASET";
export const SET_SELECTED_LANGUAGE = "SET_SELECTED_LANGUAGE";

export const initialState = {
  query: "",
  selectedProvince: null,
  selectedDataset: "ecuador",
  selectedLanguage: "es",
};

export function reducer(state, { type, payload }) {
  switch (type) {
    case SET_QUERY:
      return { ...state, query: payload };
    case SET_SELECTED_PROVINCE:
      return { ...state, selectedProvince: payload, query: "" };
    case SET_SELECTED_DATASET:
      return { ...state, selectedDataset: payload };
    case SET_SELECTED_LANGUAGE:
      return { ...state, selectedLanguage: payload };
    default:
      return state;
  }
}
