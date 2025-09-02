// Import movie service để lấy dữ liệu từ API
import { getPopularMovies, getTopRatedMovies, transformMovieData, getImageUrl } from '../services/movieService';

// Dữ liệu phim mẫu (fallback khi API không hoạt động)
export const fallbackHotMovies = [
  {
    id: 1,
    title: "Avatar: The Way of Water",
    year: 2022,
    rating: 4.5,
    badge: "HOT",
    genre: "Sci-Fi, Adventure",
    description: "Set more than a decade after the events of the first film, Avatar: The Way of Water begins to tell the story of the Sully family."
  },
  {
    id: 2,
    title: "Top Gun: Maverick",
    year: 2022,
    rating: 4.7,
    badge: "HOT",
    genre: "Action, Drama",
    description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past."
  },
  {
    id: 3,
    title: "Black Panther: Wakanda Forever",
    year: 2022,
    rating: 4.3,
    badge: "HOT",
    genre: "Action, Adventure",
    description: "The nation of Wakanda is pitted against intervening world powers as they mourn the loss of their king T'Challa."
  },
  {
    id: 4,
    title: "Spider-Man: No Way Home",
    year: 2021,
    rating: 4.6,
    badge: "HOT",
    genre: "Action, Adventure",
    description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes arrive."
  },
  {
    id: 5,
    title: "Dune",
    year: 2021,
    rating: 4.4,
    badge: "HOT",
    genre: "Sci-Fi, Adventure",
    description: "Feature adaptation of Frank Herbert's science fiction novel about the son of a noble family entrusted with the protection of a valuable planet."
  },
  {
    id: 6,
    title: "The Batman",
    year: 2022,
    rating: 4.2,
    badge: "HOT",
    genre: "Action, Crime",
    description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption."
  }
];

export const fallbackNominatedMovies = [
  {
    id: 7,
    title: "Everything Everywhere All at Once",
    year: 2022,
    rating: 4.8,
    badge: "AWARD",
    genre: "Action, Adventure, Comedy",
    description: "A Chinese-American laundromat owner is swept up in an insane adventure in which she alone can save the multiverse."
  },
  {
    id: 8,
    title: "The Banshees of Inisherin",
    year: 2022,
    rating: 4.6,
    badge: "AWARD",
    genre: "Comedy, Drama",
    description: "Two lifelong friends find themselves at an impasse when one abruptly ends their relationship, with alarming consequences for both of them."
  },
  {
    id: 9,
    title: "All Quiet on the Western Front",
    year: 2022,
    rating: 4.5,
    badge: "AWARD",
    genre: "Drama, War",
    description: "A young German soldier's terrifying experiences and distress on the western front during World War I."
  },
  {
    id: 10,
    title: "The Fabelmans",
    year: 2022,
    rating: 4.4,
    badge: "AWARD",
    genre: "Drama",
    description: "Growing up in post-World War II era Arizona, young Sammy Fabelman aspires to become a filmmaker as he reaches adolescence."
  },
  {
    id: 11,
    title: "Tár",
    year: 2022,
    rating: 4.3,
    badge: "AWARD",
    genre: "Drama, Music",
    description: "Set in the international world of Western classical music, the film centers on Lydia Tár, widely considered one of the greatest living composer-conductors."
  },
  {
    id: 12,
    title: "Women Talking",
    year: 2022,
    rating: 4.2,
    badge: "AWARD",
    genre: "Drama",
    description: "Do nothing, stay and fight, or leave. In 2010, the women of an isolated religious community grapple with reconciling their reality with their faith."
  }
];

// Hàm lấy dữ liệu phim hot từ API
export const fetchHotMovies = async () => {
  try {
    const response = await getPopularMovies(1);
    const movies = response.results.slice(0, 6).map(transformMovieData);
    return movies;
  } catch (error) {
    console.error('Error fetching hot movies:', error);
    return fallbackHotMovies;
  }
};

// Hàm lấy dữ liệu phim đề cử từ API
export const fetchNominatedMovies = async () => {
  try {
    const response = await getTopRatedMovies(1);
    const movies = response.results.slice(0, 6).map(transformMovieData);
    return movies;
  } catch (error) {
    console.error('Error fetching nominated movies:', error);
    return fallbackNominatedMovies;
  }
};
