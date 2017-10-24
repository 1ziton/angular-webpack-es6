class httpInteceptor {
	constructor($q, $cookies) {
		this.$q = $q;
		this.$cookies = $cookies;
		localStorage.setItem('token', 'eyJraWQiOiI4MDhlZjRhZS1lODJlLTQyODctYjE1OC02YTk4ZTEyZmZlYjQiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJpc3N1ZXIiLCJhdWQiOiJhdWRpZW5jZSIsImV4cCI6MTUwOTk0ODkxMCwianRpIjoidU5nYWNieGxDWEtLZ0JqcHktRldJQSIsImlhdCI6MTUwODczOTMxOSwibmJmIjoxNTA4NzM5MTk5LCJzdWIiOiIxMzAwMDAwMDAwNiIsImF0dHJpYnV0ZXMiOiJ7XCJiaXJ0aGRheVwiOjYzMTAzNjgwMDAwMCxcInJlYWxOYW1lXCI6XCLmtYvor5U257uEXCIsXCJjb2RlXCI6XCJ5enRwdFwiLFwibmlja05hbWVcIjpcIua1i-ivlTbnu4RcIixcIm1vYmlsZVwiOlwiMTMwMDAwMDAwMDZcIixcIiRleHBpcmF0aW9uLXRpbWVcIjoxNTA5OTQ4OTEwNzc0LFwiZW1haWxcIjpcIjk5NzA3NzY0NUBxcS5jb21cIixcInN0YXR1c1wiOlwiYWN0aXZhdGVkXCJ9In0.eXEFIlc0_X_dwrTDRa1O8j1EAnjOyWISkDqJFP0MwtAqhhhTE3yCvDSu7_AsPpkM1a2ESSmYtFFGAaLYKKmtTdPHLHfo_oDwlsmr-vNHH4lqiuSRSKuE2aL0faLhAfSwLQVIkkOzFU6nS8Vfq6_xiWF3XBpENzmppTXfPxUvHsoK_iHTXSB82kHhc3QTkubjQPhJYTKXMZiBZLYL9_oHyeHCqs1s_Wnhvju9LUUw9KvQOhvTFeGRXbkI0BEYcAoUKsWqlXXM1AvD5-xvPR-AuIubULt9uldVAkPgwxT-fSbFm6nGG6BoIuxcc1Is9RYaRvmCgwC50QCr-aLT-POOTQ');
	}

	request(request) {
		//console.log(request);
		request.headers = request.headers || {};
		let jwt = localStorage.getItem('token');
		if (jwt) {
			request.headers.authorization = 'Bearer ' + jwt;
		} else {
			request.headers.authorization = "Bearer anonymous.anonymous";
		}

		return request;
	}

	response(response) {
		//console.log(response);
		return response;
	}

	reponseError(rejection) {
		return rejection;
	}

	static factory($q) {
		"ngInject";
		return new httpInteceptor($q);
	}
}

export default httpInteceptor; 