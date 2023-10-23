class ErrorApp extends Error {
  constructor(statusCode, message) {
    //* Digunakan untuk memanggil constructor dari class Error 
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = ErrorApp;