const jsf = require("json-schema-faker"); // json-schema faker
jsf.extend('faker', () => require('faker'));
const fs = require("fs"); // nodeJS file system library to read and write files

var memoSchema = {
    "type": "object",
    "properties": {
        "memos": {
            "type": "array",
            "minItems": 10000,
            "maxItems": 10050,
            "items": {
                "type": "object",
                "properties": {
                    "user_senior": {
                        "type": "boolean",
                        "faker": "random.boolean"
                    },
                    "memo_title": {
                        "type": "string",
                        "faker": "random.words"
                    },
                    "memo_description": {
                        "type": "string",
                        "faker": "lorem.paragraph"
                    },
                    "memo_topic": {
                        "type": "string",
                        "pattern": "management|career|health|social|relationships"
                    },
                    "company_name": {
                        "type": "string",
                        "faker": "company.companyName"
                    },
                    "company_description": {
                        "type": "string",
                        "faker": "company.bs"
                    },
                    "memo_likenum": {
                        "type": "integer",
                        "faker": "random.number",
                        "minimum": 0
                    },
                    "memo_dislikenum": {
                        "type": "integer",
                        "faker": "random.number",
                        "minimum": 0
                    },
                    "user_position": {
                        "type": "string",
                        "faker": "name.jobTitle"
                    },
                    "company_industry": {
                        "type": "string",
                        "faker": "name.jobArea"
                    },
                    "user_gender_female": {
                        "type": "boolean",
                        "faker": "random.boolean"
                    },
                    "user_avatar": {
                        "type": "string",
                        "faker": "image.avatar"
                    },
                    "user_country": {
                        "type": "string",
                        "faker": "address.country"
                    },
                    "user_city": {
                        "type": "string",
                        "faker": "address.city"
                    },
                    "user_name": {
                        "type": "string",
                        "faker": "internet.userName"
                    },
                    "user_age": {
                        "type": "integer",
                        "minimum": 18,
                        "maximum": 120
                    },
                },
                "required": ["user_senior", "memo_title", "memo_description", "memo_topic", "company_name", "company_description", "memo_likenum", "memo_dislikenum", "user_position", "company_industry", "user_gender_female", "user_avatar", "user_country", "user_city", "user_name", "user_age"]
            }
        }
    },
    "required": ["memos"]
};

var fakeData = jsf(memoSchema);
fs.writeFile("memos.json", JSON.stringify(fakeData), function (err) {
    if (err) {
        return console.log(err);
    } else {
        console.log("Mock data generated.");
    }
});