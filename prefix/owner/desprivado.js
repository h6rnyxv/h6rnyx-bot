import { setPrivado } from '../../utils/estadoGlobal.js';

export default {
  nombre: 'desprivado',
  descripcion: 'Desactiva el modo privado.',
  owner: true,

  async ejecutar({ message }) {
    setPrivado(false);
    message.reply('🔓 Modo privado desactivado.');
  },
};
