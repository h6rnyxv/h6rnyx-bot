import { modoInsanoPorServidor } from '../../utils/estadoGlobal.js';

export default {
  nombre: 'desinsano',
  descripcion: 'Desactiva el modo insano en el servidor.',
  owner: true,

  async ejecutar({ message }) {
    modoInsanoPorServidor.set(message.guild.id, false);
    message.channel.send('😇 Modo INSANO desactivado.');
  },
};
