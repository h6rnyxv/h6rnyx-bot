import { EmbedBuilder } from 'discord.js';

  export const COLORS = {
    primary: 0x5865F2,
    success: 0x2ecc71,
    error:   0xe74c3c,
    warning: 0xf39c12,
    info:    0x3498db,
    mod:     0xe67e22,
    mute:    0x95a5a6,
    gold:    0xf1c40f,
  };

  export function embed(opts = {}) {
    const e = new EmbedBuilder();
    if (opts.title)       e.setTitle(opts.title);
    if (opts.description) e.setDescription(opts.description);
    if (opts.color !== undefined) e.setColor(opts.color);
    if (opts.author)      e.setAuthor(opts.author);
    if (opts.thumbnail)   e.setThumbnail(opts.thumbnail);
    if (opts.image)       e.setImage(opts.image);
    if (opts.fields?.length) e.addFields(opts.fields);
    if (opts.footer)      e.setFooter(opts.footer);
    if (opts.timestamp !== false) e.setTimestamp();
    return e;
  }

  export function errorEmbed(description, user) {
    return embed({
      description: `❌ ${description}`,
      color: COLORS.error,
      footer: user ? { text: user.username, iconURL: user.displayAvatarURL() } : undefined,
    });
  }

  export function successEmbed(description, user) {
    return embed({
      description: `✅ ${description}`,
      color: COLORS.success,
      footer: user ? { text: user.username, iconURL: user.displayAvatarURL() } : undefined,
    });
  }

  export function infoEmbed(description, user) {
    return embed({
      description: `ℹ️ ${description}`,
      color: COLORS.info,
      footer: user ? { text: user.username, iconURL: user.displayAvatarURL() } : undefined,
    });
  }
  