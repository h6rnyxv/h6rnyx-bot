import { setStatus, clearStatus } from '../../utils/settings.js';

export default {
  nombre: 'setstatus',
  descripcion: 'Cambia el estado del bot (se guarda al reiniciar). Uso: !setstatus <jugando/viendo/escuchando/compitiendo> <mensaje> [online/idle/dnd/invisible]',
  owner: true,

  async ejecutar({ client, message, args }) {
    const tipos = { jugando: 0, viendo: 3, escuchando: 2, compitiendo: 5, streaming: 1 };
    const estados = ['online', 'idle', 'dnd', 'invisible'];

    if (args[0]?.toLowerCase() === 'clear' || args[0]?.toLowerCase() === 'reset') {
      clearStatus();
      client.user.setActivity('!help para ver comandos');
      return message.reply('🗑️ Estado eliminado. Al reiniciar usará el estado por defecto.');
    }

    const [tipoTexto, ...resto] = args;
    const estado = estados.includes(resto[resto.length - 1]) ? resto.pop() : 'online';
    const type = tipos[tipoTexto?.toLowerCase()];
    const msg = resto.join(' ');

    if (type === undefined || !msg)
      return message.reply('❌ Uso: `!setstatus <jugando/viendo/escuchando/compitiendo> <mensaje> [estado]`\nEstados: `online` `idle` `dnd` `invisible`\nPara borrar: `!setstatus clear`');

    client.user.setPresence({ activities: [{ name: msg, type }], status: estado });
    setStatus(type, msg, estado);

    message.reply(`✅ Estado actualizado y guardado: **${tipoTexto} ${msg}** (${estado})`);
  },
};
