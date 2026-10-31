/** Curated photos from Figma source 339:244; two frames removed at user request. */
export const hotelPhotos = [
  {
    name: "Lemala",
    file: "lemala",
    node: "339:247",
    alt: "Лодж Lemala под раскидистым деревом",
  },
  {
    name: "Meliá",
    file: "melia",
    node: "339:248",
    alt: "Причал и океан у отеля Meliá",
  },
  {
    name: "",
    file: "pool-giraffe",
    node: "333:212",
    alt: "Бассейн с видом на жирафа",
  },
  {
    name: "AndBeyond Serengeti Under Canvas",
    file: "under-canvas",
    node: "I91:313;92:317",
    alt: "Вид из палаточного лоджа на саванну",
  },
  {
    name: "Serval Wildlife",
    file: "serval",
    node: "I91:301;91:298",
    alt: "Жираф и зебра у лоджа Serval Wildlife",
  },
  {
    name: "AndBeyond Mnemba Island",
    file: "mnemba",
    node: "I91:309;92:313",
    alt: "Пляж и терраса AndBeyond Mnemba Island",
  },
  {
    name: "Ngorongoro Lodge",
    file: "ngorongoro",
    node: "I91:321;92:317",
    alt: "Терраса Ngorongoro Lodge с видом на кратер",
  },
  {
    name: "Four Seasons Serengeti",
    file: "four-seasons-serengeti",
    node: "I91:317;92:317",
    alt: "Бассейн и шезлонги Four Seasons Serengeti",
  },
].map((photo) => ({
  ...photo,
  src: `/assets/hotels/${photo.file}.webp`,
  dimensions: (
    {
      melia: [921, 1200],
      mnemba: [1280, 682],
      andbeyond: [920, 1200],
      "four-seasons-serengeti": [1280, 721],
      ngorongoro: [1280, 853],
      lemala: [960, 1200],
      serval: [1680, 1176],
      "four-seasons": [921, 1200],
      "under-canvas": [1280, 663],
      "pool-giraffe": [2080, 854],
    } as Record<string, number[]>
  )[photo.file],
}));
