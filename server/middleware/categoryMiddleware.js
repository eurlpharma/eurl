// Middleware to remove 'name' field from category requests
const removeNameField = (req, res, next) => {
  // Log the request body before cleaning
  console.log('Request body before cleaning:', req.body);
  
  // Remove name field from body
  if (req.body && req.body.name !== undefined) {
    delete req.body.name;
    console.log('Removed name field from request body');
  }
  
  // Also check if there are any other references to 'name' in the body
  const bodyKeys = Object.keys(req.body);
  console.log('Body keys after cleaning:', bodyKeys);
  
  next();
};

export { removeNameField }; 