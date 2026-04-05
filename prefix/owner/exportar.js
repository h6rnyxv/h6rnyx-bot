import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  nombre: 'exportar',
  descripcion: 'Exporta la estructura y el código del bot a un archivo de texto.',
  owner: true,

  async ejecutar({ message }) {
    const basePath = join(__dirname, '../..');
    let contenido = '';

    function recorrer(dir, nivel = 0) {
      const items = readdirSync(dir);
      for (const item of items) {
        const ruta = join(dir, item);
        if (ruta.includes('node_modules') || item.startsWith('.git')) continue;
        const stats = statSync(ruta);
        const indent = '  '.repeat(nivel);
        if (stats.isDirectory()) {
          contenido += `${indent}📁 ${item}\n`;
          recorrer(ruta, nivel + 1);
        } else {
          contenido += `${indent}📄 ${item}\n`;
          if (['.js', '.json'].includes(extname(item))) {
            try {
              const data = readFileSync(ruta, 'utf8');
              contenido += `\n----- ${item} -----\n${data.substring(0, 3000)}\n----- FIN ${item} -----\n\n`;
            } catch {}
          }
        }
      }
    }

    recorrer(basePath);

    const rutaArchivo = join(basePath, 'estructura.txt');
    writeFileSync(rutaArchivo, contenido);

    await message.reply({ content: '📁 Aquí está la estructura del bot:', files: [rutaArchivo] });
  },
};
