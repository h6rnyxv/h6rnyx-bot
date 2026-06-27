import { embed, errorEmbed, COLORS } from '../../utils/embed.js';

  export default {
    nombre: 'nuke',
    descripcion: 'Clona y elimina el canal actual (reinicio completo).',
    owner: false,

    async ejecutar({ message }) {
      if (!message.member.permissions.has('ManageChannels'))
        return message.reply({ embeds: [errorEmbed('No tienes permiso para usar este comando.', message.author)] });

      try {
        const posicion = message.channel.position;
        const canalNuevo = await message.channel.clone({ reason: `Nuke por ${message.author.tag}` });
        await canalNuevo.setPosition(posicion);
        await message.channel.delete();
        canalNuevo.send({ embeds: [embed({
          title: '💥 Canal Nukeado',
          description: `Este canal fue reiniciado por **${message.author.tag}**.`,
          color: COLORS.error,
          footer: { text: message.guild.name, iconURL: message.guild.iconURL() ?? undefined },
        })] });
      } catch {
        message.reply({ embeds: [errorEmbed('No pude nukear el canal.', message.author)] });
      }
    },
  };