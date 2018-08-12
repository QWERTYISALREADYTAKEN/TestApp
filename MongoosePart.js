const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
let bHash = require('./Helpers/BcryptToken_Pass.js');
let Schema = mongoose.Schema;

var url = process.env.MONGODB_URI || 'mongodb://localhost:27017/BudgetApp';
var dbName = 'BudgetApp';
var collectionName = 'BudgetApp';


//Schema defines structure of the document
//validators: min, max, minlength, maxlength, match
//unique makes sure that there is only one document with this value
//tokens is a mongodb attribute that defines users availabality to access different content with its allowances

//While Using Arrays... Arrays has to have their own schemas
var arraySchema = new Schema({
    object: {
        type: Object,
    }
})

//Adding String Password Values for test purposes... don't use this in real-life production
var userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        unique: true, 
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is already used'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 100,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    sex: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 65,
    },
    avIncome: {
        type: Number,
        default: 0,
    },
    setAvIncome: {
        type: Boolean,
        default: false,
    },
    data: {
        income: {
            type: Array,
            'default': [],
        },
        expenses: {
            type: Array,
            'default': [],
        }
    },
    tokens: [{
        access: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        }
    }]
});

//.add adds additional entries to the schema
userSchema.add({
    avIncome: {
        type: Number,
        default: 0,
    },
    setAvIncome: {
        type: Boolean,
        default: false,
    },
    avIncomeDescription: {
        type: String,
        default: 'No Description'
    },
    birthDay: {
        type: Number,
        required: true,
    },
    birthMonth: {
        type: Number,
        required: true, 
    },
    birthYear: {
        type: Number,
        required: true, 
    },
});

//Hashing could be done with schema.pre('save', function(next)), which always executes code before saving document to the database
//But this always launches before any access to the db. So it's necessary to check if password was modified and only after hash it
//Hashing Passwords
userSchema.methods.hash = async function(saltRounds, salt) {
    var r;
    try {
        if (this._doc.password) {
            r = await bHash.hash(this._doc.password, saltRounds, salt);
            this._doc.passString = this._doc.password;
            this._doc.password = r;
            return r;
        }
    } catch(err) {
        console.log(err);
    }
}

//Verifying Passwords
var compare = async function(pass, hash, saltRounds, salt) {
    var r;
    try {
        r = await bHash.compare(pass, hash, saltRounds, salt);
        return r;
    } catch(err) {
        console.log(err);
    }
}

//Generate Web Tokens
userSchema.methods.generateToken = async function(access, salt, meth = 'bt', saltRounds = 1) {
    try {
        var methods = {
            arguments: [{_id: this._id.toHexString(), access}],
        }

        var sign;
        var token;
        if (meth === 'bt') {
            methods.arguments.push(salt, saltRounds);
            token = await bHash.sign(...methods.arguments);
            this.tokens.push({access, token});
            return token;
        } else if (meth === 'jwt') {
            methods.arguments.push(salt);
            token = jwt.sign(...methods.arguments);
            this.tokens.push({access, token});
            return token;
        }
    } catch(err) {
        console.log(err);
    }
}

//Creating Method for model (not instances) with schema.statics
//While searching, wrapping object keys with '' lets us find something like parentObject.childObject values
userSchema.statics.findByToken = async function(token, salt, saltRounds, access = 'auth') {
    var r;
    try {
        var object = await bHash.verify(token, salt, saltRounds);
        return this.findOne({_id: object._id, 'tokens.access': access, 'tokens.token': token});
    } catch(err) {
        console.log(err);
    }
}

//Creating Mongoose model
var userModel = mongoose.model(dbName, userSchema);

mongoose.connect(url);

module.exports = {mongoose, userModel, compare};