export const modoInsanoPorServidor = new Map();

  let modoPrivado = false;

  export function setPrivado(valor) {
    modoPrivado = valor;
  }

  export function getPrivado() {
    return modoPrivado;
  }
  