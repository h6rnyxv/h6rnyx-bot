const memes = [
  'https://i.imgur.com/6RL2U8y.jpeg',
  'https://i.imgur.com/KNu8fUT.jpeg',
  'https://i.imgur.com/njOyEGL.jpeg',
  'https://i.imgur.com/VJwOmOS.jpeg',
  'https://i.imgur.com/ZD60TUl.jpeg',
];

export default {
  nombre: 'meme',
  async ejecutar({ message }) {
    const meme = memes[Math.floor(Math.random() * memes.length)];
    message.channel.send({ files: [meme] });
  },
};
