# 🔬 Design deep dive

The high level design covered two flows the short URL generation and the redirection flow. Here, we discuss those topics
in more detail.

## Short URL generation

* Option 1: Hashing and Encoding
* Option 1: URL encoding through Base62, MD5 or KeyGeneration service (KGS)
* Option 2: Unique ID generation: Database auto-increment, UUID, Snowflake

## Database design


## Cache design



## Note
- DB design choice: replication factor for DB
- Short URL generation algorithm
- URL expiry
- Cache design and strategy
- Asynchronous processing for analytics (fire and forget)
- Programming language and components separation: URL shortener and URL redirect components

