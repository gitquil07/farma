export function getText(obj, keys){
    // Split lang route to parts (from string to array elems
    // console.log("textRouteBeforeSplitting", keys);
    const textRoute = keys.split(".");
    // console.log("textRoute", textRoute);

    // Get text from nested object
    let nested = {...obj};

    for(let i = 0; i < textRoute.length; i++){
        nested = nested[textRoute[i]];
        // console.log("current nested", nested);
    }

    const text = nested;

    return text;
}
