export const typeDefs = `
    enum Gender {
        MALE
        FEMALE
    }

    type User {
        id: ID!
        username: String!
    }

    type Patient {
        id: ID!
        name: String!
        age: Int!
        gender: Gender!
        doctor: User!
        vitals: [Vital!]!
    }

    type Vital {
        id: ID!
        deviceId: String!
        heartRate: Int!
        oxygenLevel: Float!
        bodyTemperature: Float!
        steps: Int!
        timestamp: String!
        patient: Patient!
    }

    type Query {
        patients: [Patient!]!
    }

    type Subscription {
        liveVitals: Vital!
    }
`;
