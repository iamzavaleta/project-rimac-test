
const { responseNotFound, responseGetById, responseError, responseCreate, responseDelete, responseUpdate, responseGetAll } = require('../shared/response');
const Table = require('../shared/tables');
const service = require('./PeopleService')

class PeopleController {
    async getAll() {
        try {
            let people = [];
            // Obtener data guardada del api y de la tabla en una sola respuesta
            await Promise.allSettled([
                service.getAll(),
                service.getStarWarsPeople()
            ]).then(responses => {
                // Filtrar solo las respuestas correctas
                const responses_mapped = responses.filter(m => m.status === 'fulfilled').map(m => m.value)
                // Mapear las respuestas
                responses_mapped.forEach(m => {
                    // Crea un arreglo con los valores
                    const new_people = [].concat.apply([], m)
                    // Concatenar el arreglo con el nuevo valor de la respuesta.
                    people = people.concat(new_people)
                })
            })
            return responseGetAll(Table.People, people)
        }
        catch (error) {
            return responseError()
        }
    }

    async create(event) {
        try {
            const body = event.body
            // Servicio para crear una persona
            const newPeople = await service.create(body)

            return responseCreate(Table.People, newPeople)
        }
        catch (error) {
            return responseError()
        }
    }

    async getById(event) {
        try {
            const { id } = event.pathParameters;
            // Servicio para obtener persona por Id
            const newPeople = await service.getById(id)
            // Validar si existe respuesta del servicio.
            if (!newPeople) {
                return responseNotFound(Table.People)
            }

            return responseGetById(Table.People, newPeople)
        }
        catch (error) {
            return responseError()
        }
    }

    async update(event) {
        try {
            const { id } = event.pathParameters;
            const body = event.body
            // Servicio para obtener la persona por id
            const peopleFound = await service.getById(id)
            
            // Validar si la persona existe
            if (!peopleFound) {
                return responseNotFound(Table.People)
            }
            // Crear una nueva persona sobreescribiendo los valores de la nueva.
            const newPeople = Object.assign({ ...peopleFound }, { ...body })

            // Borrar los valores que no estan permitidos
            Object.keys(newPeople).forEach(key => { if (!Object.keys(peopleFound).includes(key)) { delete newPeople[key] } })
            await service.update(id, newPeople)

            return responseUpdate(Table.People, newPeople)
        }
        catch (error) {
            return responseError()
        }
    }

    async deleteOne(event) {
        try {
            const { id } = event.pathParameters;
            // Servicio para obtener persona por Id
            const newPeople = await service.getById(id)
            // Validar si la persona existe en la bd
            if (!newPeople) {
                return responseNotFound(Table.People)
            }
            // Servicio para borrar persona existente.
            await service.deleteOne(id)

            return responseDelete(Table.People)
        }
        catch (error) {
            return responseError()
        }
    }
}

module.exports = new PeopleController();