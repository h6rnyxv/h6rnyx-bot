export default {
  nombre: 'lpd',
  descripcion: 'Activa/desactiva el bucle que desconecta a un usuario al entrar a voz.',
  owner: true,

  async ejecutar({ client, message }) {
    const miembro = message.mentions.members.first();
    if (!miembro) return message.reply('❌ Menciona a un usuario.');

    const guildId = message.guild.id;
    if (!client.loopUsuarios) client.loopUsuarios = new Map();
    if (!client.loopUsuarios.has(guildId)) client.loopUsuarios.set(guildId, new Set());

    const set = client.loopUsuarios.get(guildId);

    if (set.has(miembro.id)) {
      set.delete(miembro.id);
      return message.reply(`🔕 ${miembro} ya no será desconectado automáticamente.`);
    }

    set.add(miembro.id);

    if (miembro.voice.channel) {
      try {
        await miembro.voice.disconnect();
        await message.channel.send(`⚠️ ${miembro} fue desconectado inmediatamente.`);
      } catch {
        return message.channel.send(`❌ No pude desconectar a ${miembro}.`);
      }
    }

    message.reply(`🔁 ${miembro} será desconectado automáticamente al entrar a un canal de voz.`);
  },
};
