export default {
  nombre: 'verperms',
  descripcion: 'Muestra los permisos del bot en el servidor.',
  owner: true,

  async ejecutar({ message }) {
    const perms = message.guild.members.me.permissions.toArray().join(', ');
    message.channel.send(`🔑 **Permisos del bot:**\n\`\`\`${perms}\`\`\``);
  },
};
