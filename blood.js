import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongodb from "mongodb";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
var MongoClient = mongodb.MongoClient;

import mongoose from "mongoose";
mongoose.connect("mongodb://0.0.0.0:27017/bloodDonation")
.then(()=>{
    console.log('mongodb connected')
})
.catch(()=>{
    console.log('error')
})
var real_name
var date_chosen
var gender_chosen
var password_chosen
var bloodgroup_chosen
var country_chosen
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/blood.html");
 
});
app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/login.html");
 
});
app.post("/submit",(req,res) => {
     real_name=req.body["donor_name"];
     date_chosen=req.body["Date"];
     gender_chosen=req.body["gender"];
     password_chosen=req.body["password"];
     bloodgroup_chosen=req.body["Bloodgroup"];
     country_chosen=req.body["country"];
     const dataSchema=new mongoose.Schema({
        name:{
            type:String,
            require:true
        },
        dateselect:{
            type:String,
            require:true
        }
        ,gender:{
            type:String,
            require:true
        },
        password:{
            type:String,
            require:true
        },
        Bloodgroup:{
            type:String,
            require:true
        },
        country:{
            type:String,
            require:true
        },
    })
    
    const donordata=new mongoose.model("donordata",dataSchema)
     const donor1= new donordata({
        name:real_name,
        dateselect:date_chosen,
        gender:gender_chosen,
        password:password_chosen,
        Bloodgroup:bloodgroup_chosen,
        country:country_chosen
    
    });
    
    donordata.insertMany([donor1]);
    res.sendFile(__dirname + "/blood.html");

})
app.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
 
});

app.get("/about", (req, res) => {
    res.sendFile(__dirname + "/about.html");
 
});
app.post("/check",(req,res) => {
    var log_name=req.body["name_log"];
    var log_password=req.body["password_log"];
    console.log(log_name);
    console.log(log_password)
    var nameret
    var passwordret
    var genderret
    var bloodgroupret
    var dateret
    var url = "mongodb://0.0.0.0:27017/";
    const databasename = "bloodDonation";  // Database name
    MongoClient.connect(url).then((client) => {
    
        const connect = client.db(databasename);
    
        // Connect to collection
        const collection = connect
            .collection("donordatas");
    
        collection.find({}).toArray().then((ans) => {
            console.log(ans);
            for (var i=0;i<ans.length;i++)
            {
                if(ans[i].name==log_name)
                {
                    nameret=log_name
                    passwordret=ans[i].password
                    dateret=ans[i].dateselect
                    genderret=ans[i].gender
                    bloodgroupret=ans[i].Bloodgroup
                }
            }
            console.log("nameretrival:"+nameret)
            console.log("passwordretival"+passwordret)
            const userdata={
                username:nameret,
                userbloodgroup:bloodgroupret,
                userdateselected:dateret,
                usergenderchosen:genderret

            }
            if(log_name==nameret && log_password==passwordret)
            {
                console.log("successfully done")
                res.render("index.ejs",userdata);
            }
            else
            {
                res.sendFile(__dirname + "/signup.html");
            }
            
        });
    }).catch((err) => {
    
        // Printing the error message
        console.log(err.Message);
    })
    
});
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
