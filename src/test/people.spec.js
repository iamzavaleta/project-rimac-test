const { v4 } = require('uuid')
const service = require('../people/PeopleService')

const data = {
    nombre: "Maria Fernanda",
    altura: "165",
    masa: "55",
    color_cabello: "negro",
    color_piel: "blanco",
    color_ojos: "verde",
    fecha_nacimiento: "1999-12-22",
    genero: "femenino"
}

let new_people;
let arrayPeople = [];

test('PeopleService : El servicio es un objeto', () => {
    expect(typeof service).toBe('object')
})

test('PeopleService : El servicio tiene funciones', () => {
    expect(typeof service.create).toBe('function')
    expect(typeof service.deleteOne).toBe('function')
    expect(typeof service.getAll).toBe('function')
    expect(typeof service.getById).toBe('function')
    expect(typeof service.update).toBe('function')
    expect(typeof service.deleteOne).toBe('function')
})

test('PeopleService : El servicio create, crea un item people', async () => {
    // Validate has an expect true
    expect.assertions(1);
    try {
        // Create character
        const res = await service.create(data);
        new_people = { ...data, id: res.id }
        // Expect character saved is equal from data send to save
        expect(res).toEqual(new_people)
    }
    catch (error) {
        console.log("Error in create people", error)
    }
})

test('PeopleService : El servicio getAll, retorna un listado de people', async () => {
    // Validate has two expect true
    expect.assertions(2);
    try {
        // List arrayPeople
        arrayPeople = await service.getAll();
        // Expect first character from list is equal character created up
        expect(arrayPeople[0]).toEqual(new_people)
        // Expect length of list of arrayPeople is equal 1
        expect(arrayPeople.length).toEqual(1)
    }
    catch (error) {
        console.log("Error in getAll arrayPeople", error)
    }
})

test('PeopleService : El servicio getById retorna un item people por id', async () => {
    // Validate has an expect true
    expect.assertions(1);
    try {
        // Get character from id valid
        const res = await service.getById(arrayPeople[0].id);
        // Expect character is equal first character from list
        expect(res).toEqual(arrayPeople[0])
    }
    catch (error) {
        console.log("Error in get character by id", error)
    }
})

test('PeopleService : El servicio getById retorna undefined si el Id es inválido', async () => {
    // Validate has an expect true
    expect.assertions(1);
    try {
        // Get undefined from id invalid
        const res = await service.getById("ID_TEST");
        // Expect response is equal undefined because character was not found
        expect(res).toEqual(undefined)
    }
    catch (error) {
        console.log("Error in get character by id", error)
    }
})

test('PeopleService : El servicio update, actualiza un nuevo item people por Id', async () => {
    // Validate has an expect true
    expect.assertions(1);
    try {
        // Create a new mock
        const new_body = {
            nombre: "Maria Luisa",
            altura: "160",
            masa: "50",
            color_cabello: "rojo",
            color_piel: "negro",
            color_ojos: "marron",
            fecha_nacimiento: "1999-12-22",
            genero: "femenino"
        }
        // Update first character from list with new data mock
        const res = await service.update(new_people.id, new_body);
        // Get data from response after update
        const mockEntries = Object.entries(res)
        // Create an expected value to compare after
        const expectedEntries = Object.entries({ ...new_people, ...new_body })
        // Expect value from response after update is equal new data mock
        expect(JSON.stringify(mockEntries)).toEqual(JSON.stringify(expectedEntries))
        new_people = { ...new_people, ...new_body }
    }
    catch (error) {
        console.log("Error in update people", error)
    }
})

test('PeopleService : El servicio delete, borra un item people por Id', async () => {
    // Validate has an expect true
    expect.assertions(1);
    try {
        // Delete unique value from list
        await service.deleteOne(arrayPeople[0].id);
        // Get arrayPeople list
        arrayPeople = await service.getAll();
        // Expect list arrayPeople length is equal 0
        expect(arrayPeople.length).toEqual(0)
    }
    catch (error) {
        console.log("Error in delete people", error)
    }
})