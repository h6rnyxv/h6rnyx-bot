import { modoInsanoPorServidor } from '../../utils/estadoGlobal.js';

export default {
  nombre: 'modoinsano',
  descripcion: 'Activa el modo insano en el servidor.',
  owner: true,

  async ejecutar({ message }) {
    modoInsanoPorServidor.set(message.guild.id, true);
    message.channel.send('😈 ¡Modo INSANO activado!');
  },
};
