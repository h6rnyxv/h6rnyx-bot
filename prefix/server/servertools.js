import { EmbedBuilder } from 'discord.js';

export default {
  nombre: 'servertools',
  descripcion: 'Muestra los comandos de gestión del servidor.',
  owner: false,

  async ejecutar({ message, client }) {
    const p = client.prefix;
    const embed = new EmbedBuilder()
      .setTitle('🛠️ Herramientas del Servidor')
      .setColor('DarkButNotBlack')
      .setDescription('Comandos para administrar canales y roles de tu servidor.')
      .addFields(
        { name: `\`${p}setprefix <prefix>\``, value: 'Cambia el prefijo del bot en este servidor (se guarda). Requiere Admin.' },
        { name: `\`${p}viewrole @rol\``, value: 'Muestra qué canales puede ver un rol.' },
        { name: `\`${p}privar #canal [@rol]\``, value: 'Privatiza canales para un rol (por defecto @everyone).' },
        { name: `\`${p}desprivar #canal [@rol]\``, value: 'Quita la privacidad de canales para un rol.' },
        { name: `\`${p}silenciar #canal [@rol]\``, value: 'Impide que un rol envíe mensajes en esos canales.' },
        { name: `\`${p}desilenciar #canal [@rol]\``, value: 'Permite de nuevo que un rol envíe mensajes.' },
      )
      .setFooter({ text: `Layout | Panel de utilidades del servidor • Prefix: ${p}` });

    message.channel.send({ embeds: [embed] });
  },
};
