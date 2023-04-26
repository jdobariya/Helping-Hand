export function logger(req, res, next) {
    let userRole = 'Non-Authenticated User';
    if (req.session && req.session.user && req.session.user.role) {
        userRole = 'Authenticated User';
    }
    console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (${userRole})`);
    next();
}


// Add any middleware functions you need here.
