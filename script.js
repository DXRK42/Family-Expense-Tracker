let expenses =
    JSON.parse(localStorage.getItem("familyExpenses")) || [];

const expenseName = document.getElementById("expenseName");
const amount = document.getElementById("amount");
const date = document.getElementById("date");
date.value = new Date().toISOString().split("T")[0];
const category = document.getElementById("category");
const paidBy = document.getElementById("paidBy");
const addButton = document.querySelector("button:not(#darkModeButton)");

const summaryBoxes = document.querySelectorAll(".summary-box p");
const memberSummary = document.getElementById("memberSummary");


// =========================
// SAVE EXPENSES
// =========================

function saveExpenses() {
    localStorage.setItem(
        "familyExpenses",
        JSON.stringify(expenses)
    );
}


// =========================
// DISPLAY EXPENSES
// =========================

const expenseCard = document.createElement("div");

expenseCard.className = "card";

expenseCard.innerHTML = `
    <h2>🧾 Expense History</h2>
    <div id="expenseList"></div>
`;

document
    .querySelector(".container")
    .appendChild(expenseCard);

const expenseList =
    document.getElementById("expenseList");


function displayExpenses() {

    expenseList.innerHTML = "";

    if (expenses.length === 0) {

        expenseList.innerHTML =
            "<p>No expenses added yet.</p>";

        updateSummary();
        updateMemberSummary();

        return;
    }


    expenses.forEach((expense, index) => {

        const item = document.createElement("div");

        item.style.padding = "15px";
        item.style.marginBottom = "10px";
        item.style.border = "1px solid #e5e7eb";
        item.style.borderRadius = "12px";
        item.style.display = "flex";
        item.style.justifyContent = "space-between";
        item.style.alignItems = "center";
        item.style.gap = "15px";


        item.innerHTML = `

            <div>
                <strong>${expense.name}</strong>

                <br>

                <small>
    ${expense.category}
    • Paid by ${expense.paidBy}
    • ${expense.date}
</small>
            </div>


            <div style="text-align:right">

                <strong>
                    ₹${expense.amount.toLocaleString("en-IN")}
                </strong>

                <br>

                <button
                    onclick="deleteExpense(${index})"
                    style="
                        margin-top:5px;
                        padding:6px 10px;
                        font-size:12px;
                        background:#ef4444;
                    "
                >
                    Delete
                </button>

            </div>
        `;


        expenseList.appendChild(item);

    });


    updateSummary();
    updateMemberSummary();
}


// =========================
// SUMMARY
// =========================

function updateSummary() {

    const total = expenses.reduce(
        (sum, expense) =>
            sum + expense.amount,
        0
    );


    summaryBoxes[0].textContent =
        `₹${total.toLocaleString("en-IN")}`;


    summaryBoxes[1].textContent =
        `₹${total.toLocaleString("en-IN")}`;
}


// =========================
// FAMILY MEMBER TOTALS
// =========================

function updateMemberSummary() {

    const members = {
        Dad: 0,
        Mom: 0,
        Me: 0,
        Other: 0
    };


    expenses.forEach(expense => {

        if (members[expense.paidBy] !== undefined) {

            members[expense.paidBy] +=
                expense.amount;

        }

    });


    memberSummary.innerHTML = "";


    Object.entries(members).forEach(
        ([member, total]) => {

            const box =
                document.createElement("div");

            box.className = "member-box";


            box.innerHTML = `
                <h3>${member}</h3>
                <p>
                    ₹${total.toLocaleString("en-IN")}
                </p>
            `;


            memberSummary.appendChild(box);

        }
    );
}


// =========================
// ADD EXPENSE
// =========================

addButton.addEventListener(
    "click",
    function () {

        const name =
            expenseName.value.trim();

        const money =
            Number(amount.value);


        if (name === "" || money <= 0) {

            alert(
                "Please enter an expense name and a valid amount."
            );

            return;
        }


        const newExpense = {

            name: name,

            amount: money,

            category:
                category.value,

                paidBy:
                paidBy.value,
            
            date:
                date.value

        };


        expenses.push(newExpense);


        // SAVE PERMANENTLY
        saveExpenses();


        displayExpenses();


        expenseName.value = "";
        amount.value = "";


        alert(
            "Expense added successfully! 🎉"
        );

    }
);


// =========================
// DELETE EXPENSE
// =========================

function deleteExpense(index) {

    expenses.splice(index, 1);

    saveExpenses();

    displayExpenses();
}


// =========================
// DARK MODE
// =========================

const darkModeButton =
    document.getElementById(
        "darkModeButton"
    );


function applyDarkMode() {

    const darkMode =
        localStorage.getItem("darkMode");


    if (darkMode === "true") {

        document.body.classList
            .add("dark-mode");

        darkModeButton.textContent =
            "☀️ Light Mode";

    } else {

        document.body.classList
            .remove("dark-mode");

        darkModeButton.textContent =
            "🌙 Dark Mode";
    }
}


darkModeButton.addEventListener(
    "click",
    function () {

        const isDark =
            document.body.classList
                .contains("dark-mode");


        localStorage.setItem(
            "darkMode",
            !isDark
        );


        applyDarkMode();

    }
);


// =========================
// START APP
// =========================

applyDarkMode();
displayExpenses();if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js");
    });
  }