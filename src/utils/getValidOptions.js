export const getValidOptions = (items, allValidItems) => {
    const validRes = [];
    items?.forEach(itemLabel => {
        validRes.push(allValidItems.find(validItem => validItem.label == itemLabel));
    });
    return validRes;
}