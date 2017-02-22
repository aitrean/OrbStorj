**TODO:**

#PROTOTYPE 1:
##Implement basic CLI for interfacing between your database, your computer, and sharing files with other users.
**How will databases be shared?**
Database connections are facilitated through OrbitDB. When you create a DB instance with a particular name, that DB instance will be able to push to any other DB sharing the same data, and correspondingly receive data pushed from other DB instances. As a result, creating the connections to other users is as easy as agreeing upon a shared database name. 

That said, this presents an issue with users being able to access each other's cloud directories by simply knowing the name of that directory. To help obfuscate this, we're using hashes to represent the databases. In a later prototype, we will implement the ability to control access to these databases even with the hash.

**Obfuscating Database Names**
When the user opts to create a new database, a hash will be generated for that database. We will allow the user to enter a corresponding name that maps to the hash, and store the two as a key-value pairing in some kind of local storage. Foreign database hashes can also be stored with their own key names for easy access. 

