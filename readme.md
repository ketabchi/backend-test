                   
This is for examining developers willing to work in [ketabchi](https://ketabchi.com/). If you like to join us feel free to solve the problems and send the git patch for [us](mailto:zoli@ketabchi.com).
## Requirements
The requirements for running the tests and seeing the results are
- MongoDB server on port 27017
- Node with at least version 15.14.0 (probably other versions work to)
- npm
## Start
We have 3 problems for you which I will go through the details of each one later. First of all go through the code (also the tests) and see how its structured. You will get a hunch about what is expected from you.
At the end you should see 12 tests passing after the `npm run test` command.
Run `npm run seed` so the required data gets inserted in the database. You should see "Successfully seeded" after running it.
Each problem has its own scope, don't change the code out of that scope, it's not needed. We made the scope of each problem more clear with comments like `// Problem 1`, `// Problem 2`, `// Problem 3`.
### Problem 1
With adding code to "app/interceptors/product.js" you should make the problem-1 tests pass. Just add code in `ProductInterceptor` and make the tests pass. Your job on this is to decorate and export the existing data in the database as the tests are expecting to see them.
### Problem 2
We want to add gifts to some of our orders packages. For example we want to give a heart bookmark to every order which has an item which the author of the product is "Jojo Moyes". The present we will add to the order package is itself an existing product in our database. If we want to give a heart bookmark then there will be an existing product that is a heart bookmark.
Complete Present model, routes and interceptor so we can create a present record with a reference to the product as the present and its conditions. Then with passing the order code to get presents api, It should return the products we can add as a present to the order.
See the tests first so you will have an idea what the input will be and what is the expected output. After implementing this feature problem 2 tests should pass.
This problem has 3 scopes "app/models/present.js", "app/routes/present.js", "app/interceptors/present.js"
### Problem 3
When we want to ship orders, we pass the status of orders we want to ship via api query. Then the system will fetch the orders and sort them by the creation date and checks which orders have enough stock for all of their items. Any order that passes the check we decrease each order item's quantity from our stock and then change the order status to shipped.
Currently the written code seems to work and the test passes, But there is a problem.
What if two operators call the api while passing the same status simultaneously? What if while we are checking order items stock someone changes the product stock count? There is a problem here.
First write a test which with its failure shows the problem. We have an empty test in "tests/problem-3.js'' that you should fill. Second, after writing the test modify `OrderInterceptor` to resolve the mentioned problem. Your own written test and the test that was written by us should pass after your modification.
## Submitting your code
If you have resolved the problems, create a git patch from your changes and send them to [us](mailto:zoli@ketabchi.com). We won't accept any pull requests or issues here. This is a read-only repository.
