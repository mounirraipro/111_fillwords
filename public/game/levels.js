export const CATEGORIES = [
  {
    slug: 'animals',
    name: 'Animals',
    color: '#0ea5e9', // slate blue
    img: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=400&auto=format&fit=crop',
    levels: [
      { id: 1, title: 'Pets', cols: 4, rows: 4, difficulty: 'Easy', words: ['CAT', 'DOG', 'BIRD', 'FISH'] },
      { id: 2, title: 'Farm', cols: 5, rows: 5, difficulty: 'Medium', words: ['COW', 'PIG', 'HORSE', 'SHEEP', 'GOAT'] },
      { id: 3, title: 'Jungle', cols: 6, rows: 6, difficulty: 'Hard', words: ['TIGER', 'LION', 'MONKEY', 'SNAKE', 'BEAR'] },
      { id: 4, title: 'Ocean', cols: 7, rows: 7, difficulty: 'Master', words: ['SHARK', 'WHALE', 'DOLPHIN', 'TURTLE', 'SQUID'] },
      { id: 5, title: 'Birds', cols: 6, rows: 6, difficulty: 'Hard', words: ['EAGLE', 'HAWK', 'OWL', 'DOVE', 'CROW'] }
    ]
  },
  {
    slug: 'nature',
    name: 'Nature',
    color: '#10b981', // emerald green
    img: 'https://images.unsplash.com/photo-1506744626753-1fa44df31c78?q=80&w=400&auto=format&fit=crop',
    levels: [
      { id: 6, title: 'Plants', cols: 4, rows: 4, difficulty: 'Easy', words: ['TREE', 'LEAF', 'MOSS', 'BUSH'] },
      { id: 7, title: 'Weather', cols: 5, rows: 5, difficulty: 'Medium', words: ['RAIN', 'SNOW', 'CLOULD', 'WIND', 'SUN'] },
      { id: 8, title: 'Terrain', cols: 6, rows: 6, difficulty: 'Hard', words: ['HILL', 'RIVER', 'VALLEY', 'LAKE', 'ROCK'] },
      { id: 9, title: 'Space', cols: 7, rows: 7, difficulty: 'Master', words: ['STAR', 'MOON', 'COMET', 'PLANET', 'ORBIT'] },
      { id: 10, title: 'Elements', cols: 5, rows: 5, difficulty: 'Medium', words: ['FIRE', 'WATER', 'EARTH', 'AIR', 'DIRT'] }
    ]
  },
  {
    slug: 'food',
    name: 'Food',
    color: '#f59e0b', // amber
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop',
    levels: [
      { id: 11, title: 'Fruits', cols: 5, rows: 5, difficulty: 'Easy', words: ['APPLE', 'PEACH', 'PLUM', 'PEAR', 'FIG'] },
      { id: 12, title: 'Veggies', cols: 6, rows: 6, difficulty: 'Medium', words: ['CARROT', 'ONION', 'CORN', 'PEAS', 'BEAN'] },
      { id: 13, title: 'Desserts', cols: 6, rows: 6, difficulty: 'Hard', words: ['CAKE', 'PIE', 'CANDY', 'FUDGE', 'TART'] },
      { id: 14, title: 'Meals', cols: 7, rows: 7, difficulty: 'Master', words: ['PIZZA', 'PASTA', 'TACO', 'SUSHI', 'SOUP'] },
      { id: 15, title: 'Drinks', cols: 5, rows: 5, difficulty: 'Medium', words: ['TEA', 'MILK', 'SODA', 'JUICE', 'WINE'] }
    ]
  }
];
