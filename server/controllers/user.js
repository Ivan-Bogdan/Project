const User = require('../models/user');


exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'Войдите в кабинет'
            });
        }
        req.profile = user;
        next();
    });
};

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.update = (req, res) => {
    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $set: req.body },
        { new: true },
        (err, user) => {
            if (err) {
                res.status(400).json({
                    error: 'Вы не авторизованы для выполнения этих действий'
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        });
};

exports.addOrderUserHistroy = (req, res, next ) => {
    let history = [];
    req.body.order.products.forEach((element) => {
        history.push({
            _id: element._id,
            name: element.name,
            description: element.description,
            download: element.download,
            category: element.category,
            quantity: element.quantity,
            transaction_id: req.body.transaction_id,
            amount: req.body.order.amount
        })
    }); 
    User.findOneAndUpdate({_id: req.profile._id}, {$push: {history}}, {new: true},
        (error, data)=> {
            if(error) {
                return res.status(400).json({
                    error: 'Не удалось обновить историю'
                });
            }
            next();
        })
}