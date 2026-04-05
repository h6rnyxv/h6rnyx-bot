export default {
  nombre: 'renombrarcolores',
  descripcion: 'Renombra los roles de color con formato alineado.',
  owner: true,

  async ejecutar({ message }) {
    const rolesInfo = [
      { id: '1383662897745494016', nombre: 'Lila', emoji: '💜' },
      { id: '1383662900631044227', nombre: 'Negro', emoji: '🖤' },
      { id: '1383662901625098244', nombre: 'Rojo', emoji: '❤️' },
      { id: '1383662906171981895', nombre: 'Rosa Bebé', emoji: '🩷' },
      { id: '1383662902761750569', nombre: 'Naranja', emoji: '🧡' },
      { id: '1383662900996079658', nombre: 'Blanco', emoji: '🤍' },
      { id: '1383662907224756265', nombre: 'Sakura', emoji: '🌸' },
      { id: '1383662903349215404', nombre: 'Verde', emoji: '🌲' },
      { id: '1383662899838451763', nombre: 'Amarillo Pastel', emoji: '💛' },
      { id: '1383662904460709972', nombre: 'Fucsia', emoji: '💖' },
      { id: '1383662899154649109', nombre: 'Menta', emoji: '💚' },
      { id: '1383662905584779315', nombre: 'Azul Bebé', emoji: '🩵' },
      { id: '1383662906645680148', nombre: 'Marrón', emoji: '🟫' },
      { id: '1383662907513901118', nombre: 'Acqua', emoji: '🌊' },
      { id: '1383662898341089341', nombre: 'Azul Cielo', emoji: '💙' },
      { id: '1383662896717889598', nombre: 'Rosa Pastel', emoji: '💗' },
      { id: '1383662903768514591', nombre: 'Azul', emoji: '🔵' },
    ];

    const maxLen = Math.max(...rolesInfo.map((r) => r.nombre.length));
    const errores = [];

    for (const { id, nombre, emoji } of rolesInfo) {
      const rol = message.guild.roles.cache.get(id);
      if (!rol) { errores.push(`❌ No encontrado: ID ${id}`); continue; }

      const formateado = `${nombre.padEnd(maxLen, ' ')}         >         ${emoji}`;
      await rol.setName(formateado).catch(() => errores.push(`❌ No se pudo renombrar: ${nombre}`));
    }

    if (errores.length) return message.reply(`⚠️ Completado con errores:\n${errores.join('\n')}`);
    message.reply('✅ Roles renombrados con formato alineado.');
  },
};
