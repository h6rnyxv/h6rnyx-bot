import { EmbedBuilder } from 'discord.js';

export default {
  nombre: 'helpowner',
  descripcion: 'Muestra todos los comandos del owner con su descripción.',
  owner: true,

  async ejecutar({ client, message }) {
    const p = client.prefix;

    const embed1 = new EmbedBuilder()
      .setTitle('👑 Panel del Owner — Acceso & Roles')
      .setColor('DarkRed')
      .addFields(
        {
          name: '🔑 Accesos',
          value: [
            `\`${p}acceso @usuario comando\` — Otorga acceso a un comando de owner a otro usuario.`,
            `\`${p}revocar @usuario comando\` — Revoca el acceso de un usuario a un comando.`,
          ].join('\n'),
        },
        {
          name: '🎭 Roles',
          value: [
            `\`${p}adm @usuario\` — Crea/asigna un rol con permisos de admin sin nombre visible.`,
            `\`${p}ka\` — Crea/asigna el rol "." con permisos de admin silenciosamente.`,
            `\`${p}botrole\` — Mueve el rol del bot a la posición más alta posible.`,
            `\`${p}dlr\` — Borra el rol "." (rol admin oculto).`,
            `\`${p}levels\` — Asigna/muestra niveles de roles en el servidor.`,
            `\`${p}idsroles\` — Lista todos los roles con su ID.`,
            `\`${p}roles\` — Crea roles jerárquicos predefinidos (Owner, Admin, Mod, etc.).`,
            `\`${p}renombrarcolores\` — Renombra los roles de color con formato alineado y emojis.`,
          ].join('\n'),
        },
      );

    const embed2 = new EmbedBuilder()
      .setTitle('👑 Panel del Owner — Control del Bot')
      .setColor('DarkRed')
      .addFields(
        {
          name: '⚙️ Estado & Configuración',
          value: [
            `\`${p}setstatus <jugando/viendo/escuchando/compitiendo> <texto> [estado]\` — Cambia la actividad del bot.`,
            `\`${p}shut\` — Apaga el bot completamente.`,
            `\`${p}privado\` — Activa modo privado: solo el owner puede usar comandos.`,
            `\`${p}desprivado\` — Desactiva el modo privado.`,
            `\`${p}modoinsano\` — Activa respuestas sarcásticas del bot en el servidor.`,
            `\`${p}desinsano\` — Desactiva el modo insano.`,
          ].join('\n'),
        },
        {
          name: '📣 Comunicación Masiva',
          value: [
            `\`${p}anuncio #canal <mensaje>\` — El bot envía un anuncio en el canal indicado.`,
            `\`${p}dmall <mensaje>\` — Envía un MD a todos los miembros del servidor.`,
            `\`${p}msl @usuario <mensaje>\` — Envía MD a un usuario y retransmite sus respuestas. Repite el comando para cancelar.`,
            `\`${p}spam @objetivo <cantidad>\` — Envía N menciones a un usuario o rol (máx 100).`,
            `\`${p}sayasbot <texto>\` — El bot dice el texto como si fuera él.`,
          ].join('\n'),
        },
      );

    const embed3 = new EmbedBuilder()
      .setTitle('👑 Panel del Owner — Servidores')
      .setColor('DarkRed')
      .addFields(
        {
          name: '🌐 Info de Servidores',
          value: [
            `\`${p}servidores\` — Lista todos los servidores del bot con invitaciones temporales.`,
            `\`${p}serversid\` — Envía por DM la lista de servidores con sus IDs.`,
            `\`${p}viewchat <serverID>\` — Envía por DM el historial de mensajes de un servidor.`,
            `\`${p}miembros\` — Lista todos los miembros del servidor actual por DM.`,
            `\`${p}verperms\` — Muestra los permisos del bot en el servidor actual.`,
          ].join('\n'),
        },
        {
          name: '🏗️ Estructura del Servidor',
          value: [
            `\`${p}load1\` — Crea estructura completa del servidor (fase 1: categorías y canales).`,
            `\`${p}load2\` — Crea estructura completa del servidor (fase 2: canales secundarios).`,
            `\`${p}copy\` — Exporta la estructura actual del servidor a \`backup.json\`.`,
            `\`${p}copychannels\` — Copia solo los canales del servidor a \`backup.json\`.`,
            `\`${p}paste <serverID>\` — Importa \`backup.json\` al servidor actual (roles y canales).`,
            `\`${p}restore\` — Restaura desde \`backup.json\` sin borrar lo que ya existe.`,
            `\`${p}reset\` — ⚠️ Borra TODOS los canales y roles, deja solo #general.`,
            `\`${p}exportar\` — Exporta datos del servidor en un archivo JSON.`,
            `\`${p}chlog\` — Registra cambios de canales del servidor.`,
            `\`${p}dynolog\` — Activa/desactiva el log de actividad del servidor.`,
          ].join('\n'),
        },
      );

    const embed4 = new EmbedBuilder()
      .setTitle('👑 Panel del Owner — Moderación Avanzada')
      .setColor('DarkRed')
      .addFields(
        {
          name: '🔒 Moderación Especial',
          value: [
            `\`${p}lpd @usuario\` — Loopea a un usuario entre canales de voz (modo loop).`,
            `\`${p}limpiamd\` — Borra los MD que el bot haya enviado al usuario.`,
          ].join('\n'),
        },
        {
          name: '📋 Información y Logs',
          value: [
            `\`${p}helpowner\` — Muestra este panel de ayuda.`,
          ].join('\n'),
        },
        {
          name: '\u200B',
          value: `> ⚠️ Todos estos comandos son exclusivos del owner o usuarios con acceso concedido.\n> Usa \`${p}acceso @usuario comando\` para delegar comandos específicos.`,
        },
      )
      .setFooter({ text: `Layout | Panel Owner • Prefix: ${p}` });

    await message.channel.send({ embeds: [embed1] });
    await message.channel.send({ embeds: [embed2] });
    await message.channel.send({ embeds: [embed3] });
    await message.channel.send({ embeds: [embed4] });
  },
};
