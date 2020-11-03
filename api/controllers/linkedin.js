const https = require('https');
const url = require('url');

const auth_base_url = process.env.AUTH_BASE_URL;
const client_id = process.env.LINKEDIN_CLIENT;
const client_secret = process.env.LINKEDIN_SECRET;
const redirect_uri = process.env.REDIRECT_URL;
const front_base_url = process.env.FRONT_BASE_URL;
const response_type = 'code';
const state = Math.random(); // WARNING: using weak random value for testing ONLY
const scope = 'r_liteprofile r_emailaddress w_member_social';

var linkedin = {
    _request: function(method, hostname, path, headers, body){
        return new Promise((resolve,reject) => {
            let reqOpts = {
                method,
                hostname,
                path,
                headers,
                "rejectUnauthorized": false // WARNING: accepting unauthorized end points for testing ONLY
            };
            let resBody = "";
            let req = https.request(reqOpts, res => {
                res.on('data', data => {
                    resBody += data.toString('utf8');
                });
                res.on('end', () => {
                    resolve({
                        "status": res.statusCode, 
                        "headers": res.headers, 
                        "body": resBody
                    })
                });
            });
            req.on('error', e => {
                reject(e);
            });
            if (method !== 'GET') {
                req.write(body);
            }
            req.end();
        })
    },
    getAccessToken: function(req, res) {
        let auth_url = auth_base_url + '?response_type=' + response_type + '&client_id=' + client_id + '&redirect_uri=' + encodeURIComponent(redirect_uri) + '&state=' + state + '&scope=' + encodeURIComponent(scope);
        console.log(auth_url);
		res.status(302).send({'Location': auth_url})
    },
    authenticate: function(req, res){
        let req_pathname = url.parse(req.url, true).pathname;
        let req_query = url.parse(req.url, true).query;
        console.log(req_pathname, req_query);

        let path_query = 
			"grant_type=authorization_code&"+
			"code=" + req_query.code + "&" +
			"redirect_uri=" + encodeURIComponent(redirect_uri) + "&" + // will redirect here if authentication fails
			"client_id=" + client_id + "&" +
			"client_secret=" + client_secret;

		let method = 'POST';
		let hostname = 'www.linkedin.com';
		let path = '/oauth/v2/accessToken?' + path_query;
		let headers = {
			"Content-Type": "x-www-form-urlencoded"
		};
        let body = '';
        
        this._request(method, hostname, path, headers, body).then(r => {
			if(r.status == 200){
				let access_token = JSON.parse(r.body).access_token;
				let expires_in = Date.now() + (JSON.parse(r.body).expires_in * 1000); // token expiry in epoc format
				token_json = '{"access_token":"' + access_token + '","expires_in":"' + expires_in + '"}';
				console.log('Access token retrieved.', token_json);
				res.redirect(`${front_base_url}/auth/linkedin?token=${access_token}`);
			}
			else {
				console.log('ERROR - ' + r.status + JSON.stringify(r.body))
				res.status(r.status).send("Getting Access token failed!");
			}

		}).catch(e => {
			console.log('ERROR - ' + e);
			res.status(500).send("Internal Server Error")
		});
    },
    shareContent: function(req, res) {
        
        const accessToken = req.body.accessToken;
        const title = req.body.title;
        const text = req.body.text;
        const shareUrl = req.body.shareUrl;
        const shareThumbnailUrl = req.body.shareThumbnailUrl;

        this.getLinkedinId(accessToken)
        .then(ownerId => {
            this.postShare(accessToken, ownerId, title, text, shareUrl, shareThumbnailUrl)
            .then(r => {
                console.log(r); // status 201 signal successful posting
                res.status(200).send(r);
            })
            .catch(e => {
                console.log(e)
                res.status(403).send("Sharing post failed");
            });
        })
        .catch(e => {
            console.log(e)
            res.status(403).send("Getting UserId failed");
        });
    },

    getLinkedinId: function(accessToken) {
        return new Promise((res, rej) => {
            let hostname = 'api.linkedin.com';
            let path = '/v2/me';
            let method = 'GET';
            let headers = {
                'Authorization': 'Bearer ' + accessToken,
                'cache-control': 'no-cache',
                'X-Restli-Protocol-Version': '2.0.0'
            };
            let body = ''
            this._request(method, hostname, path, headers, body).then(r => {
                res(JSON.parse(r.body).id)
            }).catch(e => rej(e))
        })
    },

    postShare: function(accessToken, ownerId, title, text, shareUrl, shareThumbnailUrl) {
        return new Promise((res, rej) => {
            let hostname = 'api.linkedin.com';
            let path = '/v2/shares';
            let method = 'POST';
            let body = {
                "owner": "urn:li:person:" + ownerId,
                "subject": title,
                "text": {
                    "text": text // max 1300 characters
                },
                "content": {
                    "contentEntities": [{
                        "entityLocation": shareUrl,
                        "thumbnails": [{
                            "resolvedUrl": shareThumbnailUrl
                        }]
                    }],
                    "title": title
                },
                "distribution": {
                    "linkedInDistributionTarget": {}
                }
            }
            let headers = {
                'Authorization': 'Bearer ' + accessToken,
                'cache-control': 'no-cache',
                'X-Restli-Protocol-Version': '2.0.0',
                'Content-Type': 'application/json',
                'x-li-format': 'json',
                'Content-Length': Buffer.byteLength(JSON.stringify(body))
            };
            this._request(method, hostname, path, headers, JSON.stringify(body)).then(r => {
                res(r);
            }).catch(e => rej(e))
        })
    }
}

module.exports = linkedin;