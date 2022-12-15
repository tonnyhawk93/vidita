import { faker } from "@faker-js/faker";
import type { Document } from "../types";

export function createRandomDocument(): Document {
  return {
    id: faker.datatype.uuid(),
    status: faker.datatype.boolean() ? "active" : "archive",
    sum: Number(faker.finance.amount(1, 1000)),
    qty: faker.datatype.number({ min: 1, max: 10 }),
    volume: faker.datatype.number({ min: 1, max: 1000 }),
    name: faker.commerce.productName(),
    delivery_date: faker.date.future(1).toString(),
    currency: faker.finance.currencySymbol(),
  };
}
