import loginRoutes from './login.js'
import signUpRoutes from './signup.js'

const constructorMethod = (app) => {
    app.use('/home', (req, res) => {
        res.render('homepage', {
            title: "Helping Hands"
        })
    })
    app.use('/login', loginRoutes)
    app.use('/signup', signUpRoutes)
    
    app.use('*', (req, res) => {
        res.redirect('/home')
    })
}

export default constructorMethod;