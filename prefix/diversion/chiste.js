const chistes = [
  '¿Qué hace una abeja en el gimnasio? ¡Zum-ba!',
  '¿Qué le dice un gusano a otro gusano? Voy a dar una vuelta a la manzana.',
  '¿Qué hace un pez? ¡Nada!',
  '¿Qué le dice una cebolla a otra? Nos vemos en la sartén.',
  '¿Cómo se llama el hermano vegano de Bruce Lee? Broco Lee.',
  '¿Qué le dice una impresora a otra? ¿Esa hoja es tuya o es impresión mía?',
  '¿Qué pasa si tiras un pato al agua? Nada.',
  '¿Qué hace una vaca en un terremoto? Leche agitada.',
];

export default {
  nombre: 'chiste',
  async ejecutar({ message }) {
    const chiste = chistes[Math.floor(Math.random() * chistes.length)];
    message.channel.send(`😄 ${chiste}`);
  },
};
