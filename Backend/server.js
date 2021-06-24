let express = require('express');
let mysql = require('mysql');
var mycrypto=require('crypto');
var key="password";
var algo='aes256';
var jwt=require('jsonwebtoken');
var jwtkey='jwtkey';


let app = express();
app.use(express.json());

let db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "times_gmit",
});


// //for signup in mysql
// app.post("/newsignup",async (req,res)=>{
// let {email, mobile, password} = req.body;

// db.query('INSERT INTO gmit2018cse (email, mobile, password) VALUES (?,?,?)',
// [email, mobile, password],
// (err,result)=>{
//     if(err){
//         res.status(422).send({err:err})
//     }else{
//         res.status(201).send({message:'Your data inserted succesfully'})
//     }
// })
// });


// for signup using encryption

app.post("/signupenc",async (req,res)=>{

    let {email, mobile, password} = req.body;
    var myCipher= mycrypto.createCipher(algo,key);
    // encrypt the password Advanced Encryption Standard 256 using UTF8 & hex 
    var encpass=myCipher.update(password,'utf8','hex')
    +myCipher.final('hex');


    db.query('INSERT INTO user_details (email, mobile, password) VALUES (?,?,?)',
    [email, mobile, encpass],
    (err,result)=>{
        if(err){
            res.status(422).send({err:err})
        
        }else{
            console.log("SignupSucessful");  
            res.status(201).send({message:'Your data inserted succesfully'})
        }
    });
    

    });


//for login using encrypted password
app.post('/newlogin', function (req, res) {
    
    let {email, password} = req.body;
    var myCipher= mycrypto.createCipher(algo,key);
    var encpass=myCipher.update(password,'utf8','hex')
    +myCipher.final('hex')

    db.query('SELECT * FROM user_details WHERE email=?',
        [email],
        (err,result)=>{
            if(err){
                res.send({ err: err })
            }
            
            if(result.length>0 && result[0].password == encpass){
                
                console.log(result[0].password);
                let { email, password } = result[0]
                var user = {
                    userEmail: email,
                    userPassword: password,
                }

                const tokenCode = jwt.sign(user, "secretKey");
                res.status(200).send({ access: tokenCode })
                console.log("login Successfull");
                //window.alert("login Successfull");
                
            }
            else {
                res.status(404).send({ message: 'Invalid Credential' });

               console.log("database pass ", result[0].password);
               console.log("given pass ", encpass);

            }
        }

    )
})






// var myApp = require('express');
// var app=myApp();
// app.use(myApp.json());
// var mongooseApp = require('mongoose');
// var myModel = require('./MONGOOSE/model/CSE');
// var mycrypto=require('crypto');
// var key="password";
// var algo='aes256';
// var jwt=require('jsonwebtoken');
// var jwtkey='jwtkey';


// mongooseApp.connect('mongodb+srv://Abir123456:AbirN123456@cluster0.jged0.mongodb.net/GMIT?retryWrites=true&w=majority',{
//     useNewUrlParser:true,
//     useUnifiedTopology: true    
// }).then(()=>{
//     console.log("Connected")
// });


// // //for signup
// // app.post('/newsignup',function(req,res){
// //   let {email, mobile, password} = req.body;

// //     const data=new myModel({
// //       _id:new mongooseApp.Types.ObjectId(),
// //       email,mobile,password

// //   });
// //   data.save().then((result)=>{
// //       res.status(201).json(result)
// //   })
// //   .catch(err=>console.log(err))

// // })




// //for signup using encrypted password
// app.post('/signupenc',function(req,res){

//     let {email, mobile, password} = req.body;
//     var myCipher= mycrypto.createCipher(algo,key);

//     // encrypt the password Advanced Encryption Standard 256 using UTF8 & hex 
//     var encpass=myCipher.update(password,'utf8','hex')
//     +myCipher.final('hex');

//     const newdata=new myModel({
//         _id: mongooseApp.Types.ObjectId(),
//         email,mobile,password:encpass
//     });
//     newdata.save().then((result)=>{
//         res.status(201).json(result)
//     })

//     .catch(err=>console.log(err))

// })



// //for login using encrypted password
// app.post('/loginenc', function (req, res) {
    
//     let {email, password} = req.body;
//     myModel.findOne({email}).then((data) => {
       
//         var decipher = mycrypto.createDecipher(algo, key);
//         var decryptedPassword = decipher.update(data.password, 'hex', 'utf8' )+ 
//         decipher.final('utf8');
//         console.log(decryptedPassword);
//         if(decryptedPassword==password){
//             jwt.sign({data},jwtkey,{expiresIn:'180s'},(err,result)=>{
//                 res.status(200).json({result})
//                 console.log("Password Matched ");
//             })
//             // console.log({result});
//         }
//         else{
//             console.log("Invalid Credential ");
//         }
//     });
// })

// //for Axios login using encrypted password
// app.post("/axioslogin", function (req, res) {

//     let { email, password } = req.body;
//     myModel.findOne({ email }).then((data) => {

//         var decipher = mycrypto.createDecipher(algo, key);
//         var decryptedPassword = decipher.update(data.password, 'hex', 'utf8' )+ 
//         decipher.final('utf8');
//         console.log(decryptedPassword);
//         if (password == decryptedPassword) {
//             jwt.sign({ data }, jwtkey, { expiresIn: '180s' }, (err, result) => {
//                 res.status(200).json({ result })
//                 console.log("login Sucessful")
//             })
//         }
//         else{
//             console.log("Invalid Credential ");
//         }

        
//     });
// })



app.listen(4780,()=>{
console.log("server is running on port 4780");
})