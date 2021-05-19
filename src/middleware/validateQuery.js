function validateQuery(fields) {

    return (req, res, next) => {

        for(const field of fields) {
            if(!req.query[field]) { // Field isn't present, end request
                return res
                    .status(400)
                    .send(`${field} is missing`);
            }
        }

        next(); // All fields are present, proceed

    };

}

module.exports = validateQuery;