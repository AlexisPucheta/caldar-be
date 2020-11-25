/*

Entity fields:
- _id: mongo id
- name: string
- address: string
- boilers: array of mongo ids
- company: mongo id

Controller functions:
- getBuildingsAll ==> GET 'api/building'
- getBuildingById ==> GET 'api/building/:id'
- getBuildingsByAttribute ==> GET 'api/building?attrKey=attrValue'
- deleteBuildingById ==> DELETE 'api/building/:id'

*/