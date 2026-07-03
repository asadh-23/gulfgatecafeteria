export interface MenuItem {
  id: string;
  name: string;
  short_description: string;
  full_description: string;
  price: number;
  category: 'shawarma' | 'broasted' | 'burgers' | 'juices' | 'appetizers' | 'desserts';
  image: string;
  isPopular?: boolean;
  isSpicy?: boolean;
}

export const menuItems: MenuItem[] = [
  // Shawarma
  {
    id: '1',
    name: 'Classic Chicken Shawarma',
    short_description: 'Tender marinated chicken with garlic sauce and pickles',
    full_description: 'Succulent chicken breast marinated in authentic Middle Eastern spices, slow-roasted to perfection. Wrapped in fresh saj bread with creamy garlic sauce, crisp pickles, and fresh vegetables. A timeless favorite that captures the essence of traditional Arabic street food.',
    price: 12,
    category: 'shawarma',
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&q=80',
    isPopular: true,
  },
  {
    id: '2',
    name: 'Beef Shawarma Supreme',
    short_description: 'Premium beef with tahini and grilled vegetables',
    full_description: 'Premium cuts of beef marinated in our secret blend of spices, expertly grilled and layered with tahini sauce, grilled onions, tomatoes, and fresh parsley. Each bite delivers a perfect balance of smoky, savory flavors that will transport you to the streets of Beirut.',
    price: 15,
    category: 'shawarma',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80',
    isSpicy: true,
  },
  {
    id: '3',
    name: 'Mixed Shawarma Platter',
    short_description: 'Combination of chicken and beef with rice and salad',
    full_description: 'The best of both worlds! A generous platter featuring both our signature chicken and beef shawarma, served alongside fragrant basmati rice, fresh Arabic salad, hummus, and your choice of garlic or tahini sauce. Perfect for sharing or for those who can\'t decide!',
    price: 22,
    category: 'shawarma',
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80',
    isPopular: true,
  },

  // Broasted Chicken
  {
    id: '4',
    name: 'Full Broasted Chicken',
    short_description: 'Whole chicken, crispy outside, juicy inside',
    full_description: 'A whole chicken marinated in our signature blend of herbs and spices, pressure-fried to achieve the perfect golden-brown exterior while maintaining incredible juiciness inside. Served with garlic sauce, coleslaw, and warm Arabic bread. A family favorite that never disappoints!',
    price: 35,
    category: 'broasted',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80',
    isPopular: true,
  },
  {
    id: '5',
    name: 'Half Broasted Chicken',
    short_description: 'Perfect portion with fries and coleslaw',
    full_description: 'Half of our famous broasted chicken, featuring the same incredible flavor and texture as our full chicken. Served with crispy golden fries, creamy coleslaw, and your choice of dipping sauces. Ideal for those seeking a hearty meal without the commitment to a full bird.',
    price: 20,
    category: 'broasted',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80',
  },
  {
    id: '6',
    name: 'Spicy Broasted Wings',
    short_description: '8 pieces of fiery, crispy chicken wings',
    full_description: 'Eight pieces of our premium chicken wings, marinated in a fiery blend of red chili, garlic, and secret spices, then broasted to crispy perfection. Served with cooling ranch dip and celery sticks. Warning: These wings pack serious heat and are seriously addictive!',
    price: 18,
    category: 'broasted',
    image: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=800&q=80',
    isSpicy: true,
  },

  // Burgers
  {
    id: '7',
    name: 'Gulfgate Special Burger',
    short_description: 'Double beef patty with cheese and special sauce',
    full_description: 'Our signature creation! Two 100% pure beef patties grilled to perfection, topped with melted cheddar cheese, crispy beef bacon, fresh lettuce, tomatoes, pickles, and our secret Gulfgate sauce. All nestled in a toasted brioche bun. This is not just a burger—it\'s an experience.',
    price: 18,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    isPopular: true,
  },
  {
    id: '8',
    name: 'Crispy Chicken Burger',
    short_description: 'Fried chicken breast with garlic mayo',
    full_description: 'Tender chicken breast coated in our signature seasoned breading and fried to golden perfection. Topped with fresh iceberg lettuce, juicy tomatoes, and our house-made garlic mayo. Served in a soft brioche bun with a side of crispy fries. Simple, classic, and absolutely delicious.',
    price: 14,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80',
  },
  {
    id: '9',
    name: 'BBQ Bacon Burger',
    short_description: 'Smoky BBQ sauce with crispy bacon and onion rings',
    full_description: 'A beef lover\'s dream! Premium beef patty glazed with our tangy BBQ sauce, topped with crispy beef bacon strips, crunchy onion rings, melted cheese, and fresh vegetables. The combination of smoky, sweet, and savory flavors creates a burger experience you won\'t forget.',
    price: 16,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80',
  },

  // Fresh Juices
  {
    id: '10',
    name: 'Fresh Mango Juice',
    short_description: 'Pure mango goodness, no added sugar',
    full_description: 'Made from the ripest, sweetest mangoes sourced fresh daily. We blend only pure mango pulp with just a touch of ice to create a naturally sweet, velvety smooth juice that captures the tropical essence of this beloved fruit. No added sugars, no preservatives—just pure, unadulterated mango perfection.',
    price: 8,
    category: 'juices',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80',
    isPopular: true,
  },
  {
    id: '11',
    name: 'Strawberry Lemonade',
    short_description: 'Refreshing blend of strawberries and fresh lemon',
    full_description: 'A perfect harmony of sweet and tangy! Fresh strawberries blended with freshly squeezed lemons, a hint of mint, and just the right amount of natural sweetness. Served ice-cold, this refreshing beverage is the perfect companion to our savory dishes and a favorite on hot UAE afternoons.',
    price: 9,
    category: 'juices',
    image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80',
  },
  {
    id: '12',
    name: 'Tropical Paradise Mix',
    short_description: 'Exotic blend of pineapple, passion fruit, and coconut',
    full_description: 'Escape to a tropical paradise with every sip! This exotic blend combines sweet pineapple, tangy passion fruit, and creamy coconut milk, creating a luxurious, multi-layered flavor experience. Garnished with fresh mint and served in a chilled glass. It\'s like a vacation in a cup!',
    price: 10,
    category: 'juices',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=800&q=80',
  },

  // Appetizers
  {
    id: '13',
    name: 'Hummus Supreme',
    short_description: 'Creamy chickpea dip with tahini and olive oil',
    full_description: 'Our signature hummus made fresh daily from premium chickpeas, blended with tahini, fresh lemon juice, and garlic until silky smooth. Topped with a generous drizzle of extra virgin olive oil and served with warm pita bread. A Middle Eastern classic that\'s both comforting and nutritious.',
    price: 7,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1571318323824-e8dcf9ab7568?w=800&q=80',
    isPopular: true,
  },
  {
    id: '14',
    name: 'Loaded Cheese Fries',
    short_description: 'Crispy fries topped with melted cheese and beef',
    full_description: 'Golden, crispy French fries loaded with a generous amount of melted cheddar and mozzarella cheese, topped with seasoned ground beef, jalapeños, spring onions, and drizzled with our special sauce. This indulgent appetizer is perfect for sharing... or not!',
    price: 12,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1630431341973-02e1ca5becb2?w=800&q=80',
  },
  {
    id: '15',
    name: 'Crispy Falafel Plate',
    short_description: '6 pieces with tahini and fresh vegetables',
    full_description: 'Six perfectly crispy falafel made from ground chickpeas, fresh herbs, and aromatic spices. Served with tahini sauce, fresh tomatoes, cucumbers, pickles, and warm pita bread. These golden-brown gems are crispy on the outside and tender on the inside—a vegetarian delight!',
    price: 10,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1593001874117-4b96b6ae1d06?w=800&q=80',
  },

  // Desserts
  {
    id: '16',
    name: 'Kunafa Special',
    short_description: 'Traditional Middle Eastern sweet with cheese and syrup',
    full_description: 'A beloved Middle Eastern dessert featuring layers of crispy shredded phyllo dough filled with sweet cheese, baked until golden, and soaked in fragrant sugar syrup infused with rose water and orange blossom. Topped with crushed pistachios. Served warm for an authentic experience.',
    price: 14,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1586030277851-caffa1a79d82?w=800&q=80',
    isPopular: true,
  },
  {
    id: '17',
    name: 'Chocolate Lava Cake',
    short_description: 'Warm chocolate cake with molten center',
    full_description: 'Decadent chocolate cake with a gooey, molten chocolate center that flows out with every spoonful. Baked to order and served warm with a scoop of vanilla ice cream and a drizzle of chocolate sauce. A chocolate lover\'s dream come true!',
    price: 12,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80',
  },
  {
    id: '18',
    name: 'Baklava Assortment',
    short_description: 'Selection of premium baklava with nuts and honey',
    full_description: 'An exquisite selection of handmade baklava featuring layers of paper-thin phyllo pastry filled with a mixture of walnuts, pistachios, and almonds, baked to golden perfection and soaked in aromatic honey syrup. Each piece is a work of art. Comes with 6 assorted pieces.',
    price: 15,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=800&q=80',
  },
];

export const categories = [
  { id: 'all', name: 'All Items', icon: '🍽️' },
  { id: 'shawarma', name: 'Shawarma', icon: '🌯' },
  { id: 'broasted', name: 'Broasted Chicken', icon: '🍗' },
  { id: 'burgers', name: 'Burgers', icon: '🍔' },
  { id: 'juices', name: 'Fresh Juices', icon: '🥤' },
  { id: 'appetizers', name: 'Appetizers', icon: '🥙' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
];
