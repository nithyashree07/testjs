const axios = require("axios");
let knex = require("knex")({
    client : 'mssql',
    connection : {
        server: 'localhost',
        user : 'root',
        password: 'nithyashree07@',
        database:'nvdcve' , 
        // options:{  
        // encrypt: false
        // }
    }
    
});
const readDataAndInsertIntoDB = () =>{
    return new Promise((resolve, reject)=> {
        axios.get("https://services.nvd.nist.gov/rest/json/cves/2.0")
        .then((result)=>{
            // console.log(result.data);
            const dataToBeInserted = result.data.vulnerabilities.map(column =>
                ({ id : column.cve.id})
                );
                //console.log("Test", dataToBeInserted);
                knex('vulnerabilities').insert(dataToBeInserted)
                .returning("id")
                .then((id)=>{
                    knex.destroy();
                    resolve(1);
                });
        });
    });
}
let temp = readDataAndInsertIntoDB();
temp.then((result)=>{
    if(result===1){
        console.log("Data is successfully inserted");
    }else{
        console.log("There is an error inserting data");
    }
});