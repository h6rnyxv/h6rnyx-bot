export default {
    name: 'voiceStateUpdate',
    once: false,

    async execute(client, oldState, newState) {
      // Solo nos interesa cuando alguien ENTRA a un canal de voz
      if (!newState.channelId) return;
      // Si era el mismo canal, ignorar (ej: mute/unmute)
      if (oldState.channelId === newState.channelId) return;

      const guildId = newState.guild.id;
      if (!client.loopUsuarios) return;

      const set = client.loopUsuarios.get(guildId);
      if (!set || !set.has(newState.id)) return;

      try {
        await newState.disconnect();
        const ch = newState.guild.systemChannel || newState.guild.channels.cache.find(c => c.isTextBased && c.permissionsFor(newState.guild.members.me)?.has('SendMessages'));
        if (ch) ch.send(`🔁 <@${newState.id}> fue desconectado automáticamente del canal de voz.`).catch(() => {});
      } catch (err) {
        console.error('[LPD] Error al desconectar:', err.message);
      }
    },
  };
  