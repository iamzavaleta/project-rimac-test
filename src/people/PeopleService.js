const { v4 } = require("uuid");
const TableName = require("../shared/tableNames");
const { default: axios } = require("axios");
const externalApis = require("../shared/externalApis");
const DynamoDBClient = require("../shared/dynamoDBClient");

class PeopleService {
    options = {}

    constructor(){
        // Necessary for testing services
        /* if(process.env.JEST_WORKER_ID){
            this.options = {
                endpoint: 'http://localhost:8000',
                region: 'local-env',
                sslEnabled: false,
            };
        } */
    }

    async getAll() {
        try {
            // Instance a dynamodb client
            const dynamodb = DynamoDBClient(this.options);
            // Get all dynamodb documents
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
            // Get data from STAR WARS API
            const res = await axios.get(`${externalApis.STAR_WARS}/people`)
            return res.data.results
        }
        catch(error){
            throw error;
        }
    }

    async create(payload) {
        try {
            // Instance a dynamodb client
            const dynamodb = DynamoDBClient(this.options);
            // Get data from payload
            const { nombre, masa, altura, color_cabello, color_piel, color_ojos, fecha_nacimiento, genero } = payload;
            // Create an id from uuid package
            const id = v4()
            // Create people for create document after
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
            // Create dynamodb document
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
            // Instance a dynamodb client
            const dynamodb = DynamoDBClient(this.options);
            // Get dynamodb document from id
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
            // Instance a dynamodb client
            const dynamodb = DynamoDBClient(this.options);
            // Get data from payload
            const { nombre, altura, masa, color_cabello, color_piel, color_ojos, fecha_nacimiento, genero } = payload;
            // Update dynamodb document
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
            // Instance a dynamodb client
            const dynamodb = DynamoDBClient(this.options);
            // Delete dynamodb document
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