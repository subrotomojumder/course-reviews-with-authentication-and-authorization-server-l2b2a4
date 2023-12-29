# Authentication and Authorization system

### Live Server Link :  [1111](1111)

### Needed for Run locally

* First of all clone my github repo. then install all the package.
* Install all the package. Go to terminal and than comand.

```bash
npm i
```

* Create an .env file in root and set variable values.

```bash
PORT= port 
DATABASE_URL= database-uri
NODE_ENV= development-or-production
BCRYPT_SALT_ROUNDS= number
JWT_ACCESS_SECRET= secret-key
JWT_ACCESS_EXPIRE_IN= 10m | 2d | 30d 
```
* After run npm run dev to start the server.

```bash
npm run dev
```
### Routes:
* Create course Endpoint : **`/api/course`**
* Get courses with query : **`/api/courses `**
* Create Category : **`/api/categories`**
* Get All Categories : **`/api/categories`**
* Create Review : **`/api/reviews`**
* Update Course : **`/api/courses/:courseId`**
* Get review by courseId : **`/api/courses/:courseId/reviews`**
* Get the Best Course : **`/api/course/best`**

#### instructions : 
If you want to create or update documents , The body must be of **json** type data.
