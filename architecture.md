### Youtube Link

https://youtu.be/UN_tiaSCL-4

### Database Schema

The database schema contains the following tables:

```sql
-- User table
User {
  id        Int
  username  String
  password  String
}

-- Patient table
Patient {
  id         Int
  name       String
  age        Int
  gender     Gender
  doctor_id  Int
}

-- Vitals table
Vitals {
  id               Int
  heart_rate       Int
  oxygen_level     Float
  body_temperature Float
  steps            Int
  timestamp        Date
  patient_id       Int
  device_id        String
}
```

### Cloud Mapping

## Database

For the database deployment Amazon RDS (PostgreSQL) was used. It is very secure and persistent with managed backups.

## Api Hosting

For the api hosting with node and graphql the best option is AWS Elastic Beanstalk.
This one is perfect for the GraphQL queries, REST endpoints, and WebSocket Subscriptions.
It contains auto-scaling in case our app is very used.

## Node-Red

For the deployment of the node-red the best option is Amazon EC2.
This is a virtual machine in the cloud that works like a remote computer.
It let us install and run anything you need, such as Node-RED.
EC2 is used to host the Node-RED editor and dashboard so it can stay running 24/7.

## IoT Messaging Layer

For the messaging layer of the IoT devices the best option is to continue using AWS with IoT Core.
This is like HiveMQ but in AWS.
It is currently connected on IoT Core for the proyect.
