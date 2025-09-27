require('dotenv').config(); 
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Destination = require('../models/Destination');
const Product = require('../models/Product');
const Event = require('../models/Event');
const Homestay = require('../models/Homestay');

const sampleDestinations = [
  {
    name: "Ranchi Lake",
    location: "Ranchi",
    description: "Ranchi Lake, a man-made marvel in the heart of the city, offers tourists a tranquil escape from the bustling urban life. Built by a British agent in 1842, this historic lake is a central point of attraction and a beloved spot for both locals and visitors. You can enjoy a leisurely boat ride on its calm waters while taking in the scenic views of the surrounding hills. A prominent feature is the iconic statue of Swami Vivekananda situated on a small island in the middle of the lake, which is accessible via a well-maintained bridge. It's a perfect spot for families to enjoy a picnic, and the vibrant atmosphere around the lake is ideal for an evening stroll. With its blend of history, recreation, and natural beauty, Ranchi Lake serves as a refreshing and peaceful destination that every tourist should experience to understand the essence of the 'City of Waterfalls.'",
    image: "https://img.inextlive.com/inext/30102023/ranchi_lake.jpg",
    googleMaps360Url: "https://maps.app.goo.gl/8CjgJppaouTBfvnZA",
    tags: ["Ecotourism", "Heritage", "Scenic"],
    coordinates: { lat: 23.3700, lng: 85.3300 }
  },
  {
    name: "Dassam Falls",
    location: "Near Ranchi",
    description: "Dassam Falls, a breathtaking cascade on the Kanchi River, is one of Jharkhand's most spectacular natural wonders, located about 40 kilometers from Ranchi. The waterfall plunges from a height of approximately 144 feet, creating a mesmerizing spectacle of white water against a backdrop of lush green forests and rugged terrain. It is particularly magnificent during the monsoon and post-monsoon seasons, when the river is in full flow. The area surrounding the falls is a paradise for nature photographers and adventure enthusiasts. While swimming is possible in the pools below, it is essential to be cautious of the strong currents. The journey to the falls itself is scenic, passing through dense forests and small tribal villages, offering a glimpse into the local way of life. Visiting Dassam Falls is an exhilarating experience that combines natural beauty with a sense of adventure.",
    image: "https://greatindianjourney.wordpress.com/wp-content/uploads/2014/03/dasamfalls.jpg",
    googleMaps360Url: "https://maps.app.goo.gl/MfnQy7H5aRx7NZJS9",
    tags: ["Adventure", "Ecotourism", "Scenic"],
    coordinates: { lat: 23.2833, lng: 85.5167 }
  },
  {
    name: "Netarhat",
    location: "Latehar",
    description: "Known as the 'Queen of Chotanagpur,' Netarhat is a serene hill station offering a perfect retreat from the heat and chaos of city life. Situated in the Latehar district, it is famous for its stunning sunrises and sunsets, which draw tourists from all over the country. The plateau is covered with dense pine and sal forests, providing a refreshing and cool climate year-round. Visitors can explore the magnificent Magnolia Point, a famous spot for viewing the sunrise, and the nearby Koel View Point, which offers panoramic views of the Koel River. The serene atmosphere is ideal for long walks through the forest trails, and bird watchers will find a variety of exotic species. The local market offers a range of handicrafts made by the indigenous tribes of the region, providing a unique cultural experience. Netarhat is not just a destination; it is an experience of pure nature and tranquility.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Pine_trees_of_Netarhat_Hill_station.jpg/500px-Pine_trees_of_Netarhat_Hill_station.jpg",
    googleMaps360Url: "https://maps.app.goo.gl/pygXf2imvkheKQvG8",
    tags: ["Ecotourism", "Scenic", "Trek"],
    coordinates: { lat: 23.4667, lng: 84.2667 }
  },
  {
    name: "Betla National Park",
    location: "Palamu",
    description: "Betla National Park, a renowned tiger reserve in the Palamu district, is a haven for wildlife enthusiasts and nature lovers. Spanning over a vast area of lush green forests and grasslands, the park is home to a diverse range of flora and fauna, including elephants, tigers, leopards, wild boars, and a variety of deer species. The park's highlight is the jungle safari, which offers an unforgettable experience of spotting wildlife in their natural habitat. In addition to the wildlife, the park also has historical significance, as it houses the ancient Palamu Forts, built during the 16th and 17th centuries. These forts, nestled within the dense forest, provide a fascinating glimpse into the region's rich past. A visit to Betla is not just about wildlife; it's a journey into nature, history, and adventure, making it a must-visit destination for those seeking an immersive experience.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Entrance_of_Betla_national_park.jpg/500px-Entrance_of_Betla_national_park.jpg",
    googleMaps360Url: "https://maps.app.goo.gl/FRCZpAY8vyXAoVak6",
    tags: ["Ecotourism", "Heritage", "Adventure"],
    coordinates: { lat: 23.8500, lng: 84.2000 }
  },
  {
    name: "Hundru Falls",
    location: "Ranchi",
    description: "Hundru Falls, located on the Subarnarekha River near Ranchi, is one of the most famous and highest waterfalls in Jharkhand, with a dramatic drop of approximately 320 feet. The sheer force of the water crashing against the rocks below creates a powerful and majestic spectacle, especially during the monsoon season. The area around the falls is a perfect destination for adventure seekers and nature enthusiasts. The scenic beauty, with its rugged terrain and lush greenery, makes it an ideal spot for hiking and rock climbing. Visitors can also take a dip in the natural pools formed at the base of the falls, providing a refreshing and exhilarating experience. The Hundru Falls area is also popular for picnics, and the journey to the falls itself, through winding roads and scenic landscapes, is a memorable part of the trip. It’s an ideal spot for those looking for both relaxation and adventure.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Hundru_Falls%2C_Jharkhand%2C_India_4.jpg/500px-Hundru_Falls%2C_Jharkhand%2C_India_4.jpg",
    googleMaps360Url: "https://maps.app.goo.gl/3mSzygu5ng9oFb4LA",
    tags: ["Adventure", "Ecotourism", "Scenic"],
    coordinates: { lat: 23.4000, lng: 85.3667 }
  },
  {
    name: "Baidyanath Dham (Deoghar)",
    description: "Baidyanath Dham, located in Deoghar, is one of the most sacred Hindu pilgrimage sites in India, revered as one of the twelve Jyotirlingas of Lord Shiva. The temple complex is a center of faith and devotion, attracting millions of devotees every year, especially during the Shravan Mela, a month-long festival where pilgrims carry water from the Ganga River to offer to the deity. The main temple is an architectural marvel, with a unique blend of traditional and modern styles. The area surrounding the temple is a vibrant hub of religious activities, with a variety of shops selling religious artifacts, sweets, and local handicrafts. The town of Deoghar itself, with its serene atmosphere and spiritual significance, offers a peaceful and immersive experience for all visitors. Baidyanath Dham is a must-visit destination for those seeking a spiritual journey and a deep connection with India's rich cultural heritage.",
    location: "Deoghar",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Baba_Baidyanath_Jyotirlinga_Temple.jpg/500px-Baba_Baidyanath_Jyotirlinga_Temple.jpg",
    googleMaps360Url: "https://maps.app.goo.gl/PGnYJuuScwspDz6y5",
    tags: ["Culture", "Heritage"],
    coordinates: { lat: 24.4822, lng: 86.6990 },
  },
  {
    name: "Parasnath Hill (Shikharji)",
    description: "Parasnath Hill, also known as Shikharji, is the most sacred pilgrimage site for Jains and the highest hill in Jharkhand. Located in the Giridih district, it is believed to be the place where twenty of the twenty-four Jain Tirthankaras attained salvation. The climb to the main temple at the summit is a spiritual journey, with pilgrims walking barefoot up the hill, a journey that takes several hours. The path is lined with numerous small temples and shrines, each with its own story and significance. The summit offers breathtaking panoramic views of the surrounding hills and forests, making the spiritual journey also a rewarding scenic experience. The serene and peaceful atmosphere of the hill, combined with its religious importance, makes it a unique destination for both pilgrims and nature lovers. Parasnath Hill is a testament to faith, endurance, and the timeless beauty of nature.",
    location: "Giridih District",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Shikharji_Parasnath_Giridih.jpg/500px-Shikharji_Parasnath_Giridih.jpg",
    googleMaps360Url: "https://maps.app.goo.gl/SJ8Yuh5VKHsJ4kAn6",
    tags: ["Culture", "Trek"],
    coordinates: { lat: 23.9333, lng: 86.1500 }
  },
  {
    name: "Maluti Temples",
    description: "The Maluti Temples, a cluster of ancient terracotta temples, are a hidden gem of Jharkhand's rich heritage. Located in the Dumka district, this village is home to 72 temples dedicated to various deities, including Lord Shiva and Goddess Durga. The intricate carvings and terracotta work on the temple walls depict scenes from Hindu epics, providing a fascinating glimpse into the region's artistic and cultural past. The temples, dating back to the 17th and 18th centuries, are a testament to the skilled craftsmanship of the local artisans. The peaceful and serene atmosphere of the village, away from the bustling cities, offers a unique and immersive cultural experience. Maluti is a must-visit for history buffs, art lovers, and those seeking a deeper understanding of India's spiritual and artistic heritage. The temples are a living museum of the region's rich past, a silent reminder of a glorious era.",
    location: "Dumka District",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Some_clusters_of_temples_in_the_village_of_Maluti_at_Dumka_district_in_Jharkhand_State.jpg/500px-Some_clusters_of_temples_in_the_village_of_Maluti_at_Dumka_district_in_Jharkhand_State.jpg",
    tags: ["Culture", "Heritage"],
    coordinates: { lat: 24.0333, lng: 87.5333 }
  },
  {
    name: "Jonha Falls",
    description: "Jonha Falls, also known as Gautamdhara, is a beautiful waterfall located near Ranchi, offering a perfect blend of natural beauty and spiritual tranquility. The waterfall, located on the Radhu River, descends from a height of approximately 141 feet, creating a breathtaking spectacle. The falls are named after Lord Gautam, who is believed to have meditated here. A nearby temple dedicated to Lord Buddha adds to the spiritual aura of the place. The area around the falls is surrounded by lush green forests and is an ideal spot for picnics and day trips. The serene atmosphere, combined with the gentle sound of the cascading water, provides a sense of peace and relaxation. Jonha Falls is not just a scenic spot; it is a place of spiritual significance, making it a unique destination for both nature lovers and those seeking a spiritual retreat.",
    location: "Ranchi District",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Jonha_falls.jpg/500px-Jonha_falls.jpg",
    googleMaps360Url: "https://maps.app.goo.gl/HH4vW7FZ7K236fi69",
    tags: ["Ecotourism", "Culture", "Scenic"],
    coordinates: { lat: 23.4000, lng: 85.5833 }
  },
  {
    name: "Hirni Falls",
    location: "West Singhbhum",
    description: "Hirni Falls, a picturesque waterfall located deep within the forests of West Singhbhum, is a hidden gem of Jharkhand's natural beauty. The waterfall, located on the Kanchi River, cascades from a height of approximately 121 feet, creating a mesmerizing spectacle. The area around the falls is surrounded by dense forests, offering a sense of seclusion and tranquility. The lush greenery and rugged terrain make it an ideal spot for nature lovers and photographers. The journey to the falls itself is an adventure, passing through winding roads and scenic landscapes. Hirni Falls is a perfect destination for those seeking a peaceful retreat away from the city's chaos. It's a place where you can connect with nature, enjoy the serene atmosphere, and create lasting memories. It is a testament to the raw, untamed beauty of Jharkhand's natural landscape.",
    location: "West Singhbhum",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Jharkhand_Hirni_fall.jpg/500px-Jharkhand_Hirni_fall.jpg",
    googleMaps360Url: "https://maps.app.goo.gl/U4A8nm17hmcwpaxT7",
    tags: ["Ecotourism", "Scenic", "Adventure"],
     coordinates: { lat: 22.6667, lng: 85.3167 }
  },
  {
    name: "Dimna Lake",
    description: "Dimna Lake, an artificial lake located at the foothills of the Dalma Hills near Jamshedpur, is a popular recreational spot for both locals and tourists. The lake offers a variety of water sports, including boating, water skiing, and jet skiing, making it an ideal destination for adventure lovers. The serene and picturesque atmosphere, combined with the stunning views of the surrounding hills, makes it a perfect spot for picnics and day trips. The lake's clear waters and the surrounding lush greenery provide a sense of peace and relaxation. A nearby park, with its well-maintained gardens and children's play area, adds to the appeal of the place. Dimna Lake is a perfect destination for families, couples, and friends looking for a fun-filled day out. It's a testament to how human ingenuity can blend with nature to create a beautiful and functional space.",
    location: "Jamshedpur",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Dimna_Lake%2C_Jamshedpur.jpg/500px-Dimna_Lake%2C_Jamshedpur.jpg",
    googleMaps360Url: "https://maps.app.goo.gl/dQLpSNZZnG2MYq4n8",
    tags: ["Adventure", "Ecotourism", "Scenic"],
     coordinates: { lat: 22.8333, lng: 86.2667 }
  },
  {
    name: "Dalma Wildlife Sanctuary",
    description: "Dalma Wildlife Sanctuary, located near Jamshedpur, is a popular destination for nature lovers and wildlife enthusiasts. Spanning over a vast area of dense forests and rugged hills, the sanctuary is a haven for a diverse range of flora and fauna, including elephants, tigers, leopards, wild boars, and a variety of bird species. The sanctuary's highlight is the jungle safari, which offers an unforgettable experience of spotting wildlife in their natural habitat. In addition to the wildlife, the sanctuary also offers a variety of trekking and hiking trails, providing a sense of adventure for those who love to explore. The serene atmosphere, combined with the stunning views of the surrounding hills, makes it a perfect spot for a peaceful retreat. Dalma is not just a wildlife sanctuary; it is a journey into nature, adventure, and tranquility.",
    location: "East Singhbhum",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Wild_Abode.jpg/500px-Wild_Abode.jpg",
    googleMaps360Url: "https://maps.app.goo.gl/QQLBM4Aq3kHzNVkX6",
    tags: ["Ecotourism", "Adventure", "Trek"],
    coordinates: { lat: 22.9000, lng: 86.1333 }
  },
  {
    name: "Jagannath Temple, Ranchi",
    description: "The Jagannath Temple in Ranchi, a 17th-century architectural marvel, is a significant Hindu pilgrimage site. The temple, dedicated to Lord Jagannath, is famous for its annual Rath Yatra festival, which attracts thousands of devotees from all over the state. The temple's architecture, a unique blend of traditional and modern styles, is a sight to behold. The serene and peaceful atmosphere of the temple, combined with its religious significance, provides a sense of peace and relaxation. The temple is located on a small hill, offering panoramic views of the surrounding city. A visit to the Jagannath Temple is not just a spiritual journey; it is an experience of a rich cultural heritage. The temple's intricate carvings and sculptures, depicting scenes from Hindu epics, are a testament to the skilled craftsmanship of the local artisans.",
    location: "Ranchi",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/17th_century_Jagannath_temple_Ranchi_Jharkhand_-_9.jpg/500px-17th_century_Jagannath_temple_Ranchi_Jharkhand_-_9.jpg",
    googleMaps360Url: "https://maps.app.goo.gl/gcKkeSh3mzVrrVAu9",
    tags: ["Culture", "Heritage", "Scenic"],
    coordinates: { lat: 23.3436, lng: 85.3094 }

  },
  {
    name: "Pahari Mandir, Ranchi",
    description: "Pahari Mandir, a hilltop temple dedicated to Lord Shiva, offers panoramic views of the entire city of Ranchi. The temple, located on a small hill, is a significant pilgrimage site for both locals and tourists. The serene and peaceful atmosphere of the temple, combined with its stunning views, provides a sense of peace and relaxation. The temple is believed to have been built by the Britishers, and it has a unique blend of traditional and modern architectural styles. A visit to the Pahari Mandir is not just a spiritual journey; it is also a rewarding scenic experience. The climb to the top of the hill, though a bit challenging, is well worth it for the breathtaking views and the sense of accomplishment. It's a perfect spot for a peaceful retreat away from the city's chaos.",
    location: "Ranchi",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Pahari_Mandir_-_Ranchi_Hill_9243.JPG/500px-Pahari_Mandir_-_Ranchi_Hill_9243.JPG",
    googleMaps360Url: "https://maps.app.goo.gl/MgqzRKWGz6jAmqaM8",
    tags: ["Culture", "Heritage", "Scenic"],
    coordinates: { lat: 23.3550, lng: 85.3350 }
  },
  {
    name: "Rajrappa Temple",
    description: "Rajrappa Temple, a famous Shakti Peeth dedicated to Goddess Chhinnamasta, is a significant Hindu pilgrimage site located at the confluence of the Damodar and Bhairavi rivers. The temple, with its unique architecture and spiritual significance, attracts thousands of devotees every year. The main temple is an architectural marvel, with a unique blend of traditional and modern styles. The area surrounding the temple is a vibrant hub of religious activities, with a variety of shops selling religious artifacts, sweets, and local handicrafts. The confluence of the two rivers, with its serene and picturesque atmosphere, provides a sense of peace and relaxation. A visit to the Rajrappa Temple is not just a spiritual journey; it is also an experience of a rich cultural heritage. The temple's intricate carvings and sculptures, depicting scenes from Hindu epics, are a testament to the skilled craftsmanship of the local artisans.",
    location: "Ramgarh District",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Maa_Chhinnamasta_Temple.jpg/500px-Maa_Chhinnamasta_Temple.jpg",
    googleMaps360Url: "https://maps.app.goo.gl/aNxAB2CFr79hvBqeA",
    tags: ["Culture", "Heritage", "Scenic"],
    coordinates: { lat: 23.6333, lng: 85.5167 }
  },
  {
    name: "Sita Falls",
    description: "Sita Falls, a scenic waterfall located on the Radhu river near Ranchi, is a hidden gem of Jharkhand's natural beauty. The waterfall, with its gentle cascade and serene atmosphere, provides a sense of peace and relaxation. The area around the falls is surrounded by lush green forests, offering a sense of seclusion and tranquility. The journey to the falls itself is a scenic adventure, passing through winding roads and lush landscapes. Sita Falls is a perfect destination for those seeking a peaceful retreat away from the city's chaos. It's a place where you can connect with nature, enjoy the serene atmosphere, and create lasting memories. It is a testament to the raw, untamed beauty of Jharkhand's natural landscape. A nearby temple dedicated to Lord Buddha adds to the spiritual aura of the place, making it a unique destination for both nature lovers and those seeking a spiritual retreat.",
    location: "Ranchi District",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Sita_falls_054.jpg/500px-Sita_falls_054.jpg",
    googleMaps360Url: "https://maps.app.goo.gl/sjdR8mzWLsoDiWcJ9",
    tags: ["Ecotourism", "Scenic", "Adventure"],
    coordinates: { lat: 23.2833, lng: 85.5667 }
  }
];

const sampleProducts = [
  {
    name: "Dokra Figurine",
    category: "Handicraft",
    description: "Traditional bell metal craft from Jharkhand.",
    price: 1200,
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Village_lady_grinding_ants_for_her_family.jpg/330px-Village_lady_grinding_ants_for_her_family.jpg"],
    seller: { name: "Tribal Artisan", phone: "9876543210", location: "Ranchi" },
    tags: ["handicraft", "tribal"]
  },
  {
    name: "Lac Bangles",
    category: "Jewellery",
    description: "Colorful bangles made of natural lac.",
    price: 600,
    images: ["https://gaatha.org/wp-content/uploads/design_1-22.jpg"],
    seller: { name: "Local Bazaar", phone: "9988776655", location: "Jamshedpur" },
    tags: ["jewellery", "lac"]
  },
  {
    name: "Paitkar Scroll Painting",
    category: "Art",
    description: "Traditional scroll painting depicting folklore from Amadubi village.",
    price: 2500,
    images: ["https://4.imimg.com/data4/FQ/IL/ANDROID-24292142/product.jpeg"],
    seller: { name: "Amadubi Artisan Collective", phone: "9123456789", location: "Dhalbhumgarh" },
    tags: ["painting", "paitkar", "folk art"]
  },
  {
    name: "Handwoven Bamboo Basket",
    category: "Home Decor",
    description: "A durable and eco-friendly basket, perfect for storage or decoration.",
    price: 750,
    images: ["https://5.imimg.com/data5/SELLER/Default/2025/9/547147669/OH/CI/JQ/134676161/handwoven-round-bamboo-basket-500x500.jpg"],
    seller: { name: "Jharkhand Bamboo Crafts", phone: "9234567890", location: "Khunti" },
    tags: ["bamboo", "handicraft", "eco-friendly"]
  },
  {
    name: "Sohrai Art on Canvas",
    category: "Art",
    description: "Vibrant Sohrai painting featuring traditional motifs of nature and fertility.",
    price: 1800,
    images: ["https://m.media-amazon.com/images/I/91FiDw8RzCL.jpg"],
    seller: { name: "Hazaribagh Women Artists", phone: "9345678901", location: "Hazaribagh" },
    tags: ["painting", "sohrai", "tribal art"]
  },
  {
    name: "Terracotta Elephant Statue",
    category: "Handicraft",
    description: "A decorative terracotta elephant symbolizing strength and good fortune.",
    price: 900,
    images: ["https://m.media-amazon.com/images/I/71UMNbaKONL._UF1000,1000_QL80_.jpg"],
    seller: { name: "Ranchi Pottery House", phone: "9456789012", location: "Ranchi" },
    tags: ["terracotta", "pottery", "decor"]
  }
];

const getFutureDate = (months, days = 0) => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    date.setDate(date.getDate() + days);
    return date;
};

const sampleEvents = [
  {
    title: "Karma Festival",
    description: "A tribal festival celebrated with dance and music for a good harvest.",
    startDate: getFutureDate(2), // Event is ~2 months from now
    endDate: getFutureDate(2, 1),   // Event lasts for 2 days
    location: "Across Jharkhand",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Karam_puja_in_jharkhand.jpg/375px-Karam_puja_in_jharkhand.jpg",
    type: "Cultural",
    coordinates: { lat: 23.344, lng: 85.309 }
  },
  {
    title: "Tusu Mela",
    description: "Celebrated during the harvest season, vibrant with fairs and community feasts.",
    startDate: getFutureDate(4), // Event is ~4 months from now
    endDate: getFutureDate(4, 2),   // Event lasts for 3 days
    location: "Chandil, Jharkhand",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Royal_Peacock_Barge_LACMA_M.82.154.jpg/500px-Royal_Peacock_Barge_LACMA_M.82.154.jpg",
    type: "Fair",
    coordinates: { lat: 22.999, lng: 86.035 }
  },
  {
    title: "Sarhul Spring Festival",
    description: "The largest tribal festival in Jharkhand, celebrating the bloom of new flowers.",
    startDate: getFutureDate(6), // Event is ~6 months from now
    endDate: getFutureDate(6, 2),   // Event lasts for 3 days
    location: "Ranchi and Tribal Villages",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Holy_Prayer.jpg/1200px-Holy_Prayer.jpg",
    type: "Cultural",
    coordinates: { lat: 23.3441, lng: 85.3096 }
  },
  {
    title: "Shravani Mela, Deoghar",
    description: "A month-long pilgrimage where millions of devotees offer holy water at Baidyanath Temple.",
    startDate: getFutureDate(10), // Event is ~10 months from now
    endDate: getFutureDate(11),     // Event lasts for a full month
    location: "Deoghar",
    image: "https://ddnews.gov.in/wp-content/uploads/2025/07/shravani-mela-deoghar.jpeg",
    type: "Pilgrimage",
    coordinates: { lat: 24.4822, lng: 86.6990 }
  },
  {
    title: "Bandna Parab (Sohrai)",
    description: "A week-long festival celebrating cattle and livestock with folk music and intricate Sohrai art.",
    startDate: getFutureDate(1), // Event is ~1 month from now
    endDate: getFutureDate(1, 6),   // Event lasts for 7 days
    location: "Santhal Pargana Region",
    image: "https://www.jagranimages.com/images/newimg/25112020/25_11_2020-25khunti_21099065.jpg",
    type: "Cultural",
    coordinates: { lat: 24.2700, lng: 87.2500 }
  }
];

const sampleHomestays = [
  {
    name: "Netarhat Sunrise Homestay",
    location: "Netarhat",
    description: "Cozy stay with amazing sunrise views and local cuisine.",
    pricePerNight: 1500,
    amenities: ["WiFi", "Parking", "Breakfast included"],
    images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB76m7xJIdfnlKh2TPmJKXY4BM2uHnagGt7A&s"],
    host: { name: "Ramesh Oraon", phone: "9876541230", email: "ramesh@homestay.com" },
    coordinates: { lat: 23.4667, lng: 84.2667 }
  },
  {
    name: "Betla Jungle Lodge",
    location: "Betla National Park",
    description: "Stay amidst wildlife with guided safari tours.",
    pricePerNight: 2000,
    amenities: ["Safari", "Campfire", "Local food"],
    images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYnx1JfC__CIQXGMxwVr52pF_epjL79qPn8w&s"],
    host: { name: "Sunita Devi", phone: "9123456780", email: "sunita@jungle.com" },
    coordinates: { lat: 23.8500, lng: 84.2000 }
  },
  {
    name: "Pilgrim's Rest Deoghar",
    location: "Deoghar",
    description: "A peaceful and clean stay just a short walk from the Baidyanath Temple complex.",
    pricePerNight: 1200,
    amenities: ["Air Conditioning", "Hot Water", "Vegetarian Meals", "Puja Arrangements"],
    images: ["https://pix10.agoda.net/hotelImages/59602039/0/0ee68b0ddf7279435777359628a9469a.jpg?ce=2&s=702x392"],
    host: { name: "Manoj Tiwari", phone: "9456789012", email: "manoj.deoghar@stay.com" },
    coordinates: { lat: 24.4822, lng: 86.6990 }
  },
  {
    name: "Ranchi Waterfall Retreat",
    location: "Near Hundru Falls, Ranchi",
    description: "An eco-friendly cottage with stunning views of the hills, close to Hundru and Jonha falls.",
    pricePerNight: 2500,
    amenities: ["Nature Trail", "Organic Farm Food", "Free Parking", "Bonfire"],
    images: ["https://media.easemytrip.com/media/Hotel/SHL-19021513178446/Common/Commonwi4Ntr.jpg"],
    host: { name: "Priya Singh", phone: "9567890123", email: "priya.retreat@stay.com" },
    coordinates: { lat: 23.4445, lng: 85.6592 }
  },
  {
    name: "Shikharji Hill View Homestay",
    location: "Parasnath Hills, Madhuban",
    description: "Comfortable stay for pilgrims and trekkers at the base of Parasnath Hills. Jain food on request.",
    pricePerNight: 1800,
    amenities: ["Attached Bathroom", "Filtered Water", "Luggage Storage", "Jain Meals"],
    images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBbn4sqN6kxy1pk5Ep2p8XxZMAWOOlCovaHA&s"],
    host: { name: "Sanjay Jain", phone: "9678901234", email: "sanjay.jain@stay.com" },
    coordinates: { lat: 24.0625, lng: 86.1364 }
  }
];

// ---- Seed Runner ---- //
(async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    // Destinations
    await Destination.deleteMany({});
    await Destination.insertMany(sampleDestinations);

    // Products
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);

    // Events
    await Event.deleteMany({});
    await Event.insertMany(sampleEvents);

    // Homestays
    await Homestay.deleteMany({});
    await Homestay.insertMany(sampleHomestays);

    console.log("✅ Database seeded with Destinations, Products, Events & Homestays!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
})();