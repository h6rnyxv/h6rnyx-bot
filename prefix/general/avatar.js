import { embed, COLORS } from '../../utils/embed.js';

  export default {
    nombre: 'avatar',
    descripcion: 'Muestra el avatar de un usuario.',
    uso: '[@usuario]',
    owner: false,

    async ejecutar({ message }) {
      const miembro = message.mentions.members.first() || message.member;
      const url = miembro.displayAvatarURL({ size: 1024, dynamic: true });
      message.channel.send({ embeds: [embed({
        author: { name: miembro.displayName, iconURL: url },
        title: '🖼️ Avatar',
        image: url,
        color: COLORS.primary,
        footer: { text: `Solicitado por ${message.author.username}`, iconURL: message.author.displayAvatarURL() },
      })] });
    },
  };