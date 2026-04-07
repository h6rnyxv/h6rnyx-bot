const respuestas = [
  'Sí', 'No', 'Tal vez', 'Claro que sí', 'Por supuesto',
  'Ni lo sueñes', 'No cuentes con ello', 'Quizás más tarde',
  'Definitivamente sí', 'Definitivamente no', 'Pregunta de nuevo',
];

export default {
  nombre: '8ball',
  descripcion: 'Responde preguntas al azar.',
  owner: false,

  async ejecutar({ message, args }) {
    const pregunta = args.join(' ');
    if (!pregunta) return message.reply('❓ Debes hacerme una pregunta.');
    const respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];
    message.reply(`🎱 **${respuesta}**`);
  },
};
