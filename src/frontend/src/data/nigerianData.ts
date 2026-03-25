export const NIGERIAN_BANKS = [
  "GTBank",
  "Access Bank",
  "Zenith Bank",
  "First Bank",
  "UBA",
  "Fidelity Bank",
  "Sterling Bank",
  "Wema Bank",
  "Polaris Bank",
  "Jaiz Bank",
  "Heritage Bank",
  "Providus Bank",
  "Keystone Bank",
  "SunTrust Bank",
  "Titan Trust Bank",
  "Union Bank",
  "Citibank Nigeria",
  "Ecobank Nigeria",
  "Globus Bank",
  "Lotus Bank",
  "Premium Trust Bank",
  "Signature Bank",
  "Unity Bank",
  "VFD Microfinance Bank",
];

export const NIGERIAN_BANK_CODES: Record<string, string> = {
  GTBank: "058",
  "Access Bank": "044",
  "Zenith Bank": "057",
  "First Bank": "011",
  UBA: "033",
  "Fidelity Bank": "070",
  "Sterling Bank": "232",
  "Wema Bank": "035",
  "Polaris Bank": "076",
  "Jaiz Bank": "301",
  "Heritage Bank": "030",
  "Providus Bank": "101",
  "Keystone Bank": "082",
  "SunTrust Bank": "100",
  "Titan Trust Bank": "102",
  "Union Bank": "032",
  "Citibank Nigeria": "023",
  "Ecobank Nigeria": "050",
  "Globus Bank": "00103",
  "Lotus Bank": "303",
  "Premium Trust Bank": "105",
  "Signature Bank": "106",
  "Unity Bank": "215",
  "VFD Microfinance Bank": "090110",
};

const FIRST_NAMES = [
  "Chukwuemeka",
  "Adaobi",
  "Babatunde",
  "Ngozi",
  "Emeka",
  "Fatima",
  "Oluwaseun",
  "Chiamaka",
  "Ibrahim",
  "Chidinma",
  "Tunde",
  "Amaka",
  "Seun",
  "Kemi",
  "Dele",
  "Nkechi",
  "Ahmed",
  "Blessing",
  "Victor",
  "Peace",
];

const LAST_NAMES = [
  "Obi",
  "Nwosu",
  "Adeyemi",
  "Okonkwo",
  "Eze",
  "Abdullahi",
  "Afolabi",
  "Nwachukwu",
  "Musa",
  "Okafor",
  "Johnson",
  "Williams",
  "Bello",
  "Lawal",
  "Suleiman",
  "Chukwu",
  "Dike",
  "Ogundele",
  "Adesanya",
  "Nwofor",
];

export function mockBeneficiaryLookup(accountNumber: string): string {
  const seed = accountNumber.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const firstName = FIRST_NAMES[seed % FIRST_NAMES.length];
  const lastName = LAST_NAMES[(seed * 7) % LAST_NAMES.length];
  return `${firstName} ${lastName}`;
}

export function generateAccountNumber(): string {
  return Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join(
    "",
  );
}

export function formatAccountNumber(num: string): string {
  return num.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4");
}

export function formatNaira(kobo: bigint): string {
  const naira = Number(kobo) / 100;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(naira);
}

export const SAMPLE_TRANSACTIONS = [
  {
    id: "t1",
    type: "transfer",
    label: "Transfer to GTBank",
    amount: -250000n,
    date: "Today, 2:30 PM",
    status: "completed" as const,
  },
  {
    id: "t2",
    type: "airtime",
    label: "MTN Airtime",
    amount: -50000n,
    date: "Today, 10:15 AM",
    status: "completed" as const,
  },
  {
    id: "t3",
    type: "transfer",
    label: "Received from Emeka",
    amount: 500000n,
    date: "Yesterday, 6:00 PM",
    status: "completed" as const,
  },
  {
    id: "t4",
    type: "bill",
    label: "DSTV Subscription",
    amount: -250000n,
    date: "Dec 20, 9:00 AM",
    status: "completed" as const,
  },
  {
    id: "t5",
    type: "transfer",
    label: "Transfer to Access",
    amount: -100000n,
    date: "Dec 19, 3:45 PM",
    status: "pending" as const,
  },
];
