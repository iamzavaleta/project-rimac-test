const { v4 } = require("uuid");
const TableName = require("../shared/tableNames");
const { default: axios } = require("axios");
const externalApis = require("../shared/externalApis");
const DynamoDBClient = require("../shared/dynamoDBClient");

class PeopleService {
    options = {}

    constructor(){
        if(process.env.JEST_WORKER_ID){
            this.options = {
                endpoint: 'http://localhost:8000',
                region: 'local-env',
                sslEnabled: false,
            };
        }
    }

    async getAll() {
        try {
            // Instanciar dinamoClient
            const dynamodb = DynamoDBClient(this.options);
            // Servicio de dynamodb para obtener todos los items de una tabla
            const result = await dynamodb.scan({
                TableName: TableName.People
            }).promise();

            return result.Items
        }
        catch (error) {
            throw error;
        }
    }

    async getStarWarsPeople(){
        try{
            // Obtener data del api STAR WARS
            const res = await axios.get(`${externalApis.STAR_WARS}/people`)

            const dataApi = res.data.results.map( p => {
                return{
                    nombre: p.name,
                    masa: p.mass,
                    altura: p.height,
                    color_cabello: p.hair_color,
                    color_piel: p.skin_color,
                    color_ojos: p.eye_color,
                    fecha_nacimiento: p.birth_year,
                    genero: p.gender
                }
            })
            return dataApi
        }
        catch(error){
            throw error;
        }
    }

    async create(payload) {
        try {
            // Instanciar un cliente de dynamodb
            const dynamodb = DynamoDBClient(this.options);
            // Obtener valores del payload
            const { nombre, masa, altura, color_cabello, color_piel, color_ojos, fecha_nacimiento, genero } = payload;
            // Generar un id usando uuid
            const id = v4()
            // Crear un objeto con los valores del payload y id
            const newPeople = {
                id,
                nombre,
                masa,
                altura,
                color_cabello,
                color_piel,
                color_ojos,
                fecha_nacimiento,
                genero
            }
            // Servicio de dynamodb para crear un nuevo item de una tabla.
            await dynamodb.put({
                TableName: TableName.People,
                Item: newPeople
            }).promise();

            return newPeople
        }
        catch (error) {
            throw error;
        }
    }

    async getById(id) {
        try {
            // Instanciar un cliente de dynamodb
            const dynamodb = DynamoDBClient(this.options);
            // Servicio de dynamodb para obtener un item de una tabla por Id.
            const result = await dynamodb.get({
                TableName: TableName.People,
                Key: {
                    id
                }
            }).promise();

            return result.Item
        }
        catch (error) {
            throw error;
        }
    }

    async update(id, payload) {
        try {
            // Instanciar un cliente de dynamodb
            const dynamodb = DynamoDBClient(this.options);
            // Obtener valores del payload
            const { nombre, altura, masa, color_cabello, color_piel, color_ojos, fecha_nacimiento, genero } = payload;
            // Servicio de dynamodb para actualizar un item de una tabla por id.
            const res = await dynamodb.update({
                TableName: TableName.People,
                Key: {
                    id
                },
                UpdateExpression: 'set nombre = :nombre, altura = :altura, masa = :masa, color_cabello = :color_cabello, color_piel = :color_piel, color_ojos = :color_ojos, fecha_nacimiento = :fecha_nacimiento, genero = :genero',
                ExpressionAttributeValues: {
                    ':nombre': nombre,
                    ':altura': altura,
                    ':masa': masa,
                    ':color_cabello': color_cabello,
                    ':color_piel': color_piel,
                    ':color_ojos': color_ojos,
                    ':fecha_nacimiento': fecha_nacimiento,
                    ':genero': genero
                }
            }).promise();
            return {...payload, id};
        }
        catch (error) {
            throw error;
        }
    }

    async deleteOne(id) {
        try {
            // Instanciar un dynamodb cliente
            const dynamodb = DynamoDBClient(this.options);
            // Servicio de dynamodb para borrar un item por id de una tabla
            await dynamodb.delete({
                TableName: TableName.People,
                Key: {
                    id
                }
            }).promise();
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = new PeopleService();