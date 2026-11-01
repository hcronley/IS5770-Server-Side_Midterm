# Question 11: dayjs

## Library

- **Name:** dayjs
- **Link:** https://day.js.org

## What I added

I added checkout badges that now show labels like "Due in 5 days", etc. The original due date will still appear when you hover over a badge.

## Why I picked it

I chose this this becuase it felt like the perfect quality of life addition to an app of this size. Instead of having to think about when certain is due by, you can quickly see when exactly it is due in easy to read language.

## Files that use it

- `utils/dates.js`: defines `dueLabel()`, which calls dayjs to count the days between the due date and today.
- `app.js`: registers `dueLabel` on `app.locals` so the views can call it.
- `views/partials/components/checkout-table.ejs`: shows the label in the status badge.

## Documentation pages I read

**Link:** https://day.js.org/docs/en/installation/node-js

I used this link to see how to install this dependency.

**Link:** https://day.js.org/docs/en/display/difference#docsNav

I used this page in the docs to help build the helper function.

## How it works

`dueLabel()` is a helper function using dayjs's `diff` to differentiate between the due date and the current date. We then use some logic to determine how many day's overdue it is, if it's due today, or if it's due in a certain number of days.