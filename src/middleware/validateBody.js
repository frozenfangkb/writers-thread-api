function validateBody(fields) {

    return (req, res, next) => {

        for(const field of fields) {
            if(!req.body[field]) { // Field isn't present, end request
                return res
                    .status(400)
                    .send(`${field} is missing`);
            }
        }

        next(); // All fields are present, proceed

    };

}

module.exports = validateBody;