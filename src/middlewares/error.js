const errorMiddleware = (err, req, res, next) => {
  let statusCode =
    err.statusCode || (res.statusCode == 200 ? 500 : res.statusCode);
  let errorMessage =
    err.message || "Something went wrong, please try again later";

  // Handling Mongoose validation errors
  if (err.errors) {
    const errorFields = Object.keys(err.errors);
    errorFields.forEach((field) => {
      if (
        field === "email" ||
        field === "username" ||
        field === "phoneNumber" ||
        field === "paymentType" ||
        field === "status" ||
        field === "password"
      ) {
        errorMessage = err.errors[field].message;
        statusCode = 400;
      }
    });

    // Handling Mongoose CastError for fare
    const { fare } = err.errors;
    if (fare && fare.name === "CastError") {
      errorMessage = "fare should be a number";
      statusCode = 400;
    }
  }

  // Handling MongoDB duplicate key error
  if (err.code === 11000) {
    const { email, phoneNumber, plateNumber } = err.keyValue;
    if (email) {
      errorMessage = "User with this email already exists";
    }
    if (phoneNumber) {
      errorMessage = "User with this phone number already exists";
    }
    if (plateNumber) {
      errorMessage = "Plate number already taken";
    }
    statusCode = 400;
  }

  res.status(statusCode).json({ message: errorMessage });
};

export default errorMiddleware;
