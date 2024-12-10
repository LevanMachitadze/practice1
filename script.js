#! /usr/bin/env node
// 1) შექმენით posts.json რომელშიც ჩაწერთ https://jsonplaceholder.typicode.com/posts ამ ეიპიაიდან წამოღებულ ინფოს, შემდეგ შექმენით ფუნცქია რომელიც წაიკითხავს ამ პოსტებს და წაშლის ყველა იმ პოსტს რომლის სათაურიც მეტია 30 სიმბოლოზე. ამ ფუნცქიის გაშვების მერე posts.json ში უნდა დარჩეს მხოლოდ ისეთი პოსტები რომლის სათაურებიც 30-ზე ნაკლებია.

import fs from "fs/promises";

async function filterFunc() {
  try {
    const posts = await fs.readFile("posts.json", "utf-8");
    const data = JSON.parse(posts);
    const filteredData = data.filter((post) => post.title.length <= 30);
    // console.log(filteredData);
    await fs.writeFile("posts.json", JSON.stringify(filteredData));
  } catch (error) {
    console.log("there is error", error);
  }
}

filterFunc();

// 2) შექმენით ფუნცქია რომელიც შეასრულებს შემდეგ დავალებას, როდესაც გაუშვებთ node main.js CREATE john@gmail.com john 21  შექმნის users.json ში ახალ იუზერს ყოველ გამოძახებაზე უნდა დაემატოს ახალი იუზერები users.json ში, მაგრამ როდესაც გამოიძახებ node main.js DELETE john@gmail.com ასეთ დროს უნდა წაიშალოს ეს იუზერი users.json დან, გაითვალისწინეთ რომ მეილი უნიკალურია ამიტომ დაწერეთ შემოწმება თუ ეგეთი მეილით უკვე ჩაწერილია იუზერი მაშინ აღარ ჩაწეროთ.

import { Command } from "commander";

const program = new Command();

program
  .description("make user crud")
  .command("CREATE")
  .argument("<email>")
  .argument("<name>")
  .argument("<age>")
  .action(async (email, names, age) => {
    let users = [];
    const rawUsers = await fs.readFile("users.json", "utf-8");
    users = JSON.parse(rawUsers);
    const newUsers = {
      email: email,
      name: names,
      age: age,
    };
    users.push(newUsers);
    await fs.writeFile("users.json", JSON.stringify(users));
  });

program
  .command("DELETE")
  .argument("<number>")
  .action(async (number) => {
    const rawUsers = await fs.readFile("users.json", "utf-8");
    const users = JSON.parse(rawUsers);

    const index = users.findIndex((e) => e.number === number);
    if (index === -1) {
      console.log("user not found");
      return;
    }

    const deletedUSer = users.splice(index, 1);
    await fs.writeFile("users.json", JSON.stringify(users));
    console.log("user has been deleted", deletedUSer);
  });

program.parse();

// 3) შექმენით ახალი ფაილი products.json სადაც ჩაწერთ პროდუექტების სიას თითოეულ პროდუქტს უნდა ქონდეს, სახელი, აღწერა, ფასი, ფერი. როდესაც გაუშვებთ შემდეგ ბრძანებას node main.js ASC უნდა დაილოგოს პროდუქტები რომლებიც დალაგებული იქნება ფასის მიხედვით ზრდადობით ხოლო თუ გამოიძახა ბრძანება node main.js DESC უდნა დაილოოს პროდუქტები რომლებიც იქნება დალაგებული ფასის მიხედვით კლებადობით.

// async function sortProducts(asc = true) {
//   products.sort((a, b) => {
//     return asc ? a - b : b - a;
//   });

// }



program
  .command("ASC")
  .description("sort products by price")
  .action(async () => {
    const rawProducts = await fs.readFile("products.json", "utf-8");
    const products = JSON.parse(rawProducts);
    products.sort((a, b) => a.price - b.price);
    console.log("Sorted products (ASC):", products);
    await fs.writeFile("product.json", JSON.stringify(products));
  });

program
  .command("DESC")
  .description("sort products by price")
  .action(async () => {
    const rawProducts = await fs.readFile("products.json", "utf-8");
    const products = JSON.parse(rawProducts);
    products.sort((a, b) => b.price - a.price);
    await fs.writeFile("product.json", JSON.stringify(products));
  });

program.parse();
