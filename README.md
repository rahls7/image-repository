# shopify-image

Winter 2020 - Shopify
Developer Intern Challenge Question

### TASK: Build an image repository.

You can tackle this challenge using any technology you want. This is an open-ended task.

Please provide brief instructions on how to use your application.

Extra Information: You can, if you wish, use frameworks, libraries and external dependencies to help you get faster to the parts you are interested in building, if this helps you; or start from scratch.

Please focus on what interests you the most. If you need inspiration, here are examples of what you can work on. IF you work on these ideas, we recommend choosing only one or two.

Ideas:

1. SEARCH function

- from characteristics of the images
- from text
- from an image (search for similar images)

2. ADD image(s) to the repository

- one / bulk / enormous amount of images
- private or public (permissions)
- secure uploading and stored images

3. DELETE image(s)

- one / bulk / selected / all images
- Prevent a user deleting images from another user (access control)
- secure deletion of images

### How to set up the project:

- Add a file config.js. A template is added to the repository called config-example.js
- You will also need to create a Google Cloud account and create a bucket for google cloud storage. After that you will also need to create a service account and download the json file, name it service-account-key and add it to the root folder.
- After creating the google cloud account, you will have to enable 2 API's in google cloud i.e. Vision API and Google Cloud Function. We use vision api to assign labels to the image uploaded so as to be able to search it and google cloud function to uncompress the zip file which is used for uploading large amount of files.

### How to run the project

- Simply run npm start. A graphql playground would open at localhost:5000.
- In the playground, you will also find the documentation of available queries and mutation by clicking on Docs on the right
- Sample flow of the application

1. Create a user using the following Mutation

```
mutation {
  register(registerInput: {
    username: "xyz"
    password: "123456"
    confirmPassword: "123456"
    email: "xyz@gmail.com"
  }) {
    id
    email
    token
    username
    createdAt
  }
}
```

2. Login using the credentials of the user created above using following mutation

```
mutation {
  login(username: "xyz", password:"123456") {
    id
    email
    token
    username
    createdAt
  }
}
```

Store the token returned from the above mutation. We will need it to upload/delete images

3. Upload single image or a directory of lots of images. The parameter needed is the path of the file on your local disk and an option to either make the image public or not.You will need the token from login mutation for this. Add it in your http headers(option on the bottom of the playground), in the following format:

```
{
  "Authorization":"Bearer token"
}
```

Should include the word Bearer followe by a space and then the token from the login mutation.

Use the mutation as shown below to upload single image file.

```
mutation uploadImage {
  uploadImage(file: "dog2.jpeg" public: true) {
    id
    username
    createdAt
    imageUrl
    labels
  }
}
```

The imageUrl above will only be accessed by the user who uploaded the file if public is specified false. If public is true, anyone with the link will be able to view the image

In order to upload enormous amount of images, specify the path of the directory you wish to upload. All files inside the directory will be uploaded.

```
mutation uploadDirectory {
  uploadDirectory(dir: "images") {
    imageUrl
  }
}
```

4. You will only be able to get the images that the currently logged in user has uploaded.
   You can get the information of the image you wish to get as such:

```
query getImages {
  getImages {
    id
    imageUrl
  }
}
```

In order to get a single image, you need to specify the image id and use the query as such:

```
query getImage {
  getImage(imageId: "5da37ebeebde0c7f0752e16b") {
    id
    imageUrl
  }
}
```

5. You have the ability to search the images either by text or by another image. In order to search for the image by text, you can use the folllowing query (you will only get images uploaded by the current user):

```
query searchImage {
  searchImage(text: "Dog") {
    imageUrl
  }
}
```

In order to search for images by another image (reverse image search), you need to specify the file parameter which is the path of the image you want the search to be performed from in your query as such:

```
query reverseSearch {
  reverseImageSearch(file: "dog1.jpeg") {
    imageUrl
  }
}
```

6. In order to delete an image, you will need the imageId. You can get the image id by querying get Images.
   Use the mutation as such to delete the image:

```
mutation deleteImage {
  deleteImage(imageId:"5da4ea89fc2febbf4b44508e" )
}
```

In order to delete multiple images you need to provide an array of image ids that you want deleted. You can use it as such:

```
mutation deleteImages(imagesIds: [1234, 12456, 0932]) {
  deleteImage(imageId:"5da4ea89fc2febbf4b44508e" )
}
```

### Architecture Decision.
