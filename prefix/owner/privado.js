import { setPrivado } from '../../utils/estadoGlobal.js';

export default {
  nombre: 'privado',
  descripcion: 'Activa el modo privado: solo el owner puede usar comandos.',
  owner: true,

  async ejecutar({ message }) {
    setPrivado(true);
    message.reply('🔐 Modo privado activado. Solo el owner puede usar comandos.');
  },
};
