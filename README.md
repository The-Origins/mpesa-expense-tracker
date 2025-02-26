<h1 align="center">Mpesa expense tracker</h1>

<p align="center">An expense tracking app for mpesa transactions</p>

## Authorization

The app uses JSON Web Tokens for user authentification, An `access` token and http-only secure `refresh` token `cookie` are provided. Save the `access` token in memory and set your `credentials: 'include'` in the request options.

1. **Register a user**:

   - **method:** `POST`
   - **path:** `/api/auth/register`
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
       - `access`:`Object` - An object containing the access `access token` and it's `expires in` value.

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
   - **path**: `/api/auth/login`
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
       - `access`:`Object` - An object containing the `access token` and it's `expires in` value.

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

3. **Re-issue Tokens**:

   - **method:** `POST`
   - **path**: `/api/auth/re-issue-tokens`
   - **body:** `empty`
   - **credentials:** `true` - To include the http-only secure refresh token.
   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An object containing the user object and a jwt token.

       - `access`:`Object` - An object containing the `access token` and it's `expires in` value.

       ```javascript
           {
               success:Boolean,
               data:{
                   access:Object
               },
               message:String
           }
       ```

## User

1. **Update user**:

   - **method:** `PUT`
   - **path**: `/api/user/update`
   - **body:** `Object` - An object containing whatever `part` of the user you want to update. You can also update `nested values` by referencing them directly(e.g `phone.number`:`String`).
   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An object containing the `part` of the user that was updated.

       ```javascript
       {
        success:Boolean,
        message:String,
        data:Object
       }
       ```

2. **Delete user**:

   - **method:** `DELETE`
   - **path:** `/api/user/delete`
   - **body:** `empty`
   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - Empty object

       ```javascript
       {
        success:Boolean,
        message:String,
        data:Object
       }
       ```

## Expenses

1. **Add an expense**:

   - **method:** `PUT`
   - **path**: `/api/user/expenses/add`
   - **body:** An `expense object` _or_ a `receipt string` containing a forwarded `mpesa message` _or_ an `array` containing **multiple** of **either** with the property names `expenses` _or_ `receipts`.
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
        // expense | expenses | receipt | receipts

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
     - `data`: `Object` - An object containing which operations were `successful` and those that `failed`.

       ```javascript
       {
        success:Boolean,
        data:{
          successful:Object,
          failed:Object
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
   - **path**: `/api/user/expenses/delete`
   - **body:** `id`:`String` _or_ `ids`:`[String]`- A `String` containing the `id` of the expense you want to delete _or_ an `Array` of `ids`.
   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An object containing which operations were `successful` and those that `failed`.

       ```javascript
       {
        success:Boolean,
        message:String,
        data:{
          successful:Object,
          failed:Object
          }
       }
       ```

4. **Fetch all expenses**:

   - **method:** `GET`
   - **path**: `/api/user/expenses`
   - **body:** `empty`
   - **params** `optional` - `limit` a `Number` containing how many expenses you want to fetch
   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Array` - An array containing `all` the users expenses

       ```javascript
       {
        success:Boolean,
        data:Array,
        message:String
       }
       ```

5. **Fetch an expense**:

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

## Failed

1. **Fetch failed expenses**:

   - **method:** `GET`
   - **path**: `/api/user/expenses/failed`
   - **body:** `empty`
   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Array` - An array containing the `failed` expenses. These are expenses that failed to be added to the other expenses for various reasons.

       ```javascript
       {
        success:Boolean,
        message:String,
        data:Array
        }
       ```

1. **Delete failed expense**:

   - **method:** `DELETE`
   - **path**: `/api/user/expenses/failed/delete`
   - **body:** `id`:`String` _or_ `ids`:`[String]`- A `String` containing the `id` of the expense you want to delete _or_ an `Array` of `ids`.
   - **response:**

     - `success`: `Boolean` - A boolean indicating whether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An object containing which operations were `successful` and those that `failed`.

       ```javascript
       {
        success:Boolean,
        message:String,
        data:{
          successful:Object,
          failed:Object
          }
       }
       ```

## Trash

1. **Delete an expense from trash**:

   - **method:** `DELETE`
   - **path**: `/api/user/trash/delete`
   - **body:** `id`:`String` _or_ `ids`:`[String]`- A `String` containing the `id` of the expense you want to delete _or_ an `Array` of `ids`.
   - **response:**

     - `success`: `Boolean` - A boolean indicating whether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An object containing which operations were `successful` and those that `failed`.

       ```javascript
       {
        success:Boolean,
        message:String,
        data:{
          successful:Object,
          failed:Object
          }
       }
       ```

2. **Restore expense from trash**:

   - **method:** `POST`
   - **path:** `/api/user/trash/restore`
   - **body:** `id`:`String` _or_ `ids`:`[String]` - A `String` containing the `id` of the expense you want to restore or an `Array` of `ids`.
   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An object containing which operations were `successful` and those that `failed`.

       ```javascript
       {
        success:Boolean,
        message:String,
        data:{
          successful:Object,
          failed:Object
        }
       }
       ```

3. **Fetch trash**:

   - **method:** `GET`
   - **path:** `/api/user/trash`
   - **body:** `empty`
   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Array` - An array containing all the expenses in `trash`

       ```javascript
       {
        success:Boolean,
        message:String,
        data:Array
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

1. **Set user budget**:

   - **method:** `POST`
   - **path**: `/api/user/budget/set`
   - **body:**

     - `tite`: `String` - The title for the user dictionary,
     - `total`:`Number` - The max amount of the user budget.
     - `duration`: `Object` - An object containing the `start` and `end` of the budget duration.
     - `items`: `Object` - An object containing budget items and their `total` (max) value, nested items are added to the `parents` items object.

       ```javascript
       {
         title:String,
         total:Number
         duration:{
           start:Date,
           end:Date
         },
         items:{
          label:{
            total:Number
            items:{...nested values}
          }
         },
       }
       ```

   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - The set user budget, complete with its `current` amount.

       ```javascript
       {
        success:Boolean,
        data:Object,
        message:String
       }
       ```

2. **Fetch user budget**:

   - **method:** `GET`
   - **path**: `/api/user/budget`
   - **body:** `empty`
   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An object containing the users budget.

       ```javascript
       {
        success:Boolean,
        data:{
          title:String,
          current:Number,
          total:Number
          duration:{
            start:Date,
            end:Date
          },
        },
        message:String
       }
       ```

3. **Update user budget**:

   - **method:** `PUT`
   - **path**: `/api/user/budget/update`
   - **body:** An object containing whatever `part` of the budget you want to update. You can also update `nested values` by referencing them directly(e.g `duration.start`:`newDate`). `Items` are **not** updated using this path.

     ```javascript
     {
       //Whatever part of the budget you want to update
       //IMPORTANT: items are not updated here
     }
     ```

   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An object containing the `parts` updated.

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
   - **path**: `/api/user/budget/items/add/*`

     - `*`: `path` - The path where you want to add the budget item. E.g `/` adds the item to the `base` buget path, `/transport` adds the item into the heirachy of `/transport` items.

   - **body:**

     - `label`: `String` - A string containing a `single` label.,
     - `total`:`Number` - A number containing total amount of the budget item.

       ```javascript
       {
        label:String,
        total:Number
       }
       ```

   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - The added budget item along with it's current amount

       ```javascript
       {
        success:Boolean,
        data:Object,
        message:String
       }
       ```

6. **Update budget item**:

   - **method:** `PUT`
   - **path**: `/api/user/budget/items/update/*`

     - `*`: `path` - The path of the item you want to `update`. E.g `/transport` updates the `transport` budget item.

   - **body:** An object containing the `part` of the budget item that you intend to update. Either the `total` || the `current` or `both`.

     ```javascript
     {
       //Whatever part of the budget item you want to update
     }
     ```

   - **response:**

     - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `String` - An object containing the `part` of the budget item that's been updated.

       ```javascript
       {
        success:Boolean,
        data:Object,
        message:String
       }
       ```

7. **Delete budget item**:

   - **method:** `DELETE`
   - **path**: `/api/user/budget/items/delete/*`

     - `*`: `path` - The path of the item you want to `delete`. E.g `/transport` deletes the `transport` budget item and `all` its `nested` items.

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

The dictionary is used to automatically assign labels based on an `exact match` of the expense `recipient`.

1. **Fetch user dictionary**:

- **method:** `GET`
- **path:** `/api/user/dictionary` -`optional`: `?labels-only=true` - only return an array of the labels from each entry.
- **body:** `empty`
- **response:**

  - `success`: `Boolean` - A boolean indicating wether the operation was successfull or not,
  - `message`:`String` - A string with the necessary message.
  - `data`: `Array` - An array of all the entries in the user dictionary. If `labels-only=true` then it will only return the labels from each entry.

    ```javascript
    {
     success:Boolean,
     data:Array,
     message:String
    }
    ```

2. **Add an entry to the dictionary**:

   - **method:** `POST`
   - **path**: `/api/user/dictionary/add`
   - **body:**

     - `entry` _or_ `id` : `String` - A string containing the expense receipient.
     - `labels`: `Array` - An array containing a `heirachy` of labels. E.g `["transport", "taxi"]`.

     ```javascript
     {
      entry | id:String,
      labels:[String]
     }
     ```

   - **response:**

     - `success`: `Boolean` - A boolean indicating whether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An object containing the dictionary entry.

       ```javascript
       {
        success:Boolean,
        message:String,
        data:Object
       }
       ```

3. **Update a dictionary entry**:

   - **method:** `PUT`
   - **path**: `/api/user/dictionary/update{?id={entryId} || ?entry={entryId}}`
   - **body:**

     - `optional` - `entry` _or_ `id` : `String` - A string containing the dictionary entry id.
     - `labels`: `Array` - An array containing the `new` heirachy of labels. E.g `["transport", "taxi"]`.

     ```javascript
     {
       //(optional) entry || id:String,
       labels: [String];
     }
     ```

   - **response:**

     - `success`: `Boolean` - A boolean indicating whether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An object containing the dictionary entry.

       ```javascript
       {
        success:Boolean,
        message:String,
        data:Object
       }
       ```

4. **Delete a dictionary entry**:

   - **method:** `DELETE`
   - **path**: `/api/user/dictionary/delete{?id={entryId} || ?entry={entryId}}`
   - **body:**

     - _optional_ `entry` _or_ `id` : `String` - A string containing the dictionary entry id.
     - `labels`: `Array` - An array containing a `heirachy` of labels. E.g `["transport", "taxi"]`.

     ```javascript
     {
       // (optional) entry | id:String,
       labels: [String];
     }
     ```

   - **response:**

     - `success`: `Boolean` - A boolean indicating whether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An object containing the dictionary entry.

       ```javascript
       {
        success:Boolean,
        message:String,
        data:Object
       }
       ```

## Keywords

Keywords are used for automatically labeling expenses with a given `keyword` in their `recipient`.

1. **Add a keyword**:

   - **method:** `POST`
   - **path**: `/api/user/keywords/add`
   - **body:**

     - `keyword` : `String` - A string containing the keyword.
     - `labels`: `Array` - An array containing a `heirachy` of labels. E.g `["transport", "taxi"]`.
     - _optional_ `updateAllExpenses`: `Boolean` - A boolean that decides whether all existing expenses with the keyword will be updated.

     ```javascript
     {
       keyword: String;
       labels: [String];
       //(optional) updateAllExpenses:Boolean
     }
     ```

   - **response:**

     - `success`: `Boolean` - A boolean indicating whether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An object containing the keyword and labels

       ```javascript
       {
        success:Boolean,
        message:String,
        data:Object
       }
       ```

2. **Upadate a keyword**:

   - **method:** `PUT`
   - **path**: `/api/user/keywords/update?keyword={String}`
   - **body:**

     - _optional_ `keyword` : `String` - A string containing the keyword.
     - `labels`: `Array` - An `new` array containing a `heirachy` of labels. E.g `["transport", "taxi"]`.
     - _optional_ `updateAllExpenses`: `Boolean` - A boolean that decides whether all existing expenses with the keyword will be updated.

     ```javascript
     {
       //(optional) keyword: String;
       labels: [String];
       //(optional) updateAllExpenses:Boolean
     }
     ```

   - **response:**

     - `success`: `Boolean` - A boolean indicating whether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An object containing the keyword and labels

       ```javascript
       {
        success:Boolean,
        message:String,
        data:Object
       }
       ```

3. **Delete a keyword**:

   - **method:** `DELETE`
   - **path**: `/api/user/keywords/delete?keyword={keyword}`
   - **body:**

     - _optional_ `keyword` : `String` - A string containing the keyword.
     - _optional_ `updateAllExpenses`: `Boolean` - A boolean that decides whether all existing expenses with the keyword will be updated.

     ```javascript
     {
       //(optional) keyword: String;
       //(optional) updateAllExpenses:Boolean
     }
     ```

   - **response:**

     - `success`: `Boolean` - A boolean indicating whether the operation was successfull or not,
     - `message`:`String` - A string with the necessary message.
     - `data`: `Object` - An empty object

       ```javascript
       {
        success:Boolean,
        message:String,
        data:Object
       }
       ```
