const jwt = require('jsonwebtoken');
const isAdmin = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({ error: 'Unauthorized' });

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id= process.env.ADMIN_ID;
        if(decoded.Id !== id){
            return res.status(401).json({ error: 'Unauthorized' });   
        }
        next();
    }catch(err){
        console.error(err);
        res.status(401).json({ error: 'Invalid token' });
    }
}
module.exports.isAdmin = isAdmin;