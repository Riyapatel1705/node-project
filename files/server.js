const express = require("express");
const app = express();
const PORT = process.env.PORT || 9000;
const joi = require("joi");
const cors = require("cors");

app.use(express.json());
app.use(cors());

const checkEmail = (value, helpers) => {
    const parts = value.split("@");
    const firstName = helpers.state.ancestors[0].firstName.toLowerCase();
    if (parts[0].toLowerCase() !== firstName) {
        return helpers.message(`The first word before @ must be your name`);
    }
    return value;
};

const users = [
    { firstName: "kavya", lastName: "patel", email: "kavya@gmail.com", age: 22, phoneNo: "+919313145340", gender: "female", address: "501,jasmine Residency,Gandhinagar, Gujrat, India,382010", password: "123@Abcd",joinedDate:'2024/12/19' },
    { firstName: "purvi", lastName: "patel", email: "purvi@gmail.com", age: 23, phoneNo: "+919112458970", gender: "female", address: "706,new green Residency,Rajkot, Gujarat, India,360001", password: "345@wxyz",joinedDate:'23/01/2024' }
];

//Function to validate phone number based on country
const validatePhonenumber = (value, helpers) => {
    const formattedPhone = value.replace(/\s+/g, ""); // Remove spaces

    //  Allowed country and phone number mapping
    const countryPhoneMap = {
        "india": "+91",
        "canada": "+1",
        "usa": "+1",
        "united states": "+1",
        "uk": "+44",
        "united kingdom": "+44",
        "australia": "+61"
    };

    // Extract country from Address
    const addressLower = helpers.state.ancestors[0].address.toLowerCase();
    const country = Object.keys(countryPhoneMap).find(c => addressLower.includes(c));

    if (!country) {
        return helpers.message(`Address must contain a valid country (India, Canada, USA, UK, Australia)`);
    }

    const expectedCode = countryPhoneMap[country];

    //  Check if phone number starts with the expected code
    if (!formattedPhone.startsWith(expectedCode)) {
        return helpers.message(`Phone number must start with ${expectedCode} for ${country}`);
    }

    //  Validate phone number length
    const phonePatterns = {
        "+91": /^\+91\d{10}$/,
        "+1": /^\+1\d{10}$/,
        "+44": /^\+44\d{10}$/,
        "+61": /^\+61\d{9}$/
    };

    if (!phonePatterns[expectedCode].test(formattedPhone)) {
        return helpers.message(`Invalid phone number format for ${country}`);
    }

    return formattedPhone;
};

// Joi Schema for Validation
const require_params = joi.object({
firstName: joi.string().min(3).max(8).pattern(/^[a-z]+([A-Z][a-z]*)*$/).required(),
lastName: joi.string().min(3).max(8).pattern(/^[a-z]+([A-Z][a-z]*)*$/).required(),
    email: joi.string().email({ tlds: { allow: ["com"] } }).min(13).max(25).custom(checkEmail).required(),
    age: joi.number().integer().min(21).max(45).optional(),
    phoneNo: joi.string().required().custom(validatePhonenumber),
    gender: joi.string().valid("female", "male").required(),
    password: joi.string()
    .min(8)
    .pattern(/[A-Z]/) // At least one uppercase letter
    .pattern(/\d/) // At least one digit
    .pattern(/[@$!%*?&]/) // At least one special character
    .required(),
    joinedDate:joi.date().custom((value,helpers)=>{
        if(new Date(value).getFullYear()<2000||new Date(value).getFullYear()>2025){
            return helpers.message('start date must be after the year 2000 and before year 2025');
        }
        return value;
    }).required(),
    address: joi.string().min(15).max(60).required().custom((value, helpers) => {
        const addressLower = value.toLowerCase();
        if (!addressLower.includes("india") && 
            !addressLower.includes("canada") &&
            !addressLower.includes("usa") &&
            !addressLower.includes("united states") &&
            !addressLower.includes("uk") &&
            !addressLower.includes("united kingdom") &&
            !addressLower.includes("australia")) {
            return helpers.error("any.invalid", { message: "Address must be in India, Canada, USA, UK, or Australia" });
        }
        if (addressLower.includes("india") && !addressLower.includes("gujrat")) {
            return helpers.error("any.invalid", { message: "For India, the state must be Gujarat" });
        }
        return value;
    })
});

// API to Check if User Exists
app.post("/check-user", (req, res) => {
    const { error } = require_params.validate(req.body);

    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }   
    const userFound = users.find(user =>
        user.firstName.toLowerCase() === req.body.firstName.toLowerCase() &&
        user.lastName.toLowerCase() === req.body.lastName.toLowerCase() &&
        user.email.toLowerCase() === req.body.email.toLowerCase() &&
        user.gender.toLowerCase() === req.body.gender.toLowerCase() &&
        user.address.toLowerCase() === req.body.address.toLowerCase() &&
        user.phoneNo.replace(/\s/g, "") === req.body.phoneNo.replace(/\s/g, "") &&
        user.password === req.body.password
        && user.joinedDate===req.body.joinedDate
    );

    if (userFound) {
        return res.status(200).json({ success: true, message: "User found!" });
    } else {
        return res.status(404).json({ success: false, message: "User not found!" });
    }
});

// API to Add User with Phone Number and Address Validation
app.post("/add-user", (req, res) => {
    const { phoneNo, password } = req.body;

    //  Check for duplicate phone numbers
    const isDuplicatePhone = users.some(user => 
        user.phoneNo.replace(/\s+/g, "").toLowerCase() === phoneNo.replace(/\s+/g, "").toLowerCase()
    );
    const isDuplicatepassword=users.some(user=>
        user.password===password
    );
    if(isDuplicatepassword){

    return res.status(400).json({ success: false, message: "password already exists! Please use a unique password." });
    }
    if (isDuplicatePhone) {
        return res.status(400).json({ success: false, message: "Phone number already exists! Please use a unique number." });
    }

    //  Validate user input
    const { error } = require_params.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

    users.push(req.body);
    return res.status(201).json({ success: true, message: "User added successfully!", users });
});

//  Start the Server
app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
});
