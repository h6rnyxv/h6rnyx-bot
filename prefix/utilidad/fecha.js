export default {
  nombre: 'fecha',
  descripcion: 'Muestra la fecha y hora actual.',
  owner: false,

  async ejecutar({ message }) {
    const ahora = new Date();
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    message.channel.send(`📅 **${ahora.toLocaleString('es-ES', opciones)}**`);
  },
};
