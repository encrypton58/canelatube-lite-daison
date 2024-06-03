export default class MessagesTranslates {
  static language: string = "en";

  static required(field: string): string {
    switch (this.language) {
      case "es":
        return `Hey campos son para llenar, no para olvidar: ${field} es requerido 😅`;
      case "en":
        return `Hey fields are to fill, not to forget: ${field} is required 😅`;
      default:
        return `Hey fields are to fill, not to forget: ${field} is required 😅`;
    }
  }

  static url(field: string): string {
    switch (this.language) {
      case "es":
        return `Esto no parece una URL válida 🤨: ${field}`;
      case "en":
        return `This doesn't look like a valid URL 🤨: ${field}`;
      default:
        return `This doesn't look like a valid URL 🤨: ${field}`;
    }
  }

  static number(field: string): string {
    switch (this.language) {
      case "es":
        return `Esto no parece un número válido 🤨: ${field}`;
      case "en":
        return `This doesn't look like a valid number 🤨: ${field}`;
      default:
        return `This doesn't look like a valid number 🤨: ${field}`;
    }
  }

  static successFormatsAvailables(): string {
    switch (this.language) {
      case "es":
        return `Yupi.. todo funcionó como se esperaba 😎`;
      case "en":
        return `Yupi.. everything worked as expected 😎`;
      default:
        return `Yupi.. everything worked as expected 😎`;
    }
  }

  static successDownload(): string {
    switch (this.language) {
      case "es":
        return `Descarga exitosa 🎉`;
      case "en":
        return `Download successful 🎉`;
      default:
        return `Download successful 🎉`;
    }
  }

  static errorFormatsAvailables(): string {
    switch (this.language) {
      case "es":
        return `Ups... No se pudieron obtener los formatos de descarga 😖`;
      case "en":
        return `Ups... Couldn't get download formats 😖`;
      default:
        return `Ups... Couldn't get download formats 😖`;
    }
  }

  static errorSpawnProcess(cause: String): string {
    switch (this.language) {
      case "es":
        return `Aww... No llores 😭, esto es lo que está mal: ${cause}`;
      case "en":
        return `Aww... Don't cry 😭, this is what's wrong: ${cause}`;
      default:
        return `Aww... Don't cry 😭, this is what's wrong: ${cause}`;
    }
  }

  static errorVideoUnavailable(): string {
    switch (this.language) {
      case "es":
        return `El video no está disponible 😢`;
      case "en":
        return `The video is not available 😢`;
      default:
        return `The video is not available 😢`;
    }
  }

  static errorVideoLong(): string {
    switch (this.language) {
      case "es":
        return `El video es muy largo 😵`;
      case "en":
        return `The video is too long 😵`;
      default:
        return `The video is too long 😵`;
    }
  }

  static formatToMessageError(...arg): string {
    switch (this.language) {
      case "es":
        return `No es el fin del mundo 🚨. Revisa los siguientes errores: \n ${arg.join(
          "\n"
        )}`;
      case "en":
        return `It's not the end of the world 🚨. Check the following errors: \n ${arg.join(
          "\n"
        )}`;
      default:
        return `It's not the end of the world 🚨. Check the following errors: \n ${arg.join(
          "\n"
        )}`;
    }
  }

  static warningVideoLong(): string {
    switch (this.language) {
      case "es":
        return `La conversión puede tardar un poco más de lo normal. Por favor, espera pacientemente. 😅`;
      case "en":
        return `The conversion may take a little longer than normal. Please wait patiently. 😅`;
      default:
        return `The conversion may take a little longer than normal. Please wait patiently. 😅`;
    }
  }
}
