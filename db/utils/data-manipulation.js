

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

const formatArticlesData = (rawCommentsData, articleLookup) => {
    // for each object in the array
    // body - unchanged
    // belongs to - change to article_id: 1 using lookup object
    // created_by - change key to author
    // votes - unchanged
    // created_at - use the change time stamp function
    // create the object then push to a new array
    const newArr = [];
    for (let comment of rawCommentsData) {
        const newObj = {};
        newObj.body = comment.body;
        newObj.article_id = articleLookup[comment.belongs_to];
        newObj.author = comment.created_by;
        newObj.votes = comment.votes;
        newObj.created_at = changeTimeStamp(comment.created_at);
        newArr.push(newObj);
    }
    return newArr;
}

module.exports = { changeTimeStamp, formatDataTimeStamp, createArticlesLookup, formatArticlesData };