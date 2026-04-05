export default {
  nombre: 'dmall',
  descripcion: 'Envía un mensaje privado a todos los miembros del servidor.',
  owner: true,

  async ejecutar({ message, args }) {
    const texto = args.join(' ');
    if (!texto) return message.reply('❌ Debes escribir el mensaje a enviar.');

    let enviados = 0;
    let fallidos = 0;

    const miembros = await message.guild.members.fetch();
    const humanos = miembros.filter((m) => !m.user.bot);

    for (const miembro of humanos.values()) {
      try {
        await miembro.send(texto);
        enviados++;
      } catch {
        fallidos++;
      }
    }

    message.reply(`📨 Enviado a **${enviados}** miembro(s). Fallidos: **${fallidos}**.`);
  },
};
