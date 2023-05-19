
const peopleSchema = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                nombre: { type: 'string' },
                altura: { type: 'string' },
                masa: { type: 'string' },
                color_cabello: { type: 'string' },
                color_piel: { type: 'string' },
                color_ojos: { type: 'string' },
                fecha_nacimiento: { type: 'string' },
                genero: { type: 'string' }
            },
            required: ['nombre', 'altura', 'masa', 'color_cabello',
                'color_piel', 'color_ojos', 'fecha_nacimiento', 'genero']
        }
    }
}

module.exports = peopleSchema