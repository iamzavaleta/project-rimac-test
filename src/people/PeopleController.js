
const { responseNotFound, responseGetById, responseError, responseCreate, responseDelete, responseUpdate, responseGetAll } = require('../shared/response');
const Table = require('../shared/tables');
const service = require('./PeopleService')

class PeopleController {
    async getAll() {
        try {
            let people = [];
            // Get data saved from database and star wars API on same promise
            await Promise.allSettled([
                service.getAll(),
                service.getStarWarsPeople()
            ]).then(responses => {
                // Filter only correct responses
                const responses_mapped = responses.filter(m => m.status === 'fulfilled').map(m => m.value)
                // Map people to response
                responses_mapped.forEach(m => {
                    // Create an array with people values
                    const new_people = [].concat.apply([], m)
                    // Concat people with new people from response
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
            // Craete people with service
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
            // Get by id people with service
            const newPeople = await service.getById(id)
            // Validate if people exists
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
            // Get by id people with service
            const peopleFound = await service.getById(id)
            // Validate if people exists
            if (!peopleFound) {
                return responseNotFound(Table.People)
            }
            // Create new people values with old data and new data from payload
            const newPeople = Object.assign({ ...peopleFound }, { ...body })
            // Delete some values not permited to register from payload
            Object.keys(newCharacter).forEach(key => { if (!Object.keys(peopleFound).includes(key)) { delete newPeople[key] } })
            // Delete when we know people exists
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
            // Get by id people with service
            const newPeople = await service.getById(id)
            // Validate if people exists
            if (!newPeople) {
                return responseNotFound(Table.People)
            }
            // Delete when we know people exists
            await service.deleteOne(id)

            return responseDelete(Table.People)
        }
        catch (error) {
            return responseError()
        }
    }
}

module.exports = new PeopleController();