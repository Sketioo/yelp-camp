const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
  console.log("Database is connected!");
}

const pickSample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i <= 45; i++) {
    const random1000 = Math.floor(Math.random() * 30);
    const randPrice = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '64e09426c17358c29bf037de',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${pickSample(descriptors)}, ${pickSample(places)}`,
      price: randPrice,
      geometry: { type: 'Point', coordinates: [ cities[random1000].longitude, cities[random1000].latitude ] },
      images: [
        {
          url: 'https://res.cloudinary.com/do2bxvcyt/image/upload/v1694262569/YelpCamp/l4hjcnlpsyr0mkmg9pz7.jpg',
          filename: 'YelpCamp/l4hjcnlpsyr0mkmg9pz7',
        },
        {
          url: 'https://res.cloudinary.com/do2bxvcyt/image/upload/v1694263355/YelpCamp/mmgu3wyzhdwoyte5v4rg.jpg',
          filename: 'YelpCamp/mmgu3wyzhdwoyte5v4rg',
        }
      ],
      description: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo dolorum 
      vel incidunt asperiores sequi quidem, explicabo nihil amet hic eos? Lorem ipsum dolor sit 
      amet consectetur adipisicing elit. Repellat ipsa sit natus laboriosam sunt? Voluptatibus adipisci minus molestias id cupiditate`,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
