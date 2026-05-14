import type {Passenger} from "@/types/order.ts";
import type {Amount} from "@/types/group.ts";

export function calculateTotalPriceByPassengers(passengers: Passenger[], amounts: (Amount& {
  bookingAmounts?: Amount[]
  bookingItineraryId?: string
})[]): number {
  const countMap = passengers.reduce(
    (acc, p) => {
      acc[p.passengerType] += 1;
      return acc;
    },
    { adt: 0, chd: 0, inf: 0 }
  );

  const total = amounts.reduce((sum, amount) => {
    const count = countMap[amount.passengerType as 'adt' | 'chd' | 'inf'] || 0;
    const price = (Number(amount.printAmount) || 0) + (Number(amount.taxesAmount) || 0);
    const subtotal = Math.round(price * count * 100) / 100; // 这里是关键
    return sum + subtotal;
  }, 0);

  return Math.round(total * 100) / 100; // 最终总价再处理一遍
}
