export default {
  nombre: 'levels',
  descripcion: 'Crea roles decorados para rangos de niveles.',
  owner: true,

  async ejecutar({ message }) {
    const rangos = [
      [1, 5], [6, 10], [11, 20], [21, 30], [31, 40],
      [41, 50], [51, 60], [61, 70], [71, 80], [81, 90],
      [91, 100], [101, 120], [121, 140], [141, 160],
      [161, 180], [181, 199], [200, 200],
    ];

    let creados = 0;

    for (const [inicio, fin] of rangos) {
      const nombre = fin === 200 ? `・✦・Nivel ${fin}・✦・` : `・✧・Nivel ${inicio}–${fin}・✧・`;
      if (message.guild.roles.cache.some((r) => r.name === nombre)) continue;

      try {
        await message.guild.roles.create({
          name: nombre,
          color: fin === 200 ? '#000000' : undefined,
          mentionable: false,
          reason: 'Roles de nivel',
        });
        creados++;
      } catch (err) {
        console.error(`Error creando ${nombre}:`, err.message);
      }
    }

    message.reply(`✅ Se crearon **${creados}** roles de nivel.`);
  },
};
