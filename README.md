<h1 align="center">Mpesa expense tracker</h1>

<p align="center">An expense tracking app for mpesa transactions</p>

## Authorization

The app uses jwt for user authentification, so once you register or login a user you will recieve a jwt. Attach the jwt to your request authorization headers as a bearer token.

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

## expenses

1. **Add an expense**:

   - **method:** `PUT`
   - **path**: `/api/user/expenses/add`
   - **body:** An `expense object` _or_ a `receipt string` containing a forwarded `mpesa message` _or_ an `array` containing **multiple** of either with the property names `expenses` _or_ `receipts`.
   - **definitions**:

     - `expense`: `Object` - A `complete` expense object containing info about the expense:

       - `labels`: `Array` - An array containing a heirachy of expense labels. e.g `["transport", "taxi"]`.
       - `amount`: `Float` - A float or `number` containing the expense amount.
       - `recipient`:`String` - A string containing the expense recipient.
       - `ref`: `String` - A string containing the expense ref id.
       - `date`: `Date` - A date containing the date of the expense.

     - `or`
     - `receipt`: `String` - A forwarded `mpesa message` as a string from which the expense will be retrieved from:
     - `or`
     - `expenses`: `Array` - An array of `expense` objects.
     - `or`
     - `receipts`: `Array` - An array of `receipt` strings.

       ```javascript
       {
        expense | expenses | receipt | receipts

        //Definitions
        expense:{
          labels:Array,
          amount:Float,
          recipient:String,
          ref:String,
          date:Date
          }

        //or
        receipt:String,
        //or
        expenses:[expense]
        //or
        receipts:[receipt]
       }
       ```

   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An object containing the `expenses` added and any `failed` expenses.

       ```javascript
       {
        success:Boolean,
        data:{
          expenses:[expense],
          failed:[expense]
        },
        message:String
       }
       ```

2. **Update an expense**:

   - **method:** `PUT`
   - **path**: `/api/user/expenses/update/:id`
   - **body:** Whatever `part` of the expense you want to update. You **dont** have to pass in a `complete` expense object.

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

3. **Delete an expense**:

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

## Trash

1. **Clear trash**:

   - **method:** `DELETE`
   - **path:** `/api/user/trash/clear`
   - **body:** `empty`
   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An empty object

       ```javascript
       {
        success:Boolean,
        data:Object,
        message:String
       }
       ```

2. **Restore expense from trash**:

   - **method:** `POST`
   - **path:** `/api/user/trash/restore/:id`
   - **body:** `empty`
   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An empty object

       ```javascript
       {
        success:Boolean,
        data:Object,
        message:String
       }
       ```

3. **Fetch all expenses**:

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

4. **Fetch an expense**:

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

## statistics

1. **Fetch user statistics**:

   - **method:** `GET`
   - **path**: `/api/user/statistics/*`
   - `*`:`scope` - All paths after `/api/user/statistics/` are used to control the scope of which statistics are required. (e.g `/api/user/statistics/years/2024/` returns the statistics for the year `2024` and `/api/user/statistics/years/2024/expenses/groceries` returns the `expense statistics` for the year `2024`).
   - **body:** `empty`
   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An object containing the statistics requested and nested values for the next subcollections. (e.g "years", "months")

       ```javascript
       {
        success:Boolean,
        data:{id:String, total:Number, entries:Number, ...subcollections },
        message:String
       }
       ```

## Budget

1. **Fetch user budget**:

   - **method:** `GET`
   - **path**: `/api/user/budget`
   - **body:** `empty`
   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An object containing the users budget.

       -`items`: `Array` - An array containing objects of budget items with their name and amount.

       ```javascript
       {
        success:Boolean,
        data:{
          title:String,
          amount:{
            current:Number,
            total:Number
          }
          duration:{
            start:Date,
            end:Date
          },
          items:[{id:String, amount:{current:Number, total:Number}}],
        },
        message:String
       }
       ```

2. **Set user budget**:

   - **method:** `POST`
   - **path**: `/api/user/budget/set`
   - **body:**

     - `tite`: `String` - The title for the user dictionary,
     - `amount`:`Object` - An object containing the `current` amount and `total`(max) amount of the user budget.
     - `duration`: `Object` - An object containing the `start` and `end` of the budget duration.
     - `items`: `Array` - An array of objects containing budget items, their labels and amounts.

       ```javascript
       {
         title:String,
         amount:{
           current:Number,
           total:Number
         }
         duration:{
           start:Date,
           end:Date
         },
         items:[{label:String, amount:{current:Number, total:Number}}],
       }
       ```

   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An empty object

       ```javascript
       {
        success:Boolean,
        data:Object,
        message:String
       }
       ```

3. **Update user budget**:

   - **method:** `PUT`
   - **path**: `/api/user/budget/update`
   - **body:** An object containing whatever `part` of the budget you want to update. You can also update `nested values` by referencing them directly(e.g `duration.start`:`newDate`).

     - `tite`: `String` - The title for the user dictionary,
     - `amount`:`Object` - An object containing the `current` amount and `total`(max) amount of the user budget.
     - `duration`: `Object` - An object containing the `start` and `end` of the budget duration.
     - `items`: `Array` - An array of objects containing budget items, their labels and amounts.

       ```javascript
       {
         title:String,
         amount:{
           current:Number,
           total:Number
         }
         duration:{
           start:Date,
           end:Date
         },
         items:[{label:String, amount:{current:Number, total:Number}}],
       }
       ```

   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An empty object

       ```javascript
       {
        success:Boolean,
        data:Object,
        message:String
       }
       ```

4. **Delete user budget**:

   - **method:** `DELETE`
   - **path**: `/api/user/budget/delete`
   - **body:** `empty`
   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An empty object

       ```javascript
       {
        success:Boolean,
        data:Object,
        message:String
       }
       ```

5. **Add budget item**:

   - **method:** `POST`
   - **path**: `/api/user/budget/items/add`
   - **body:**

     - `label`: `String` - A string containing a label separated by commas(e.g "transport,taxi"),
     - `amount`:`Object` - An object with the current and total amount of the budget item.

       ```javascript
       {
        label:String,
        amount:{current:Number, total:Number}
       }
       ```

   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An empty object

       ```javascript
       {
        success:Boolean,
        data:Object,
        message:String
       }
       ```

6. **Update budget item**:

   - **method:** `PUT`
   - **path**: `/api/user/budget/items/update?id={item_label} | label=${item_label}`
   - **body:** An object containing the `part` of the budget item that you intend to update (e.g {"amount.current":20} or {"amount":{current:0, total:200}}). You can also update the item label by passing in a `label` or `id` value.

     - `label` | `id`: `String` - Pass this in if you intend to update the item label. A string containing a label separated by commas(e.g `"transport,taxi"`),
     - `amount`:`Object` | `Number` - An object with the `current` and `total` amount of the budget item, or you can update individual values by passing in a string `amount.current` || `amount.total` and assigning them to a `number` value.

       ```javascript
       {
        label:String,
        amount:{current:Number, total:Number}

        //You can also use the following syntax to update an individual value:
        //"amount.current":Number
       }
       ```

   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `String` - An empty object

       ```javascript
       {
        success:Boolean,
        data:Object,
        message:String
       }
       ```

7. **Delete budget item**:

   - **method:** `DELETE`
   - **path**: `/api/user/budget/items/delete?id={item_label} | label={item_label}`
   - **body:** `empty`
   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `String` - An empty object

       ```javascript
       {
        success:Boolean,
        data:Object,
        message:String
       }
       ```

## Dictionary

1. **Fetch user dictionary**:

- **method:** `GET`
- **path:** `/api/user/dictionary`
- **body:** `empty`
- **response:**

  - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
  - `message`:`String` - A string with the necessary message.
  - `data`: `Array` - An array of all the entries in the user dictionary

    ```javascript
    {
     success:Boolean,
     data:Array,
     message:String
    }
    ```
