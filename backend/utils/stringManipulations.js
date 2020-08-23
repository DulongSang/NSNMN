function generateHint(word) {
    let hint = "";
    
    for(let i = 0; i < word.length; i++) {
        if (word[i] === " ") {
            hint += " ";
        } else {
            hint += "_";
        }
    }

    return hint;
}

/*
 * Replace the chars at the particular index in original with replace
 * e.g. replaceAt("apple", "c", 2) => "apcle"
 */
function replaceAt(original, replace, index) {
    return original.substr(0, index) + replace + original.substr(index + replace.length);
}


module.exports = {
    generateHint,
    replaceAt
};