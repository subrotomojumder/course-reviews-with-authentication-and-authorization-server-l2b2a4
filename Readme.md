# Course review backend

### Live Server Link :  [https://assignment-course-review-3-m16.vercel.app/](https://assignment-course-review-3-m16.vercel.app/)

### Needed for Run locally

* First of all clone my github repo. then install all the package.
* Install all the package. Go to terminal and than comand.

```bash
npm i
```

* Create an .env file in root and set variable values.

```bash
PORT= port 
DATABASE_URL= database uri
NODE_ENV= development or production
```
* After run npm run start:dev to start the server.

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
