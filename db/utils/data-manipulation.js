

const changeTimeStamp = (time) => {
    const newDate = new Date(time);
    return newDate;
}

const formatDataTimeStamp = (rawData, timeStampFunc) => {
    const newArr = [];
    for (let article of rawData) {
        const newObj = { ...article };
        newObj.created_at = timeStampFunc(article.created_at);
        newArr.push(newObj);
    }
    return newArr;
}

const createArticlesLookup = (articlesRows) => {
    const lookupObj = {};
    for (let article of articlesRows) {
        lookupObj[article.title] = article.article_id};
    return lookupObj;
}

module.exports = { changeTimeStamp, formatDataTimeStamp, createArticlesLookup };