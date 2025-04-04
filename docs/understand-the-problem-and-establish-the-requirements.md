
# 🔍 Understand the problem and establish the requirements
The first step is to understand the problem and establish the requirements. This involves asking clarifying questions
to understand the problem and to establish the requirements / scope the problem. As system design interviews are often
open-ended, the interviewer may not provide all the requirements.Therefore, it is important to ask clarifying questions
to understand and demonstrate your communication and collaboration skills.

## 📝 Requirements Gathering

Let's simulate a requirements gathering session with the interviewer. The following are some of the questions that can 
be asked:

| 🐹 You                                                                         	 | 🐸 Interviewer                                                                                                                                                                                                                                                                                                                        	 |
|----------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| What is the main feature of the system ?                                      	  | The main feature of the system is to shorten URLs and redirect users to the original URL. <br>Assume a very long URL such as https://www.example.com/<something+very+long+and+complicated> <br>to a short URL such as https://short.ly/abc123. If the user clicks on the short URL, they <br>will be redirected to the original URL. 	  |
| What is the character set of the short URL ?                                  	  | The URL should be alphanumeric excluding special characters.                                                                                                                                                                                                                                                                         	  |
| What is the maximum size allowed for a short URL ?                            	  | The shorter is the better.                                                                                                                                                                                                                                                                                                           	  |
| How long should the short URL be valid ? Or is there <br>an expiration date ? 	  | Let's assume that the short URL is valid for `1 year`. After that, the short URL will be <br>deleted and access will redirect to a `404 page`.                                                                                                                                                                                       	  |
| Shall we monitor the usage of the short URL ? (analytics)                     	  | Yes we should monitor the usage of the short URL. We should be able to track the number <br>of clicks on the short URL.                                                                                                                                                                                                              	  |
| Is the system global or region-based ?                                        	  | Global. URLs should be accessible from anywhere.                                                                                                                                                                                                                                                                                     	  |
| How many daily active users do you expect to use the <br>system ?             	  | We expect `500 millions daily active users (DAU)`.                                                                                                                                                                                                                                                                                   	  |
| Can we use third-party or cloud services ?                                    	  | Yes, you can use existing cloud infrastructure.                                                                                                                                                                                                                                                                                      	  |
| Should we support both desktop and mobile platforms ?                         	  | Both.                                                                                                                                                                                                                                                                                                                                	  |



Based on this conversation, we can summarize the requirements (functional and non-functional) as follows:

* 🔗  The system should allow users to shorten URLs and redirect them to the original URL.
* 🔡 The system should support the `Base62` character set [a-z][A-Z][0-9] for the short URL (62 characters).
* 📈  The system should allow users to track the usage of the short URL (analytics).
* 🌍  The system should be globally accessible and support multiple languages.
* ☁️  The system should be highly available.
* 📏 The system should be highly scalable to handle `500 millions daily active users` and support request spikes.
* ⚡  The system should have very low latency
* 🧱 The system should be fault-tolerant and handle failures gracefully. For instance: in case of short URL expiration, 
the user should be redirected to a `404 page`.
* 📱 Support both desktop and mobile clients.


## 🔢 Sizing the system
Let's do a back of the envelope calculation to estimate the size of the system. 

### 📌 Assumptions

* The average size of a long URL is `1000 characters` and the character set is `ASCII` (1 byte per character).
* The average size of a short URL is `100 characters` and the character set is `BASE62` (4 bytes per character).
* Assuming the storage capacity will take into account only the long and short URLs.
* 20% of the DAU so `10OM user`, creates `1 URL per day` ->  `100M URLs per day`.
* Each short URL is accessed `1000 times per day`.

> NOTE 1
> The above calculations are high-level estimates intended to provide a sense of scale. In a real-world system, 
> additional data such as metadata (e.g., timestamps, expiration info), indexing structures, user-specific data, and 
> logs would significantly increase both storage and bandwidth requirements.

> NOTE 2
> For simplicity, the size of a short URL is assumed to be 100 characters, but in the next section, we’ll explore how 
> to minimize this length efficiently.

### 🗃️ Storage Capacity

| 	                                     | Long URL                    	  | Short URL                	  |
|---------------------------------------|--------------------------------|-----------------------------|
| Daily = Nb of URLs * Size           	 | 100M * 1000 * 1 = 100 GB/day 	 | 100M * 100 * 4 = 40GB/day 	 |
| Monthly= Daily storage * 30 days    	 | 100 * 30 = 3TB/month        	  | 40 * 30 = 1TB/month      	  |
| Yearly= Monthly storage * 12 months 	 | 3 * 12 = 36TB/month         	  | 1 * 12 = 12TB/month      	  |


### 💦 Throughput Estimation (QPS)

| 	                                                                                                    | Write QPS                                      	 | Read QPS                                                    	 |
|------------------------------------------------------------------------------------------------------|--------------------------------------------------|---------------------------------------------------------------|
| Query Per Seconds (QPS) <br>                    = <br>Nb of URLs Write\|Read / 1 Day in seconds  	   | 100M / 86400<br>     ~= <br>  1200 req/seconds 	 | 100M * 1000 / 86400<br>        ~=<br>     12000 req/seconds 	 |
| Peak Query Per Seconds (PQPS)<br>                    =<br>           Peak factor * QPS             	 | 2 * 1200<br>     =<br>  2400 req/seconds     	   | 2 * 12000<br>        ~=<br>       24000 req/seconds     	     |

> NOTE
> Additionally, while we estimated throughput, bandwidth estimates could be expanded further to reflect both read and 
> write traffic at scale.




