import { embed, errorEmbed, successEmbed, infoEmbed, COLORS } from '../../utils/embed.js';
  import { otorgarAcceso, revocarAcceso, obtenerAccesos, guardarAccesos } from '../../utils/accesos.js';

  export default {
    nombre: 'acceso',
    descripcion: 'Gestiona el acceso de usuarios a comandos de owner.',
    uso: '<otorgar|revocar|lista> [@usuario] [comando|todos]',
    owner: true,

    async ejecutar({ client, message, args }) {
      const sub = args[0]?.toLowerCase();

      if (!sub || !['otorgar', 'revocar', 'lista'].includes(sub)) {
        return message.reply({ embeds: [embed({
          title: '📋 Uso: acceso',
          color: COLORS.info,
          fields: [
            { name: 'otorgar @usuario <cmd|todos>', value: 'Da acceso a un comando o a todos' },
            { name: 'revocar @usuario <cmd|todos>', value: 'Revoca un comando o todos los accesos' },
            { name: 'lista',                        value: 'Muestra quién tiene qué acceso' },
          ],
        })] });
      }

      if (sub === 'lista') {
        const accesos = obtenerAccesos();
        const entradas = Object.entries(accesos);
        if (!entradas.length)
          return message.reply({ embeds: [infoEmbed('No hay usuarios con accesos especiales registrados.', message.author)] });

        const lineas = entradas.map(([id, cmds]) => {
          const lista = cmds.includes('*') ? '✨ **TODOS los comandos**' : cmds.map(c => `\`${c}\``).join(', ');
          return `<@${id}>: ${lista}`;
        });
        return message.reply({ embeds: [embed({
          title: '📋 Accesos Registrados',
          description: lineas.join('\n'),
          color: COLORS.primary,
        })] });
      }

      const usuario = message.mentions.users.first();
      if (!usuario)
        return message.reply({ embeds: [errorEmbed('Debes mencionar a un usuario.', message.author)] });

      if (usuario.id === client.ownerId)
        return message.reply({ embeds: [infoEmbed('El owner ya tiene acceso a todo por defecto.', message.author)] });

      const argCmd = args[2]?.toLowerCase();
      if (!argCmd)
        return message.reply({ embeds: [errorEmbed('Indica el comando o escribe `todos`.', message.author)] });

      if (sub === 'otorgar') {
        if (argCmd === 'todos') {
          const accesos = obtenerAccesos();
          accesos[usuario.id] = ['*'];
          guardarAccesos(accesos);
          return message.reply({ embeds: [successEmbed(`<@${usuario.id}> ahora tiene acceso a **todos** los comandos de owner.`, message.author)] });
        }
        // FIX: buscar en prefixCommands, no en commands (slash)
        const cmd = client.prefixCommands.get(argCmd);
        if (!cmd)
          return message.reply({ embeds: [errorEmbed(`El comando \`${argCmd}\` no existe.`, message.author)] });
        if (!cmd.owner)
          return message.reply({ embeds: [infoEmbed(`\`${argCmd}\` no es un comando de owner, no requiere acceso especial.`, message.author)] });

        const ok = otorgarAcceso(usuario.id, argCmd);
        return message.reply({ embeds: [ok
          ? successEmbed(`Se otorgó acceso a <@${usuario.id}> para \`${argCmd}\`.`, message.author)
          : infoEmbed(`<@${usuario.id}> ya tenía acceso a \`${argCmd}\`.`, message.author)
        ] });
      }

      if (sub === 'revocar') {
        if (argCmd === 'todos') {
          const accesos = obtenerAccesos();
          if (!accesos[usuario.id])
            return message.reply({ embeds: [infoEmbed(`<@${usuario.id}> no tenía accesos registrados.`, message.author)] });
          delete accesos[usuario.id];
          guardarAccesos(accesos);
          return message.reply({ embeds: [successEmbed(`Se revocaron todos los accesos de <@${usuario.id}>.`, message.author)] });
        }
        const ok = revocarAcceso(usuario.id, argCmd);
        return message.reply({ embeds: [ok
          ? successEmbed(`Se revocó el acceso de <@${usuario.id}> al comando \`${argCmd}\`.`, message.author)
          : infoEmbed(`<@${usuario.id}> no tenía acceso a \`${argCmd}\`.`, message.author)
        ] });
      }
    },
  };