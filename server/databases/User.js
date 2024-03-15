const mongoose = require("mongoose")
const joi = require("joi")

const UserSchema = new mongoose.Schema({
	firstName:{ 
        type: String, 
        required: true 
    },
	lastName:{
        type: String, 
        required: true 
    },
	email:{ 
        type: String, 
        required: true 
    },
	password:{ 
        type: String, 
        required: true 
    },
	verified:{ 
        type: Boolean, 
        default: false 
    },
},{ versionKey: false });

const User = mongoose.model("user", UserSchema);

const validate = (data,usecase) => {
    var schema=null
    if(usecase!="authentification"){
        schema = joi.object({
            firstName: joi.string().required().label("First Name"),
            lastName: joi.string().required().label("Last Name"),
            email: joi.string().email().required().label("Email"),
            password:joi.string().required().label("Password"),
        });
    }
	else{
        schema = joi.object({
            email: joi.string().email().required().label("Email"),
            password:joi.string().required().label("Password"),
        });
    }
	return schema.validate(data);
};

module.exports = { User, validate };

//'joi' este un pachet folosit pentru a valida date de imput ale utilizatorilor sau request-uri de la 
//API's straine

//teste:
//.string() - verifica daca inputul este un string
//.email() - verifica daca inputul respecta structura unui email ( caracter '@' si nume de domeniu)
//.required() - verifica faptul ca a fost introdusa o valoare in campul respectiv (! undefined)