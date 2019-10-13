const GEO = "geo";
const LOCATION = GEO;
const TOPIC = "topic";
const SEARCH = "search";
const TOP_NEWS = "top-news";
const HIGHLIGHTS = TOP_NEWS;

const _generateGoogleFeedURL = function(method, query, locale){
	let feedUrl = "https://news.google.com/rss";
	method = method ? method.toLowerCase() : method;
	if(method && method === "topic") query = query.toUpperCase();
	switch(method){
		case "geo":
		case "topic":
			feedUrl += "/headlines/section/"+method.toLowerCase()+"/"+query+"?";
			break;
		case "search":
			feedUrl += "/search?q="+query+"&";
			break;
	}

	let location = locale.split('-');
	let countryCode = location[1].toUpperCase();
	feedUrl += "hl="+locale+"&gl="+countryCode+"ceid="+countryCode+":"+location[0].toLowerCase();
	return feedUrl;
};

/**
 * Get Google's News Feed
 * returns a promise with a JSON response, call also be used with callback(err, response)
 * supports locale, defaults to "en-GB"
 *
 * @param method
 * @param query
 * @param locale
 * @param callback
 * @returns {Promise<object>}
 */
const getNews = async function(method, query, locale, callback){
	return new Promise((resolve, reject) => {
		const regExp = new RegExp(/^([\w]{2})-([\w]{2})/g);
		if(!(locale && regExp.test(locale))) locale = "en-GB";
		const feedUrl = _generateGoogleFeedURL(method, query, locale);

		// noinspection JSUnresolvedFunction
		const Feed = require('rss-to-json');
		// noinspection JSUnresolvedFunction
		Feed.load(feedUrl, function(err, rss){
			if(typeof callback === "function") callback(err, rss);
			err ? reject(err) : resolve(rss);
		});
	});
};

module.exports = { HIGHLIGHTS, TOP_NEWS, LOCATION, SEARCH, TOPIC, GEO, getNews };