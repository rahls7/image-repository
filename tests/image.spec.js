const axios = require("axios");

describe("Image resolvers", () => {
  test("getImage", async () => {
    const response = await axios.post(
      "http://localhost:5000",
      {
        query: `  getImages {
                id
                imageUrl
            }`
      },
      {
        headers: {
          // prettier-ignore
          "Authorization":
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYTM0MDVlYmFlYjZmNDY5YzFiODNkYiIsImVtYWlsIjoicGxhcmlzLjcxMUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InBsYXJpcyIsImlhdCI6MTU3MTA5ODk3MSwiZXhwIjoxNTcxMTAyNTcxfQ.3j38MBvSejeAPnBkf3ndg5__PoLyjMMd5NfUm7yjoCs"
        }
      }
    );
    console.log(response);
  });
});
