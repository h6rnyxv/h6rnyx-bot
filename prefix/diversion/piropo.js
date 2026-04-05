const piropos = [
  '¿Estás hecha de azúcar? Porque tienes una dulzura única.',
  'Si la belleza fuera tiempo, tú serías la eternidad.',
  '¿Tienes un mapa? Porque me perdí en tus ojos.',
  '¿Eres el sol? Porque iluminas mi día.',
  'Tu sonrisa podría iluminar la ciudad entera.',
  'Si fueras una estrella, serías la más brillante del universo.',
];

export default {
  nombre: 'piropo',
  async ejecutar({ message }) {
    const user = message.mentions.users.first() || message.author;
    const piropo = piropos[Math.floor(Math.random() * piropos.length)];
    message.channel.send(`💐 ${user} — *${piropo}*`);
  },
};
