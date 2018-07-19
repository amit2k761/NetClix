//for authorisation
const jwt = require('jsonwebtoken');
const config = require('config');
function auth(req,resp,next){
   const token= req.header('x-auth-token');
   if(!token) 
      return resp.status(401).send('access denied no token provided');
      
    try{
const decoded = jwt.verify(token,config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
}
catch(err){
        resp.status(400).send('invalid token');
    }

   
}
module.exports = auth;