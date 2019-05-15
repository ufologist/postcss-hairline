/**
 * 获取伪元素的选择器
 * 
 * @param {Array<string>} selectors 
 * @param {string} pseudo 
 * @param {boolean} merge 
 */
function getPseudoSelector(selectors, pseudo, merge) {
    pseudo = pseudo || 'after';

    var pseudoSelectors = selectors.map(slt => `${slt}::${pseudo}`);
    return merge ? pseudoSelectors.join(',') : pseudoSelectors;
}

function unique(list) {
    const table = {};
    return list.reduce((c, item) => {
        if (!table[item]) {
            table[item] = true;
            c.push(item);
        }
        return c;
    }, []);
}

module.exports = {
    getPseudoSelector,
    unique
};

