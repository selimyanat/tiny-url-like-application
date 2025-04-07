# 🔬 Design deep dive

The high level design covered two flows the short URL generation and the redirection flow. Here, we discuss those topics
in more detail comparing different approaches and their trade-offs. 

## 🧠 Short URL generation
There are multiple ways to generate a short URL from a long URL. The objective being to select an algorithm that:
* 💎 Minimizes collisions.
* 💎 Is scalable and stateless.
* 💎 Produces reasonably short URLs - URLs should be as short as possible. 
* 💎 Support millions of users with low latency.

### 🔢 Base62 length and capacity analysis
To support 100 million unique short URLs per day without collision, we need to ensure the keyspace is large enough. At 
100 million URLs per day, with Base62 character set (62 characters) the short URL should be at least 7 characters

For e.g: https://tinyurl-like-app.com/abc123y

### 🧠 Options for short URL generation

#### 🧮 Auto-increment counter
Use a centralized database or distributed counter to generate a sequential numeric ID (e.g., 1, 2, 3...), then encode 
it into Base62 to produce a short URL.

#### 🔐 Hash of Long URL (SHA-256, MD5, etc.)
Compute a deterministic hash of the long URL using a cryptographic hash function, and use the hash (or a truncated version) 
as the short code (Base62-encoded).

#### 🎲 Random String Generation
Generate a random Base62 string (e.g., 7–9 characters) for each new short URL. Store it alongside the long URL, 
checking for collisions before insertion.

#### ⏱️ Twitter Snowflake + Base62 ✅
Generate a globally unique 64-bit ID using a [Snowflake algorithm] (https://en.wikipedia.org/wiki/Snowflake_ID) (based 
on timestamp, machine ID, etc.), then encode it into Base62 to produce a compact short code.

#### 📊 Comparative Analysis

| Criteria / NFR                           	  | Counter                       	  | Hash (SHA-256/MD5)                 	  | Random String             	  | Snowflake + Base62                   	  |
|---------------------------------------------|----------------------------------|---------------------------------------|------------------------------|-----------------------------------------|
| <br>Unique Mapping                       	  | ✅ Yes                         	  | ✅ Yes                              	  | ✅ Yes <br>(probabilistic) 	  | ✅ Yes <br>(guaranteed)               	  |
| 📈 Analytics Support                      	 | ✅ Yes                         	  | ✅ Yes                              	  | ✅ Yes                     	  | ✅ Yes                                	  |
| 🌍 Global Access                          	 | ⚠️ Central <br>bottleneck      	 | ✅ Stateless                        	  | ✅ Stateless               	  | ✅ Stateless                          	  |
| ☁️ High Availability                      	 | ⚠️ Requires HA DB              	 | ✅ Stateless                        	  | ✅ Stateless               	  | ✅ Stateless                          	  |
| 📏 Scalability (500M DAU)                 	 | ❌ Scaling DB <br>is hard      	  | ✅ High                             	  | ✅ High                    	  | ✅ Designed for <br>scale             	  |
| ⚡ Low Latency                            	  | ❌ DB latency                  	  | ⚠️ Hash calc can be <br>slow        	 | ✅ Fast                    	  | ✅ Fast                               	  |
| 🧱 Fault Tolerance                        	 | ❌ Single point of <br>failure 	  | ✅ Yes                              	  | ✅ Yes                     	  | ✅ Yes                                	  |
| ✂️ Shortness of ID (Base62 length)        	 | ✅ Very short <br>(6–7 chars)  	  | ❌ 22–43 chars                      	  | ✅ Tunable (6+)            	  | ⚠️ 11 chars                           	 |
| 💥 Collision Risk                         	 | ✅ None                        	  | ⚠️ Requires truncation <br>handling 	 | ⚠️ Probabilistic           	 | ✅ None (designed for <br>uniqueness) 	  |
| 🎯 Determinism (same input → same output) 	 | ❌ No                          	  | ✅ Yes                              	  | ❌ No                      	  | ❌ No                                 	  |
| 📈 Sortability (time-ordered)             	 | ❌ No                          	  | ❌ No                               	  | ❌ No                      	  | ✅ Yes                                	  |
| 🧩 Infrastructure Simplicity              	 | ❌ DB needed                   	  | ✅ Stateless                        	  | ✅ Stateless               	  | ✅ Stateless                          	  |

### ✅ Conclusion
Considering the above analysis, the best approach for generating short URLs is **Snowflake + Base62** despite the 
slightly longer ID length. The trade-off of 11 characters vs 6-7 is more than compensated:
* 💎 Statelessness
* 💎 No collisions
* 💎 High throughput
* 💎 Ease of sharding
* 💎 Time-ordering (useful for analytics)

## 🧱 Database design
The system requires two main data models:
* URL Mappings
* User Information

### 🔗 URL Mappings (Short URL → Long URL)
This is a classic key-value use case, where the short URL is the key and the long URL is the value. Given the 
system's scale — 100 million new short URLs per day, with each short URL accessed ~1000 times daily — **the read-to-write 
ratio is approximately 10:1**.

To support this high-volume, write-heavy workload with predictable low latency:
* **Primary Store**: Use a distributed key-value store such as DynamoDB or Cassandra:
  * Highly available and horizontally scalable
  * Supports TTL (time-to-live) for **auto-expiring short URLs (especially with DynamoDB)**

* **Cache Layer**: Use Redis to cache frequently accessed short URLs and reduce database load.


### 🧮  Redis Memory Estimation

Approximate size per entry:
```
Key + Value + Overhead ≈ 11 + 1000 + 100 = ~1.1 KB
```
Total for 100M URLs/day:
```
100M * 1.1 KB ≈ 110 GB
```
In total, Redis memory required for 1OOM URLs/day is around 110 GB. The cache would be useful for the most frequently
accessed URLs, which can be estimated to be around 10% of the total URLs. This means that we would need around 11 GB of
memory for the cache. 

### 👤 User Information
User data — including email, hashed passwords, and preferences — requires strong consistency, relational querying, and 
transactional guarantees. A relational database such as PostgreSQL or MySQL is well-suited for this purpose, offering 
full **ACID compliance, **robust indexing, and transaction support**, making it ideal for managing authentication and 
user profiles. To support scalability and high availability:

* **Sharding** can be applied using the user ID or email as the partition key to ensure even data distribution.
* **Read replicas** can be introduced to offload read traffic and enhance fault tolerance.

