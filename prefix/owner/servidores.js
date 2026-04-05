import { EmbedBuilder, PermissionsBitField } from 'discord.js';

export default {
  nombre: 'servidores',
  descripcion: 'Lista los servidores donde está el bot y genera invitaciones.',
  owner: true,

  async ejecutar({ client, message }) {
    let resultado = '';
    let n = 0;

    for (const guild of client.guilds.cache.values()) {
      n++;
      let inviteLink = 'Sin permisos';
      try {
        const canal = guild.channels.cache.find(
          (c) => c.type === 0 && c.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.CreateInstantInvite)
        );
        if (canal) {
          const inv = await canal.createInvite({ maxAge: 300, maxUses: 1, reason: '!servidores' });
          inviteLink = inv.url;
        }
      } catch {}
      resultado += `**${n}.** ${guild.name} (\`${guild.memberCount}\` miembros)\n${inviteLink}\n\n`;
    }

    if (!resultado) return message.reply('No estoy en ningún servidor.');

    const embed = new EmbedBuilder()
      .setTitle(`🌐 Estoy en ${client.guilds.cache.size} servidores`)
      .setDescription(resultado.slice(0, 4000))
      .setColor('Blue');

    message.channel.send({ embeds: [embed] });
  },
};
