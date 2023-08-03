'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//function used to add new entries to the request made.
const displayMovements = function (movements, sort = false) {
  //innerHTML is similar to textContent but different in a way that it returns everything including html. Textcontent returns only text.
  containerMovements.innerHTML = '';
  //for each request we need to create an html element to display information
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    //we will crete html templates using template literals. Template literals are amazing to for this coz we can create multiline string like this
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
    <div class="movements__type
     movements__type--${type}">${i + 1} ${type} deposit</div>
    <div class="movements__value">${mov}₹</div>
    </div>`;
    //now we need to attach this element to a container(movements in html). To do this we will use insertAdjacentHtml method
    //we need to pass two strings,first is position and second is string which we want to display. Use MDN to see their meaning
    //we did not use beforeend coz then each new element will be added after the previous one, so at the end.
    containerMovements.insertAdjacentHTML('afterbegin', html);
    //inserAdjancentHTML : So all we have to do is to create a string of HTML. And then we can insert that simply with this method.
  });
};
//displayMovements(account1.movements);

//Function to create username from owner property in accounts
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} ₹`;
};
//calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}₹`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${-1 * out}₹`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}₹`;
};

//calcDisplaySummary(accounts);
const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount) {
    if (currentAccount?.pin == Number(inputLoginPin.value)) {
      labelWelcome.textContent = `Welcome back, ${
        currentAccount.owner.split(' ')[0]
      }`;

      containerApp.style.opacity = 100;
      //this expression will be evaluated from left ot right
      inputLoginUsername.value = inputLoginPin.value = '';
      inputLoginPin.blur();

      updateUI(currentAccount);
    } else {
      console.log('Wrong PIN! Please try again');
      containerApp.style.opacity = 0;
    }
  } else {
    console.log('User does not exist');
    containerApp.style.opacity = 0;
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
  console.log(amount, receiverAcc);
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmt = Number(inputLoanAmount.value);
  if (
    loanAmt > 0 &&
    currentAccount.movements.some(acc => acc > 0.1 * loanAmt)
  ) {
    currentAccount.movements.push(loanAmt);
    updateUI(currentAccount);
    inputLoanAmount.value = '';
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const accClose = accounts.findIndex(acc => acc === currentAccount);
    accounts.splice(accClose, 1);
  }
  containerApp.style.opacity = 0;
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = 0;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// const arr = ['a', 'b', 'c', 'd', 'e'];
// console.log(arr.slice(2));

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an
 array (one array for each).For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult
  if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of 
Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a
 puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const checkDogs = function (dogsJulia, dogsKate) {
//   let shal = dogsJulia.slice();
//   shal = shal.filter(function (curr, ind, shal) {
//     if (ind != 0 && ind != shal.length && ind != shal.length - 1) return curr;
//   });
//   shal = [...shal, ...dogsKate];
//   shal.forEach(function (dog, i) {
//     if (dog >= 3) {
//       console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
//     } else {
//       console.log(`Dog number ${i + 1} is still a puppy 🐶`);
//     }
//   });
//   return shal;
// };
// console.log(checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]));

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and 
calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge.
 If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = function (ages) {
//   return ages.map(function (curr) {
//     if (curr <= 2) return 2 * curr;
//     else return 16 + curr * 4;
//   });
// };

// console.log(
//   calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3])
//     .filter(mov => mov >= 18)
//     .reduce(function (acc, curr, i, arr) {
//       return (acc + curr) / arr.length;
//     }, 0)
// );

// const calcAverageHumanAge1 = function (ages) {
//   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   const adults = humanAges.filter(age => age >= 18);
//   console.log(humanAges);
//   console.log(adults);

//   // const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;

//   const average = adults.reduce(
//     (acc, age, i, arr) => acc + age / arr.length,
//     0
//   );

//   // 2 3. (2+3)/2 = 2.5 === 2/2+3/2 = 2.5

//   return average;
// };
// const avg1 = calcAverageHumanAge1([5, 2, 4, 1, 15, 8, 3]);
// //const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1);

//Video 155
const euroToUsd = 1.1;
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * euroToUsd)
  .reduce((acc, mov) => acc + mov, 0);
