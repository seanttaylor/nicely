## Nicely

#### Local Development

* If running the tests _outside_ of Docker, ensure the `JWT_SECRET` environment variable is set. Otherwise the units for the AuthService module will fail. (e.g. `export JWT_SECRET=mySuperSecret`)

##### Database and Migrations


#### Deployment


#### Authentication


#### Authorization


#### Tooling
Key software modules, services and tools used regularly for designing, building and maintaining the Nicely platform are listed below. While they have been used specifically for addressing business use cases unique to Nicely, these are excellent tools in their own right and well worth the time to check out.

* [db-migrate](https://db-migrate.readthedocs.io/en/latest/Getting%20Started/usage/) ~ an NPM package to faciliate database migrations on a number of database products
* [SqlDbm](sqldbm.com) ~ a visual editor for creating relational database schemas, generates SQL schemas from the browser
* [DB Fiddle](https://www.db-fiddle.com) ~ a browser-based playground for debugging SQL in a number of common dialects
* [Stoplight](https://stoplight.io) ~ a visual editor for creating OpenAPI schema documents
* [accesscontrol](https://www.npmjs.com/package/accesscontrol) ~ an NPM module offering basic role-based access control
* [Google Cloud Natural Language API](https://cloud.google.com/natural-language/docs) ~ a set of APIs to apply sentiment analyis to plain text or html

#### References

* [Nicely Object Graph](https://sketchboard.me/tCioi39DllPg#/) ~ see major application modules, services and interfaces in a graphical format