export const validate = (schemas) => (req, res, next) => {
    try {
        ['params', 'query', 'body'].forEach((key) => {
            if (schemas[key]) {
                const { error, value } = schemas[key].validate(req[key], { abortEarly: false });
                if (error)
                    throw error;
                // replace with the parsed/typed value
                Object.assign(req[key], value);
            }
        });
        next();
    }
    catch (err) {
        res.status(400).json({
            message: 'Validation error',
            details: err.details.map((d) => d.message)
        });
    }
};
