const {mongoose, userModel} = require('../Server/MongoosePart.js');
const testNames = require('./TestNames.js');
let bHash = require('../Helpers/BcryptToken_Pass.js');

const salt = 'youShallNotPass';

var createDb = async(n) => {
    for (var i = 0; i < n; i++) {
    
        var {rand, birthYear, sex, name, lastName, emailLast} = testNames.userCreate(testNames);

        var newUser = new userModel({
            userName: name+rand,
            email: `${name}.${lastName}${rand}@${emailLast}`,
            password: `${name}${birthYear}`,
            sex: sex,
            firstName: name,
            lastName: lastName,
            age: rand,
            birtYear: birthYear,
            comment: 'Too Lazy To Comment'
        });

        try {
            var r = await newUser.generateToken('auth',salt, 'bt', 1);
            r = await newUser.hash(10, salt);
            r = await newUser.save();
            var check = await bHash.verify(r._doc.tokens[0].token, salt, 1);
            
            var check = await bHash.compare(r._doc.passString, r._doc.password, 10, salt);
            //Removing Some parts of returned doc
            newUser.objectFilter('sec',r._doc, 'email', 'password');
            console.log(r);
            if (check && check === false) {
                break;
                throw new Error('Match Failed');
            }
        } catch(err) {
            console.log(err);
        }
    }
}

var accessDb = async () => {
    
}

//createDb(100);
accessDb();

module.exports = {createDb};