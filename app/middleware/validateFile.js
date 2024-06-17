export const validateFile = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.file)

        if (error) {
            const errorMessage = error.details
                .map((detail) => detail.message)
                .join('; ')
            return res.status(400).json({
                success: false,
                message: errorMessage,
            })
        }

        next()
    }
}

