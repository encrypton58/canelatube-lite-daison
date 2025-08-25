export default {
    language: 'en',

    fieldsRequired(): string {
        switch (this.language) {
            case 'es':
                return `Campos requeridos 😭`
            case 'en':
                return `Fields required 😭`
            default:
                return `Fields required 😭`
        }
    },

    fieldsRequiredDetails(): string {
        switch (this.language) {
            case 'es':
                return `El formulario está un poco vacío 📄❌. Necesitamos algunos datos para seguir adelante 🏃‍♂️‍➡️`
            case 'en':
                return `Required fields have not been filled 😭`
            default:
                return `Required fields have not been filled 😭`
        }
    },

    contentTypeNotAllowed(): string {
        switch (this.language) {
            case 'es':
                return `Tipo de contenido no permitido 🚫`
            case 'en':
                return `Content type not allowed 🚫`
            default:
                return `Content type not allowed 🚫`
        }
    },

    contentTypeNotAllowedDetails(): string {
        switch (this.language) {
            case 'es':
                return `El tipo de contenido que has enviado no es compatible 📄❌`
            case 'en':
                return `The content type you have sent is not allowed 📄❌`
            default:
                return `The content type you have sent is not allowed 📄❌`
        }
    },

    success(): string {
        switch (this.language) {
            case 'es':
                return `Se obtuvo la información correctamente 😎`
            case 'en':
                return `The information was obtained correctly 😎`
            default:
                return `The information was obtained correctly 😎`
        }
    }

}