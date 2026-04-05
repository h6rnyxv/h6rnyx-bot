import { otorgarAcceso, revocarAcceso, obtenerAccesos, guardarAccesos } from '../../utils/accesos.js';

export default {
  nombre: 'acceso',
  descripcion: 'Gestiona el acceso de usuarios a comandos de owner.',
  uso: '!acceso <otorgar|revocar|lista> [@usuario] [comando|todos]',
  owner: true,

  async ejecutar({ client, message, args }) {
    const subcomando = args[0]?.toLowerCase();

    if (!subcomando || !['otorgar', 'revocar', 'lista'].includes(subcomando)) {
      return message.reply([
        '❌ Uso incorrecto. Opciones:',
        '```',
        '!acceso otorgar @usuario <comando>  → da acceso a un comando específico',
        '!acceso otorgar @usuario todos      → da acceso a TODOS los comandos de owner',
        '!acceso revocar @usuario <comando>  → revoca un comando específico',
        '!acceso revocar @usuario todos      → revoca TODOS los accesos',
        '!acceso lista                       → muestra quién tiene qué acceso',
        '```',
      ].join('\n'));
    }

    if (subcomando === 'lista') {
      const accesos = obtenerAccesos();
      const entradas = Object.entries(accesos);

      if (entradas.length === 0)
        return message.reply('📋 No hay usuarios con accesos especiales registrados.');

      const lineas = entradas.map(([id, cmds]) => {
        const lista = cmds.includes('*') ? '✨ **TODOS los comandos**' : `\`${cmds.join('`, `')}\``;
        return `<@${id}>: ${lista}`;
      });

      return message.reply(`**📋 Accesos registrados:**\n${lineas.join('\n')}`);
    }

    const usuarioMencionado = message.mentions.users.first();
    if (!usuarioMencionado)
      return message.reply('❌ Debes mencionar a un usuario. Ejemplo: `!acceso otorgar @usuario adm`');

    if (usuarioMencionado.id === client.ownerId)
      return message.reply('ℹ️ El owner ya tiene acceso a todos los comandos por defecto.');

    const argComando = args[2]?.toLowerCase();
    if (!argComando)
      return message.reply('❌ Indica el comando o escribe `todos`. Ejemplo: `!acceso otorgar @usuario adm`');

    if (subcomando === 'otorgar') {
      if (argComando === 'todos') {
        const accesos = obtenerAccesos();
        accesos[usuarioMencionado.id] = ['*'];
        guardarAccesos(accesos);
        return message.reply(`✅ ${usuarioMencionado} ahora tiene acceso a **todos los comandos de owner**.`);
      }

      const comando = client.commands.get(argComando);
      if (!comando) return message.reply(`❌ El comando \`${argComando}\` no existe.`);
      if (!comando.owner) return message.reply(`ℹ️ \`${argComando}\` no es un comando de owner, no requiere acceso especial.`);

      const otorgado = otorgarAcceso(usuarioMencionado.id, argComando);
      if (otorgado)
        return message.reply(`✅ Se otorgó acceso a ${usuarioMencionado} para \`${argComando}\`.`);
      else
        return message.reply(`ℹ️ ${usuarioMencionado} ya tenía acceso a \`${argComando}\`.`);
    }

    if (subcomando === 'revocar') {
      if (argComando === 'todos') {
        const accesos = obtenerAccesos();
        if (!accesos[usuarioMencionado.id])
          return message.reply(`ℹ️ ${usuarioMencionado} no tenía ningún acceso registrado.`);
        delete accesos[usuarioMencionado.id];
        guardarAccesos(accesos);
        return message.reply(`✅ Se revocaron **todos los accesos** de ${usuarioMencionado}.`);
      }

      const comando = client.commands.get(argComando);
      if (!comando) return message.reply(`❌ El comando \`${argComando}\` no existe.`);

      const revocado = revocarAcceso(usuarioMencionado.id, argComando);
      if (revocado)
        return message.reply(`✅ Se revocó el acceso de ${usuarioMencionado} al comando \`${argComando}\`.`);
      else
        return message.reply(`ℹ️ ${usuarioMencionado} no tenía acceso a \`${argComando}\`.`);
    }
  },
};
