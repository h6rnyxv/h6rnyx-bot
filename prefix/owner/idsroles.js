export default {
  nombre: 'idsroles',
  descripcion: 'Muestra el nombre e ID de los roles mencionados.',
  owner: true,

  async ejecutar({ message }) {
    const roles = message.mentions.roles;
    if (roles.size === 0)
      return message.reply('❌ Menciona los roles de los que deseas obtener los IDs.');

    let respuesta = '🎨 **IDs de los roles mencionados:**\n\n';
    roles.forEach((rol) => {
      respuesta += `🔹 **${rol.name}** → \`${rol.id}\`\n`;
    });

    message.channel.send(respuesta);
  },
};
