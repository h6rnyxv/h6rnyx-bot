import { EmbedBuilder, PermissionsBitField } from 'discord.js';

const colores = [
  { nombre: '・✦・Rosa Pastel・✦・', hex: '#FFB6C1' },
  { nombre: '・✦・Lila・✦・', hex: '#B39DDB' },
  { nombre: '・✦・Azul Cielo・✦・', hex: '#81D4FA' },
  { nombre: '・✦・Menta・✦・', hex: '#A5D6A7' },
  { nombre: '・✦・Amarillo Pastel・✦・', hex: '#FFF59D' },
  { nombre: '・✦・Negro・✦・', hex: '#000000' },
  { nombre: '・✦・Blanco・✦・', hex: '#FFFFFF' },
  { nombre: '・✦・Rojo・✦・', hex: '#EF9A9A' },
  { nombre: '・✦・Naranja・✦・', hex: '#FFCC80' },
  { nombre: '・✦・Verde・✦・', hex: '#C8E6C9' },
];

export default {
  nombre: 'load2',
  descripcion: 'Envía embeds decorados a los canales del servidor y crea roles de color.',
  owner: true,

  async ejecutar({ message }) {
    const guild = message.guild;
    const buscar = (nombre) => guild.channels.cache.find((c) => c.name.includes(nombre));

    const rulesChannel = buscar('rules');
    if (rulesChannel) {
      await rulesChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('🌸 Reglas del Servidor 🌸')
            .setColor('#FFC0CB')
            .setDescription(
              '**1. Sé amable:** Este es un espacio seguro para todos. 🫶\n' +
              '**2. Nada de odio:** Respeta a cada persona.\n' +
              '**3. No spam:** Cuida la estética del canal. 💮\n' +
              '**4. Diviértete:** ¡Tu energía hace florecer el servidor! 💐'
            )
            .setFooter({ text: 'Cumplir las reglas mantiene nuestro servidor hermoso ✨' }),
        ],
      });
    }

    const announceChannel = buscar('announcements') || buscar('announce');
    if (announceChannel) {
      await announceChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('🎀 ¡Bienvenidos!')
            .setColor('#FFB6C1')
            .setDescription(
              '¡Hola a todos! Este servidor está listo para recibiros.\n\nGracias por uniros ✨'
            )
            .setFooter({ text: 'Nos vemos pronto con sorpresas 🎁' }),
        ],
      });
    }

    const colorsChannel = buscar('colors') || buscar('colores');
    if (colorsChannel) {
      let rolesCreados = 0;
      let descripcion = '🎨 **Roles de color disponibles:**\n\n';

      for (const color of colores) {
        let rol = guild.roles.cache.find((r) => r.name === color.nombre);
        if (!rol) {
          try {
            rol = await guild.roles.create({ name: color.nombre, color: color.hex, mentionable: false });
            rolesCreados++;
          } catch {}
        }
        if (rol) descripcion += `${rol} → \`${color.hex}\`\n`;
      }

      await colorsChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('🎨 Elige tu Color')
            .setColor('#FFB6C1')
            .setDescription(descripcion),
        ],
      });
    }

    message.reply('✅ Embeds enviados y roles de color creados.');
  },
};
