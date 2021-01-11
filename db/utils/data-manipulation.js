

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

module.exports = { changeTimeStamp, formatDataTimeStamp };