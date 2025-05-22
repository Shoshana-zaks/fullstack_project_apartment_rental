import jwt from 'jsonwebtoken';

export const checkToken = (req, res, next) => {
    const token = req.headers['authorization'];
    console.log("middleware checkToken הופעל");
    console.log("אסימון שהתקבל:", token);

    if (!token) {
        console.log("אסימון לא קיים");
        return res.status(403).send({ error: 'Token is required' });
    }

    try {
        const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;
        console.log("אסימון לאחר הסרת 'Bearer ':", tokenWithoutBearer);
        const decoded = jwt.verify(tokenWithoutBearer, process.env.SECRET);
        console.log("אסימון מפוענח:", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("שגיאה באימות אסימון:", err);
        return res.status(401).send({ error: 'Invalid or expired token' });
    }
};