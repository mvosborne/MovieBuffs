// Loads data from a JSON API, gathers the paginated data together, and
// returns the loaded data to the callback function. Like d3.csv(), d3.tsv(),
// etc. The callback is passed an error message (if it occurs) and data. If the
// data is null, there was an error.
//
// APIs generally require parameters to be passed to the request for data, such
// as an API key. Pass those parameters as a JavaScript object to getData().
// For example:
//
//  {
//      api_key: value,
//  }
//
// There are two types of requests that can be made to a web server: GET and 
// POST. The first is used to just get data. The second is used to make changes
// on the server or more complicated requests. A GET request simply asks for
// data from a URL, while a POST sends data to the URL with the request, i.e, a
// POST has a message body being passed to the server. Parameters to a GET
// request are sent in the URL itself (see the formURL() function below).
//
// If the API you are using does not return paginated data, you can simply use
// d3.json(), like so:
//
//  var params = {
//      api_key: value,
//      other parameters, if necessary
//  }
//
//  d3.json(formURL(url, params), callback);
//
//
function getPaginatedData(url, params, callback){
    var loadedData = [];
    
    // We create a request object via d3.xhr(), passing in the URL we want to
    // request data from and telling it that we are expecting to get JSON
    // returned. Like other things in d3, too, we can call some functions on
    // the request object to further customize functionality.
    var request = d3.xhr(formURL(url, params), 'application/json')
    // You can pass in a function to .response(); this is a function called
    // when the request returns and can be used to parse the returned data
    // (which comes back as text in JSON format). We will use the built-in
    // JSON functionality of the browser to read the JSON text and convert it
    // to a JavaScript object.
        .response(toObject);
    
    // Converts JSON to a JavaScript object.
    function toObject(request){
        return JSON.parse(request.responseText);
    }
    
    // At this point, we've just created a request object that will request
    // JSON data from a URL and convert it into a JavaScript object, but 
    // haven't sent it on its way. Calling .get() actually makes the request to
    // the API. The .get() method takes a callback function that is called when
    // the request returns. loaded() is the callback we will use.
    function loaded(err, data){
        // There was an error loading the data. Call the original callback with
        // the error message and return.
        if(data == null){ callback(err, data); return; }
        
        // The API doesn't return all of the data at once. Instead, it returns
        // "pages", or chunks of data, one at a time to avoid sending a huge
        // file at once. You can choose what to do at this point: you can either
        // pass the data along to your visualization, one page at a time, and
        // incrementally draw it (the d3 data join is very helpful here), or
        // you can collect the data and return it all together when it has been
        // all loaded.
        
        // If you want to pass the data in chunks to your visualization,
        // uncomment this section:
        /**********************************************************************/
        ////The actual data is found in data.results; the rest of the request 
        ////was information to help pagination, etc.
        //callback(err, data.results);
        /**********************************************************************/
        
        // If you want to collect the data and then pass the complete data set
        // at once to your visualization, uncomment this section:
        /**********************************************************************/
        ////The actual data is found in data.results; the rest of the request 
        ////was information to help pagination, etc.
        //loadedData.concat(data.results);
        /**********************************************************************/
        
        // Check to see if there is more data to load. If so, we are going to 
        // make a recursive call to load more data.
        if(data.page != data.total_pages){
            // Add the new page to load to the parameters for the request.
            params['page'] = data.page + 1;
            // Create a new request object and send it.
            var request = d3.xhr(formURL(url, params), 'application/json')
                .response(toObject);
                .get(loaded);
        }
        // If you want to collect data and then pass the complete data set at
        // once to your visualization, uncomment this section:
        /**********************************************************************/        
        //else{
        //   // We are done loading data
        //   callback(err, loadedData);
        //}
        /**********************************************************************/
    }
    
    request.get(loaded);
}

// Given a base URL and an object with parameters, forms a URL that can be used
// for a GET request. The URL returned is of the form:
//
// <url>?param1=value&param2=value&param3=value
//
function formURL(url, params){
    var i = 0;
    for(var prop in params){
        if(params.hasOwnProperty(prop)){
            if(i == 0){
                url = url + "?";
            }
            else{
                url = url + "&";
            }
            
            url = url + "=" + params[prop];
        }
    }
    return url;
}
