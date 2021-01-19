exports.homepage = (req, res, next) => {
    res.status(200).send({ msg: 'welcome to the nc-news-st homepage, please see the documentation for further requests' });
};