import config from "../config.json";


/**
 * url: string
 * method: string "GET", "POST"
 * options: Object { header: Object, body: string }
 *      header: { key: value }, value: string
 * callback: function
 *      argument: response: { status: number, text: string }
 *      callback is called when xhr.readyState == 4 (done)
 */

function request(url, method, options, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, config.hostOrigin + url, true);

    xhr.onreadystatechange = () => {
        // state 4: done
        if (xhr.readyState !== 4) {
            return;
        }
        if (callback) {
            const response = {
                status: xhr.status,
                text: xhr.responseText
            };
            callback(response);
        }
    };

    // if options provided
    if (options) {
        if (options.header) {
            // set headers
            for (const [key, value] of Object.entries(options.header)) {
                xhr.setRequestHeader(key, value);
            }
        }

        if (options.body) {
            xhr.send(options.body);
            return;
        }
    }
    
    xhr.send(); // if options.body not provided
}

export default request;