export default {
  nombre: 'shut',
  descripcion: 'Apaga el bot completamente.',
  owner: true,

  async ejecutar({ message }) {
    await message.channel.send('👋 Apagando el bot...').catch(() => {});
    process.exit(0);
  },
};
