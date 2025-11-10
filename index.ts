enum DiscountTypes {
  FIXED = "fixed",
  PERCENTAGE = "percentage",
}

interface Discount {
  type: DiscountTypes;
}

interface PercentageDiscount extends Discount {
  percent: number;
}

interface FixedDiscount extends Discount {
  amount: number;
}

type DiscountT = PercentageDiscount | FixedDiscount;

interface Item {
  description: string;
  quantity: number;
  unitPrice: number;
  isEnabled: boolean;
  discounts?: DiscountT[];
}

type DiscountCalculatorParams = {
  discount: DiscountT;
  total: number;
  description: string;
};

const percentageGuard = (discount: DiscountT): discount is PercentageDiscount =>
  discount.type === DiscountTypes.PERCENTAGE;

const fixedGuard = (discount: DiscountT): discount is FixedDiscount =>
  discount.type === DiscountTypes.FIXED;

class BillingModule {
  private items: Item[];

  private getPercentsDiscount({
    discount,
    total,
    description,
  }: DiscountCalculatorParams) {
    if (!percentageGuard(discount))
      throw new Error(
        `Error 004 Wrong discount type came to percent discount calc from ${description}`
      );
    const { percent } = discount;

    console.log(`Applying percentage discount ${percent} for ${description}`);
    return total - (percent / 100) * total;
  }

  private getFixedDiscount({
    discount,
    total,
    description,
  }: DiscountCalculatorParams) {
    if (!fixedGuard(discount)) {
      throw new Error(
        `Error 004 Wrong discount type came to fixed discount calc from ${description}`
      );
    }
    const { amount } = discount;

    if (amount > total)
      throw new Error(
        `Error 003 Discount is higher than amount in ${description}`
      );

    console.log(`Applying fixed discount ${amount} for ${description}`);
    return total - amount;
  }

  private validateItems() {
    return this.items.filter((item) => item.isEnabled);
  }

  constructor(items: Item[]) {
    this.items = items;
  }

  public discountEngine = {
    [DiscountTypes.FIXED]: this.getFixedDiscount,
    [DiscountTypes.PERCENTAGE]: this.getPercentsDiscount,
  };

  getItemPrice = ({
    quantity,
    unitPrice,
    discounts,
    description,
  }: Item): number => {
    console.log(`Started calculating price for ${description}`);

    const amount = quantity * unitPrice;
    // if (amount <= 100) return amount;

    const discounted = discounts?.reduce(
      (total: number, discount: DiscountT) => {
        total = this.considerDiscount({ discount, total, description });
        return total;
      },
      amount
    );

    return discounted ?? amount;
  };

  considerDiscount({ discount, total, description }: DiscountCalculatorParams) {
    if (!discount.type)
      throw new Error(`Error 001 Discount has no type! In ${description}`);
    const calculator = this.discountEngine[discount.type];
    if (!calculator)
      throw new Error(`Error 002 Invalid discount type. In ${description}`);

    return calculator({ discount, total, description });
  }

  getTotalAmount(): number {
    try {
      const validItems = this.validateItems();

      const totalAmount = validItems.reduce((total, item) => {
        total += this.getItemPrice(item);
        return total;
      }, 0);

      return totalAmount;
    } catch (err) {
      console.error("Error while item price calculating: " + err.message);
      return NaN;
    }
  }
}

const billingModule = new BillingModule([
  {
    description: "Service A",
    quantity: 2,
    unitPrice: 50,
    isEnabled: true,
    discounts: [
      { type: DiscountTypes.FIXED, amount: 10 },
      { type: DiscountTypes.PERCENTAGE, percent: 20 },
    ],
  },
  {
    description: "Service A.1",
    quantity: 2,
    unitPrice: 50,
    isEnabled: true,
    discounts: [{ type: DiscountTypes.FIXED, amount: 1100 }],
  },
  {
    description: "Service B",
    quantity: 1,
    unitPrice: 80,
    isEnabled: true,
    discounts: [{ type: DiscountTypes.PERCENTAGE, percent: 50 }],
  },
  {
    description: "Service C",
    quantity: 100,
    unitPrice: 1_000,
    isEnabled: false,
  },
  // {
  //   description: "Service D",
  //   quantity: 100,
  //   unitPrice: 42,
  //   isEnabled: true,
  //   discounts: [{ type: "non-existing-type" as DiscountTypes, percent: 50 }],
  // },
]);

console.log(billingModule.getTotalAmount());
