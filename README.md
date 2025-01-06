<h1 align="center">Mpesa expense tracker</h1>

<p align="center">An expense tracking app for mpesa transactions</p>

## Authorization

The app uses jwt for user authentification, so once you register or login a user you will recieve a jwt. Attach the jwt to your request authorization headers as a bearer token.

## Paths

1. **Register a user**:

   - **method:** `POST`
   - **path:** `/api/user/register`
   - **body:**

     - `name`: `Object` - An object containing the users first and last name.
       - `first`:`String` - A string containing the users first name.
       - `last`:`String` - A string containing the users last name.
     - `email`: `String` - A valid email string containing the users email.
     - `phone`:`Object` - An object containing the users phone number and contry name.
       - `code`:`String` - A string containing a `capitalized` abbriviation of the country name.
       - `number`:`String` - A string containing the users phone number in international format.
     - `password`:`String` - A string containing the users password

       ```javascript
            {
                name:{
                    first:String,
                    last:String
                },
                email:String,
                phone:{
                    code:String,
                    number:String
                },
                password:String
            }
       ```

   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An object containing the user object and a jwt token.

       - `user`:`Object` - An object containing all the users info.
       - `jwt`:`Object` - An object containing a `token` and it's `expires in` value.

       ```javascript
           {
               success:Boolean,
               data:{
                   user:Object,
                   jwt:Object
               },
               message:String
           }
       ```

2. **Login a user**:

   - **method:** `POST`
   - **path**: `/api/user/login`
   - **body:**

     - `email`: `String` - A valid email string containing the users email.
     - `password`:`String` - A string containing the users password

       ```javascript
       {
           email:String,
           password:String
       }
       ```

   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An object containing the user object and a jwt token.

       - `user`:`Object` - An object containing all the users info.
       - `jwt`:`Object` - An object containing a `token` and it's `expires in` value.

       ```javascript
           {
               success:Boolean,
               data:{
                   user:Object,
                   jwt:Object
               },
               message:String
           }
       ```

3. **Add an expense**:

   - **method:** `PUT`
   - **path**: `/api/user/expenses/add`
   - **body:**

     - `labels`: `Array` - An array containing a heirachy of expense labels. e.g `["transport", "taxi"]`.
     - `amount`: `Float` - A float or `number` containing the expense amount.
     - `recipient`:`String` - A string containing the expense recipient.
     - `ref`: `String` - A string containing the expense ref id.
     - `date`: `Date` - A date containing the date of the expense.

       ```javascript
       {
        labels:Array,
        amount:Float,
        recipient:String,
        ref:String,
        date:Date
       }
       ```

   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `String` - A string containing the expenses' id.

       ```javascript
       {
        success:Boolean,
        data:String,
        message:String
       }
       ```

4. **Update an expense**:

   - **method:** `PUT`
   - **path**: `/api/user/expenses/update/:id`
   - **body:**

     - `labels`: `Array` - An array containing a heirachy of expense labels. e.g `["transport", "taxi"]`.
     - `amount`: `Float` - A float or `number` containing the expense amount.
     - `recipient`:`String` - A string containing the expense recipient.
     - `ref`: `String` - A string containing the expense ref id.
     - `date`: `Date` - A date containing the date of the expense.

       ```javascript
       {
        labels:Array,
        amount:Float,
        recipient:String,
        ref:String,
        date:Date
       }
       ```

   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An object containing the new expense values.

       ```javascript
       {
        success:Boolean,
        data:Object,
        message:String
       }
       ```

5. **Delete an expense**:

   - **method:** `DELETE`
   - **path**: `/api/user/expenses/delete/:id`
   - **body:** `empty`
   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An empty object.

       ```javascript
       {
        success:Boolean,
        data:Object,
        message:String
       }
       ```

6. **Fetch all expenses**:

   - **method:** `GET`
   - **path**: `/api/user/expenses`
   - **body:** `empty`
   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Array` - An array containing all the users expenses

       ```javascript
       {
        success:Boolean,
        data:Array,
        message:String
       }
       ```

7. **Fetch an expense**:

   - **method:** `GET`
   - **path**: `/api/user/expenses/:id`
   - **body:** `empty`
   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An object containing the expense.

       ```javascript
       {
        success:Boolean,
        data:Object,
        message:String
       }
       ```

8. **Fetch user statistics**:

   - **method:** `GET`
   - **path**: `/api/user/statistics/*`
   - `*`:`scope` - All paths after `/api/user/statistics/` are used to control the scope of which statistics are required. (e.g `/api/user/statistics/years/2024/` returns the statistics for the year `2024` and `/api/user/statistics/years/2024/expenses/groceries` returns the `expense statistics` for the year `2024`).
   - **body:** `empty`
   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `String` - A string containing the expenses' id.

       ```javascript
       {
        success:Boolean,
        data:String,
        message:String
       }
       ```
